# Design Document

## Overview

**問題：** 當前系統為了更新一個 Item，要遍歷所有 Trip（O(n³)）。這是垃圾設計。

**解決方案：** 重新設計 Database 接口，讓它直接操作 Item/Day，而不是通過 Trip。

**Linus 原則：**
- **數據結構優先**：用 Map 存儲，O(1) 查詢
- **消除特殊情況**：統一用 Zod 驗證
- **簡單實用**：接口只用域類型，不暴露 Prisma

## Architecture

### 當前架構（垃圾）

```
API → Database.updateTrip(id, trip) → 遍歷所有 Trip → 找到 Item → 更新
```

**問題：**
- O(n³) 複雜度
- API 要知道如何遍歷數據結構
- 從 MemoryDB 到 Prisma 要改很多代碼

### 新架構（正確）

```
API → Database.updateItem(id, data) → 直接更新
```

**優點：**
- O(1) 複雜度
- API 只調用方法，不管實現
- 換數據庫只改 `lib/db/index.ts` 一行

### 層次結構

```
┌─────────────────────────────────────┐
│  API Layer (app/api/*)              │
│  - 驗證輸入 (Zod)                    │
│  - 調用 Database 方法                │
│  - 返回 JSON                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Database Interface (lib/db/interface.ts) │
│  - 定義所有方法                       │
│  - 只用域類型                         │
└─────────────────────────────────────┘
              ↓
┌──────────────────┬──────────────────┐
│  MemoryDB        │  PrismaDB        │
│  (開發/測試)      │  (生產)          │
│  - Map 存儲      │  - SQL 查詢      │
│  - O(1) 查詢     │  - 事務支持      │
└──────────────────┴──────────────────┘
```

## Components and Interfaces

### Database Interface

```typescript
// lib/db/interface.ts
export interface Database {
  // Trip operations
  createTrip(trip: TripWithDetails): Promise<TripWithDetails>;
  getTripById(id: string): Promise<TripWithDetails | null>;
  getAllTrips(userId: string): Promise<TripWithDetails[]>;
  updateTrip(id: string, data: Partial<TripData>): Promise<TripWithDetails>;
  deleteTrip(id: string): Promise<void>;

  // Day operations (NEW!)
  createDay(tripId: string, data: Omit<DayData, 'id' | 'trip_id'>): Promise<DayData>;
  updateDay(id: string, data: Partial<DayData>): Promise<DayData>;
  deleteDay(id: string): Promise<void>;
  getDayById(id: string): Promise<DayData | null>;

  // Item operations (NEW!)
  createItem(dayId: string, data: Omit<ItemData, 'id' | 'day_id' | 'created_at'>): Promise<ItemData>;
  updateItem(id: string, data: Partial<ItemData>): Promise<ItemData>;
  deleteItem(id: string): Promise<void>;
  getItemById(id: string): Promise<ItemData | null>;

  // Checklist operations
  createChecklistItems(items: ChecklistItem[]): Promise<ChecklistItem[]>;
  getChecklistByTripId(tripId: string): Promise<ChecklistItem[]>;
  updateChecklistItem(id: string, item: ChecklistItem): Promise<ChecklistItem>;
  deleteChecklistItem(id: string): Promise<void>;

  // Packing operations
  createPackingItems(items: PackingItem[]): Promise<PackingItem[]>;
  getPackingByTripId(tripId: string): Promise<PackingItem[]>;
  updatePackingItem(id: string, item: PackingItem): Promise<PackingItem>;
  deletePackingItem(id: string): Promise<void>;
}
```

**關鍵設計決策：**
1. **只用域類型**：不暴露 Prisma 的 `include`、`select`
2. **明確參數**：`createItem(dayId, data)` 而不是 `createItem(data)` 然後在 data 裡放 dayId
3. **返回完整對象**：不返回 `void`，返回更新後的對象（方便前端）

### MemoryDB Implementation

```typescript
// lib/db/memory.ts
class MemoryDB implements Database {
  private trips: Map<string, TripWithDetails> = new Map();
  private days: Map<string, DayData> = new Map();        // NEW!
  private items: Map<string, ItemData> = new Map();      // NEW!
  private checklists: Map<string, ChecklistItem> = new Map();
  private packings: Map<string, PackingItem> = new Map();

  // Item operations - O(1)!
  async updateItem(id: string, data: Partial<ItemData>): Promise<ItemData> {
    const existing = this.items.get(id);
    if (!existing) throw new Error('Item not found');
    
    const updated = { ...existing, ...data };
    this.items.set(id, updated);
    return updated;
  }

  async deleteItem(id: string): Promise<void> {
    if (!this.items.has(id)) throw new Error('Item not found');
    this.items.delete(id);
  }

  async createItem(dayId: string, data: Omit<ItemData, 'id' | 'day_id' | 'created_at'>): Promise<ItemData> {
    // 驗證 parent Day 存在
    if (!this.days.has(dayId)) throw new Error('Day not found');
    
    const item: ItemData = {
      id: crypto.randomUUID(),
      day_id: dayId,
      created_at: new Date(),
      ...data,
    };
    
    this.items.set(item.id, item);
    return item;
  }

  // Day operations
  async deleteDay(id: string): Promise<void> {
    const day = this.days.get(id);
    if (!day) throw new Error('Day not found');
    
    // Cascade delete: 刪除所有 Items
    for (const [itemId, item] of this.items.entries()) {
      if (item.day_id === id) {
        this.items.delete(itemId);
      }
    }
    
    // 刪除 Day
    this.days.delete(id);
    
    // 重新排序 day_index
    const remainingDays = Array.from(this.days.values())
      .filter(d => d.trip_id === day.trip_id)
      .sort((a, b) => a.day_index - b.day_index);
    
    remainingDays.forEach((d, index) => {
      d.day_index = index + 1;
      this.days.set(d.id, d);
    });
  }

  // Trip operations - 現在從 Map 組裝
  async getTripById(id: string): Promise<TripWithDetails | null> {
    const trip = this.trips.get(id);
    if (!trip) return null;
    
    // 從 days Map 獲取
    const days = Array.from(this.days.values())
      .filter(d => d.trip_id === id)
      .sort((a, b) => a.day_index - b.day_index);
    
    // 從 items Map 獲取
    const daysWithItems = days.map(day => ({
      ...day,
      items: Array.from(this.items.values())
        .filter(i => i.day_id === day.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    }));
    
    return {
      ...trip,
      days: daysWithItems,
    };
  }
}
```

**關鍵設計決策：**
1. **三個 Map**：`trips`、`days`、`items` 分開存儲
2. **O(1) 操作**：直接 `map.get(id)`，不遍歷
3. **組裝時連接**：`getTripById` 時才組裝完整結構
4. **Cascade delete**：刪除 Day 時自動刪除 Items

### API Layer Changes

**之前（垃圾）：**
```typescript
// app/api/trips/items/[id]/route.ts
export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  
  // 遍歷所有 Trip！
  const allTrips = await db.getAllTrips('');
  
  let targetTrip = null;
  for (const trip of allTrips) {
    for (const day of trip.days) {
      const item = day.items.find(i => i.id === id);
      if (item) {
        targetTrip = trip;
        // 更新 item...
        break;
      }
    }
  }
  
  await db.updateTrip(targetTrip.id, targetTrip);
  return NextResponse.json(updatedItem);
}
```

**之後（正確）：**
```typescript
// app/api/trips/items/[id]/route.ts
const UpdateItemSchema = z.object({
  type: z.enum(['flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other']).optional(),
  title: z.string().min(1).max(200).optional(),
  date: z.coerce.date().nullable().optional(),
  time: z.string().max(10).nullable().optional(),
  time_hint: z.enum(['morning', 'afternoon', 'evening', 'full_day']).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  link: z.string().max(500).nullable().optional(),
  note: z.string().max(1000).nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 驗證
    const validatedData = UpdateItemSchema.parse(body);
    
    // 直接更新
    const updatedItem = await db.updateItem(id, validatedData);
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
```

**從 50 行減少到 20 行！**

## Data Models

### 核心實體

```typescript
// lib/types/template.ts

// Trip - 旅程
export interface TripData {
  id: string;
  template_id: string;
  user_id: string;
  title: string;
  start_date: Date | null;
  people_count: number | null;
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

// Day - 天數
export interface DayData {
  id: string;
  trip_id: string;
  day_index: number;
  label: string;
  city: string | null;
  is_ski_day: boolean;
}

// Item - 行程項目
export interface ItemData {
  id: string;
  day_id: string;
  type: ItemType;
  title: string;
  date: Date | null;
  time: string | null;
  time_hint: TimeHint | null;
  location: string | null;
  link: string | null;
  note: string | null;
  created_at: Date;
}

// TripWithDetails - 完整結構（用於查詢）
export interface TripWithDetails extends TripData {
  days: (DayData & {
    items: ItemData[];
  })[];
}
```

**關鍵設計決策：**
1. **分離的類型**：`TripData`、`DayData`、`ItemData` 獨立定義
2. **組合類型**：`TripWithDetails` 用於需要完整結構的場景
3. **明確的 null**：`Date | null` 而不是 `Date | undefined`

### 數據關係

```
Trip (1) ──┬──> Day (N) ──┬──> Item (N)
           │              │
           ├──> ChecklistItem (N)
           │
           └──> PackingItem (N)
```

**Cascade Delete 規則：**
- 刪除 Trip → 刪除所有 Day、Item、ChecklistItem、PackingItem
- 刪除 Day → 刪除所有 Item，重新排序剩餘 Day 的 day_index

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Item creation returns complete object
*For any* valid dayId and Item data, creating an Item should return a complete ItemData object with a generated UUID and created_at timestamp.
**Validates: Requirements 1.3, 5.2**

### Property 2: Non-existent parent throws error
*For any* non-existent Day ID, attempting to create an Item should throw an error containing "not found".
**Validates: Requirements 1.5, 2.5, 8.2**

### Property 3: Day creation returns complete object
*For any* valid tripId and Day data, creating a Day should return a complete DayData object with generated UUID and empty items array when queried.
**Validates: Requirements 2.1, 5.4**

### Property 4: Cascade delete removes all children
*For any* Day with Items, deleting the Day should result in all associated Items being deleted as well.
**Validates: Requirements 2.3, 8.1**

### Property 5: Day deletion reorders indices
*For any* Trip with multiple Days, deleting a Day should result in the remaining Days having consecutive day_index values starting from 1.
**Validates: Requirements 2.4**

### Property 6: Validation errors return 400
*For any* invalid input to an API endpoint, the response should have status 400 and include Zod error details.
**Validates: Requirements 3.2, 7.4**

### Property 7: Empty strings normalize to null
*For any* nullable field receiving an empty string, the stored value should be null.
**Validates: Requirements 3.5**

### Property 8: Update returns updated object
*For any* Item update, the API response should contain the updated Item with all changes applied.
**Validates: Requirements 5.1**

### Property 9: Not found returns 404
*For any* non-existent entity ID, the API should return status 404 with an error message containing the entity type.
**Validates: Requirements 7.3**

### Property 10: Unexpected errors return 500
*For any* unexpected error during API execution, the response should have status 500 and include an error message.
**Validates: Requirements 7.5**

### Property 11: Update non-existent throws error
*For any* non-existent entity ID, attempting to update should throw an error containing "not found".
**Validates: Requirements 8.3**

## Error Handling

### Error Types

```typescript
// lib/errors.ts (NEW!)
export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### API Error Handling Pattern

```typescript
// 統一的錯誤處理
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 業務邏輯
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    // Not Found 錯誤
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

## Testing Strategy

### Unit Tests

**測試 Database 實現：**
```typescript
// lib/db/__tests__/memory.test.ts
describe('MemoryDB', () => {
  let db: MemoryDB;
  
  beforeEach(() => {
    db = new MemoryDB();
  });
  
  describe('Item operations', () => {
    it('should create item with valid day_id', async () => {
      const trip = await db.createTrip(/* ... */);
      const day = trip.days[0];
      
      const item = await db.createItem(day.id, {
        type: 'flight',
        title: 'Test Flight',
        // ...
      });
      
      expect(item.id).toBeDefined();
      expect(item.day_id).toBe(day.id);
    });
    
    it('should throw when creating item with invalid day_id', async () => {
      await expect(
        db.createItem('invalid-id', { type: 'flight', title: 'Test' })
      ).rejects.toThrow('Day not found');
    });
    
    it('should update item directly', async () => {
      const trip = await db.createTrip(/* ... */);
      const item = trip.days[0].items[0];
      
      const updated = await db.updateItem(item.id, { title: 'New Title' });
      
      expect(updated.title).toBe('New Title');
    });
  });
  
  describe('Day operations', () => {
    it('should cascade delete items when deleting day', async () => {
      const trip = await db.createTrip(/* ... */);
      const day = trip.days[0];
      const itemId = day.items[0].id;
      
      await db.deleteDay(day.id);
      
      await expect(db.getItemById(itemId)).resolves.toBeNull();
    });
    
    it('should reorder day_index after deletion', async () => {
      const trip = await db.createTrip(/* ... */);
      const dayToDelete = trip.days[1]; // Day 2
      
      await db.deleteDay(dayToDelete.id);
      
      const updated = await db.getTripById(trip.id);
      expect(updated!.days).toHaveLength(trip.days.length - 1);
      expect(updated!.days[0].day_index).toBe(1);
      expect(updated!.days[1].day_index).toBe(2);
      // 原本的 Day 3 變成 Day 2
    });
  });
});
```

### Property-Based Tests

**配置：** 使用 `fast-check` 庫（JavaScript 的 QuickCheck）

```typescript
// lib/db/__tests__/memory.property.test.ts
import fc from 'fast-check';

describe('MemoryDB Properties', () => {
  // Property 1: Item creation returns complete object
  it('should return complete Item for any valid input', () => {
    fc.assert(
      fc.asyncProperty(
        fc.string(), // title
        fc.constantFrom('flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other'), // type
        async (title, type) => {
          const db = new MemoryDB();
          const trip = await db.createTrip(/* ... */);
          const dayId = trip.days[0].id;
          
          const item = await db.createItem(dayId, { type, title });
          
          expect(item.id).toBeDefined();
          expect(item.day_id).toBe(dayId);
          expect(item.title).toBe(title);
          expect(item.type).toBe(type);
          expect(item.created_at).toBeInstanceOf(Date);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 2: Non-existent parent throws error
  it('should throw for any non-existent Day ID', () => {
    fc.assert(
      fc.asyncProperty(
        fc.uuid(), // random UUID
        async (invalidDayId) => {
          const db = new MemoryDB();
          
          await expect(
            db.createItem(invalidDayId, { type: 'flight', title: 'Test' })
          ).rejects.toThrow('not found');
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 4: Cascade delete removes all children
  it('should delete all Items when Day is deleted', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }), // number of items
        async (numItems) => {
          const db = new MemoryDB();
          const trip = await db.createTrip(/* ... */);
          const day = trip.days[0];
          
          // 創建多個 Items
          const itemIds: string[] = [];
          for (let i = 0; i < numItems; i++) {
            const item = await db.createItem(day.id, {
              type: 'note',
              title: `Item ${i}`,
            });
            itemIds.push(item.id);
          }
          
          // 刪除 Day
          await db.deleteDay(day.id);
          
          // 驗證所有 Items 都被刪除
          for (const itemId of itemIds) {
            await expect(db.getItemById(itemId)).resolves.toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Tests

**測試 API 端點：**
```typescript
// app/api/trips/items/__tests__/route.test.ts
describe('PATCH /api/trips/items/[id]', () => {
  it('should update item and return updated object', async () => {
    // 創建測試數據
    const trip = await db.createTrip(/* ... */);
    const item = trip.days[0].items[0];
    
    // 調用 API
    const response = await PATCH(
      new NextRequest('http://localhost/api/trips/items/' + item.id, {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Title' }),
      }),
      { params: Promise.resolve({ id: item.id }) }
    );
    
    // 驗證響應
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.title).toBe('Updated Title');
  });
  
  it('should return 404 for non-existent item', async () => {
    const response = await PATCH(
      new NextRequest('http://localhost/api/trips/items/invalid-id', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Test' }),
      }),
      { params: Promise.resolve({ id: 'invalid-id' }) }
    );
    
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toContain('not found');
  });
  
  it('should return 400 for invalid input', async () => {
    const trip = await db.createTrip(/* ... */);
    const item = trip.days[0].items[0];
    
    const response = await PATCH(
      new NextRequest('http://localhost/api/trips/items/' + item.id, {
        method: 'PATCH',
        body: JSON.stringify({ title: '' }), // 空標題無效
      }),
      { params: Promise.resolve({ id: item.id }) }
    );
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });
});
```

### 測試覆蓋目標

- **Unit Tests**: 核心業務邏輯 100%
- **Property Tests**: 所有 CRUD 操作
- **Integration Tests**: 所有 API 端點
- **總測試數**: 預計 50+ 個測試

## Migration Path

### Phase 1: 更新 Database Interface
1. 在 `lib/db/interface.ts` 添加新方法
2. 更新 MemoryDB 實現
3. 運行現有測試，確保沒有破壞

### Phase 2: 重構 API 層
1. 更新 `app/api/trips/items/[id]/route.ts`
2. 更新 `app/api/trips/days/[id]/items/route.ts`
3. 添加新的 API 端點（如果需要）

### Phase 3: 添加測試
1. 寫 Unit Tests
2. 寫 Property Tests
3. 寫 Integration Tests

### Phase 4: 實現 PrismaDB
1. 創建 `lib/db/prisma.ts`
2. 實現所有 Database 方法
3. 運行所有測試，確保行為一致

### Phase 5: 切換到 Prisma
1. 更新 `lib/db/index.ts`：`export { db } from './prisma'`
2. 運行所有測試
3. 部署到生產環境

## Performance Considerations

### 當前性能（垃圾）
- 更新 Item: O(n³) - 遍歷所有 Trip、Day、Item
- 100 個 Trip × 6 天 × 10 Items = 6000 次迭代

### 新性能（正確）
- 更新 Item: O(1) - 直接 `map.get(id)`
- 1 次查詢

### MemoryDB 性能
- 所有操作: O(1) 使用 Map
- 組裝 TripWithDetails: O(n) 其中 n = Days + Items

### PrismaDB 性能
- 單個查詢: O(1) 使用索引
- 組裝 TripWithDetails: 1 次 SQL 查詢（JOIN）

## Security Considerations

### 輸入驗證
- 所有 API 輸入使用 Zod 驗證
- 防止 SQL 注入（Prisma 自動處理）
- 防止 XSS（前端責任）

### 授權
- 當前未實現（MVP 階段）
- 未來：檢查 `user_id` 是否匹配

### 錯誤信息
- 不暴露內部實現細節
- 404 錯誤只返回 "Entity not found"
- 500 錯誤只返回通用消息

## Future Enhancements

### 短期（Phase 4+）
1. 添加事務支持（Prisma）
2. 添加批量操作（`updateManyItems`）
3. 添加查詢過濾（`getItemsByType`）

### 長期
1. 添加緩存層（Redis）
2. 添加審計日誌
3. 添加軟刪除（`deleted_at`）
4. 添加樂觀鎖（`version` 字段）

## Conclusion

這個重構解決了當前架構的核心問題：

1. **性能**：從 O(n³) 到 O(1)
2. **簡單**：API 代碼從 50 行減少到 20 行
3. **可維護**：清晰的層次結構
4. **可測試**：使用 MemoryDB，不需要 mock
5. **可擴展**：從 MemoryDB 到 Prisma 只改一行

**Linus 會說：** "這才是正確的數據結構。"
