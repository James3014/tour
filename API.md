# 🔌 API 文檔

## 基礎資訊

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **錯誤格式**: `{ error: string, details?: any }`

---

## Templates

### GET /api/templates
獲取所有模板

**Response**
```json
[
  {
    "id": "hokkaido-6d",
    "title": "北海道 6 日",
    "description": "經典入門路線",
    "days": 6
  }
]
```

---

## Trips

### POST /api/trips
從模板創建新旅程

**Request**
```json
{
  "template_id": "hokkaido-6d",
  "user_id": "user123",
  "title": "我的北海道之旅",
  "start_date": "2025-12-25",
  "days": 6,
  "people_count": 2,
  "note": "備註"
}
```

**Response**: `TripWithDetails`

### GET /api/trips/:id
獲取旅程詳情

**Response**: `TripWithDetails`

### PATCH /api/trips/:id
更新旅程

**Request**
```json
{
  "title": "新標題",
  "start_date": "2025-12-26",
  "people_count": 3,
  "notes": "新備註"
}
```

**Response**: `TripWithDetails`

### DELETE /api/trips/:id
刪除旅程

**Response**: `{ success: true }`

---

## Days

### POST /api/trips/days
創建新的 Day

**Request**
```json
{
  "trip_id": "trip123",
  "day_index": 1,
  "label": "第 1 天"
}
```

**Response**: `DayData`

### PATCH /api/trips/days/:id
更新 Day

**Request**
```json
{
  "day_index": 2,
  "label": "第 2 天"
}
```

**Response**: `DayData`

### DELETE /api/trips/days/:id
刪除 Day（cascade delete Items）

**Response**: `{ success: true }`

---

## Items

### POST /api/trips/days/:id/items
新增 Item 到指定天數

**Request**
```json
{
  "type": "flight",
  "title": "桃園 → 新千歲",
  "date": "2025-12-25",
  "time": "08:00",
  "time_period": "morning",
  "location": "桃園機場",
  "link": "https://...",
  "notes": "備註"
}
```

**Response**: `ItemData`

### PATCH /api/trips/items/:id
更新 Item

**Request**: 同上（所有欄位 optional）

**Response**: `ItemData`

### DELETE /api/trips/items/:id
刪除 Item

**Response**: `{ success: true }`

---

## Checklist

### GET /api/trips/:id/checklist
獲取旅程的 Checklist

**Response**
```json
[
  {
    "id": "check1",
    "trip_id": "trip123",
    "category": "pre_booking",
    "title": "確認護照效期",
    "completed": false,
    "order": 1
  }
]
```

### PATCH /api/trips/checklist/:id
切換 Checklist 項目狀態

**Response**: `ChecklistItem`

---

## Packing

### GET /api/trips/:id/packing
獲取旅程的 Packing List

**Response**
```json
[
  {
    "id": "pack1",
    "trip_id": "trip123",
    "category": "clothing",
    "title": "雪衣",
    "completed": false,
    "order": 1
  }
]
```

### PATCH /api/trips/packing/:id
切換 Packing 項目狀態

**Response**: `PackingItem`

---

## 類型定義

### TripWithDetails
```typescript
{
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  start_date: Date | null;
  people_count: number | null;
  notes: string | null;
  created_at: Date;
  days: DayData[];
}
```

### DayData
```typescript
{
  id: string;
  trip_id: string;
  day_index: number;
  label: string;
  items: ItemData[];
}
```

### ItemData
```typescript
{
  id: string;
  day_id: string;
  type: 'flight' | 'hotel' | 'transfer' | 'ski' | 'lesson' | 'todo' | 'note' | 'other';
  title: string;
  date: Date | null;
  time: string | null;
  time_period: 'morning' | 'afternoon' | 'evening' | 'night' | null;
  location: string | null;
  link: string | null;
  notes: string | null;
  created_at: Date;
}
```

---

## 錯誤碼

| Status | 說明 |
|--------|------|
| 400 | 驗證失敗 |
| 404 | 資源不存在 |
| 500 | 伺服器錯誤 |

---

## 效能優化

- ✅ **O(1) 查詢**: 所有 Item/Day 操作都是直接查詢
- ✅ **樂觀更新**: 前端立即反映變更
- ✅ **統一錯誤處理**: 一致的錯誤格式
