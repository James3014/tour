# ⛷️ 滑雪旅程規劃系統

MVP 版本 - 基於模板的滑雪旅程規劃工具

## 🚀 在線演示

**Zeabur 部署:** https://tour-app.zeabur.app

## ✨ 核心功能

### 已實現（完整功能）

#### 1. 模板系統 ✅
- **6 個硬編碼滑雪模板**
  - 北海道 6 日（3 滑 1 市區）
  - 北海道 8 日豪華版（二世古 + 富良野，5 天滑雪）
  - 東北 5 日（3 天滑雪）
  - 長野 5 日（白馬滑雪）
  - 新潟 4 日（苗場快閃）
  - 韓國 4 日（龍平滑雪）

- **模板選擇 UI**
  - 卡片展示所有模板
  - 顯示天數、滑雪天數、適合族群
  - 一鍵創建旅程

#### 2. 旅程管理（Flow 1 & 2）✅
- **旅程創建**（Flow 1）
  - 從模板創建新旅程
  - 自動展開所有天數（Day）和項目（Item）
  - 多日自動生成（2-10 天可配置）

- **旅程編輯**（Flow 2）
  - Day-by-day 多日展示
  - 雙 Tab 切換：行程 / 準備事項

#### 3. Item 項目管理 ✅（TDD 開發）
- **Item 編輯**
  - 內嵌編輯表單（藍色邊框）
  - 8 種類型：航班、住宿、交通、滑雪、課程、待辦、筆記、其他
  - 完整欄位：類型、標題、日期、時間、時段、地點、連結、備註
  - 即時儲存、取消編輯

- **Item 新增**（NEW! TDD 實現）
  - 內嵌新增表單（綠色邊框）
  - 與編輯表單一致的欄位
  - 驗證：標題必填
  - API: POST `/api/trips/days/[id]/items`
  - 測試: 6 個單元測試

- **Item 刪除**
  - 確認對話框
  - API: DELETE `/api/trips/items/[id]`

#### 4. 行前準備清單 ✅（TDD 開發）
- **Checklist 檢查清單**（NEW! TDD 實現）
  - 勾選/取消勾選即時更新
  - 4 大類別：訂購前確認、訂購後準備、出發前確認、其他
  - 已完成項目自動劃線
  - API: PATCH `/api/trips/checklist/[id]`
  - 測試: 6 個單元測試

- **Packing 打包清單**（NEW! TDD 實現）
  - 勾選/取消勾選即時更新
  - 6 大類別：衣物、裝備、配件、電子、盥洗、其他
  - 已完成項目自動劃線
  - API: PATCH `/api/trips/packing/[id]`
  - 測試: 6 個單元測試

#### 5. TDD 開發 ✅
- **33/33 單元測試通過** ✅
  - Trip 創建與多日展開（15 tests）
  - Item 新增功能（6 tests）
  - Checklist 切換功能（6 tests）
  - Packing 切換功能（6 tests）
- **測試覆蓋率**
  - 核心業務邏輯 100%
  - Jest + TypeScript
  - Red → Green → Refactor 循環

## 🏗️ 技術架構

```
技術棧：
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (schema 已定義)
- Jest (單元測試)

架構設計（Linus 風格）：
- 簡單：Template → Trip/Day/Item 三層結構
- 清晰：數據所有權明確，零特殊情況
- 可擴展：硬編碼模板可輕鬆遷移到資料庫
```

## 🔌 API 端點

### Templates
- `GET /api/templates` - 獲取所有模板

### Trips
- `POST /api/trips` - 創建新旅程（從模板）
- `GET /api/trips/:id` - 獲取旅程詳情
- `PATCH /api/trips/:id` - 更新旅程
- `DELETE /api/trips/:id` - 刪除旅程

### Items
- `POST /api/trips/days/:id/items` - 新增 Item 到指定天數
- `PATCH /api/trips/items/:id` - 更新 Item
- `DELETE /api/trips/items/:id` - 刪除 Item

### Checklist & Packing
- `GET /api/trips/:id/checklist` - 獲取旅程的 Checklist
- `GET /api/trips/:id/packing` - 獲取旅程的 Packing List
- `PATCH /api/trips/checklist/:id` - 切換 Checklist 項目狀態
- `PATCH /api/trips/packing/:id` - 切換 Packing 項目狀態

## 📂 專案結構

```
tour/
├── app/
│   ├── page.tsx                           # 首頁
│   ├── templates/
│   │   ├── page.tsx                       # 模板選擇頁
│   │   └── [id]/
│   │       ├── page.tsx                   # 模板詳情頁
│   │       └── create/page.tsx            # 創建旅程頁
│   ├── trips/[id]/page.tsx               # 旅程詳情頁（主要編輯介面）
│   └── api/
│       ├── templates/route.ts             # GET /api/templates
│       └── trips/
│           ├── route.ts                   # POST /api/trips (創建)
│           ├── [id]/
│           │   ├── route.ts              # GET/PATCH/DELETE /api/trips/:id
│           │   ├── checklist/route.ts    # GET /api/trips/:id/checklist
│           │   └── packing/route.ts      # GET /api/trips/:id/packing
│           ├── checklist/[id]/route.ts   # PATCH /api/trips/checklist/:id (切換)
│           ├── packing/[id]/route.ts     # PATCH /api/trips/packing/:id (切換)
│           ├── items/[id]/route.ts       # PATCH/DELETE /api/trips/items/:id
│           └── days/[id]/items/route.ts  # POST /api/trips/days/:id/items (新增)
├── lib/
│   ├── types/template.ts                  # TypeScript 類型定義
│   ├── templates/                         # 硬編碼模板
│   │   ├── hokkaido-6d.ts
│   │   ├── hokkaido-8d-deluxe.ts
│   │   ├── tohoku-5d.ts
│   │   ├── nagano-5d.ts
│   │   ├── niigata-4d.ts
│   │   ├── korea-4d.ts
│   │   ├── checklists/                   # Checklist 模板
│   │   ├── packing/                      # Packing 模板
│   │   └── index.ts
│   ├── services/
│   │   ├── trip.ts                       # Trip 核心邏輯
│   │   ├── item.ts                       # Item 核心邏輯（NEW）
│   │   ├── checklist.ts                  # Checklist/Packing 核心邏輯（NEW）
│   │   └── __tests__/
│   │       ├── trip.test.ts             # 15 tests
│   │       ├── item.test.ts             # 6 tests（NEW）
│   │       ├── checklist.test.ts        # 6 tests（NEW）
│   │       └── packing.test.ts          # 6 tests（NEW）
│   └── db/
│       ├── interface.ts                  # Database 介面定義
│       ├── memory.ts                     # In-memory 實現
│       └── prisma.ts                     # Prisma 實現
└── prisma/schema.prisma                  # 資料庫 schema
```

## 🧪 測試

**測試狀態: 33/33 通過** ✅

```bash
# 運行所有測試
npm test

# 監聽模式
npm run test:watch

# 測試覆蓋率
npm run test:coverage
```

### 測試明細
- ✅ **Trip 核心邏輯**（15 tests）
  - 基本創建流程
  - 多日展開（2-10 天）
  - 錯誤處理（空 template_id, 無效天數）
- ✅ **Item 新增功能**（6 tests）
  - 基本新增
  - 唯一 ID 生成
  - 可選欄位處理
  - 驗證（空標題、空 day_id）
- ✅ **Checklist 切換**（6 tests）
  - 完成/未完成切換
  - 不可變性（返回新物件）
  - 資料完整性
  - 多次切換
- ✅ **Packing 切換**（6 tests）
  - 完成/未完成切換
  - 不可變性（返回新物件）
  - 資料完整性
  - 多次切換

## 🛠️ 本地開發

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 構建
npm run build

# 生產模式
npm start
```

訪問 http://localhost:3000

## 📊 數據模型

### 核心實體

#### Template（模板）
```typescript
interface Template {
  template_id: string;          // 唯一識別碼
  name: string;                 // 模板名稱
  region: string;               // 地區（北海道、長野等）
  default_days: number;         // 預設天數
  default_ski_days: number;     // 預設滑雪天數
  target_group: string;         // 適合族群
  description: string;          // 描述
  day_templates: DayTemplate[]; // 天數模板陣列
}
```

#### Trip（實際旅程）
```typescript
interface TripWithDetails {
  id: string;                   // 唯一識別碼
  template_id: string;          // 來源模板
  user_id: string;              // 用戶 ID
  title: string;                // 旅程標題
  start_date: Date | null;      // 開始日期
  people_count: number | null;  // 人數
  note: string | null;          // 備註
  created_at: Date;
  updated_at: Date;
  days: DayWithItems[];         // 天數（含 Items）
}
```

#### Day（某天）
```typescript
interface DayData {
  id: string;
  trip_id: string;              // 所屬旅程
  day_index: number;            // 第幾天（0-based）
  label: string;                // 標籤（如：Day 1）
  city: string | null;          // 城市
  is_ski_day: boolean;          // 是否為滑雪日
  created_at: Date;
}
```

#### Item（某天上的事件）
```typescript
interface ItemData {
  id: string;
  day_id: string;               // 所屬天數
  type: ItemType;               // 類型（8 種）
  title: string;                // 標題
  date: Date | null;            // 日期
  time: string | null;          // 時間
  time_hint: TimeHint | null;   // 時段（早上/下午/晚上/全天）
  location: string | null;      // 地點
  link: string | null;          // 連結
  note: string | null;          // 備註
  created_at: Date;
}

// ItemType: 'flight' | 'hotel' | 'transfer' | 'ski' | 'lesson' | 'todo' | 'note' | 'other'
```

#### ChecklistItem（檢查清單項目）
```typescript
interface ChecklistItem {
  id: string;
  trip_id: string;
  category: ChecklistCategory;  // 4 大類別
  title: string;
  completed: boolean;           // 是否完成
  order: number;
  created_at: Date;
}

// ChecklistCategory: 'before_booking' | 'after_booking' | 'before_departure' | 'other'
```

#### PackingItem（打包清單項目）
```typescript
interface PackingItem {
  id: string;
  trip_id: string;
  category: PackingCategory;    // 6 大類別
  title: string;
  completed: boolean;           // 是否完成
  order: number;
  created_at: Date;
}

// PackingCategory: 'clothing' | 'equipment' | 'accessories' | 'electronics' | 'toiletries' | 'other'
```

## 🚧 Roadmap（開發計劃）

### ✅ 已完成（Phase 1 & 2）
- ✅ 6 個滑雪模板（硬編碼）
- ✅ 模板選擇 UI
- ✅ Flow 1: Template → Create Trip
- ✅ Flow 2: Trip 詳情頁（多日展開）
- ✅ Item 完整編輯功能（編輯/新增/刪除）
- ✅ Checklist 功能（勾選/取消）
- ✅ Packing List 功能（勾選/取消）
- ✅ 33 個單元測試（TDD 開發）

### 🔄 進行中（Phase 3）
- [ ] Day 新增/刪除功能
  - 動態新增天數
  - 刪除天數（含確認）
  - 重新排序 day_index
- [ ] 錯誤處理優化
  - 統一錯誤訊息
  - Loading 狀態
  - 樂觀更新（Optimistic UI）

### 📅 近期計劃（Phase 4）
- [ ] 連接真實 PostgreSQL
  - Prisma migrate
  - 資料持久化
  - 環境變數配置
- [ ] 用戶認證
  - NextAuth.js 整合
  - Google OAuth
  - 多用戶隔離
- [ ] UI/UX 優化
  - 添加 favicon
  - 響應式設計
  - 深色模式

### 🌟 未來願景（Phase 5+）
- [ ] 模板管理後台
  - 自定義模板
  - 模板分享
  - 社群模板庫
- [ ] 協作功能
  - 分享旅程連結
  - 多人編輯
  - 評論/討論
- [ ] 進階功能
  - 預算追蹤
  - 天氣資訊整合
  - 地圖導覽
  - 行程匯出（PDF/iCal）

## 📝 開發原則

**Linus Torvalds 風格**
- "Talk is cheap. Show me the code."
- 數據結構優先：好的數據結構 > 複雜的程式碼
- 消除特殊情況：通過設計消除 if/else
- 簡單實用：解決實際問題，不過度設計
- 向後兼容：Never break userspace

**TDD 方法論**
- Red → Green → Refactor
- 測試先行，確保需求明確
- 小步迭代，頻繁提交
- 100% 核心邏輯測試覆蓋

## 🎯 最近更新（2025-01）

### Phase 2 完成 ✅（3 個主要功能）

**Commit 歷史：**
```
5ccc218 feat: 實現 Packing 勾選功能（TDD）
6295e51 feat: 實現 Checklist 勾選功能（TDD）
1d390d8 feat: 實現 Item 新增功能（TDD）
e930f4c docs: 新增完整測試指南
b600373 feat: 實現 Item 完整編輯功能
```

**成就：**
- ✅ 33 個單元測試全部通過
- ✅ 3 個核心功能完成（Item 新增、Checklist、Packing）
- ✅ 嚴格遵循 TDD 紅綠重構循環
- ✅ Linus 原則：簡單、不可變、統一處理

**技術亮點：**
- 使用 `crypto.randomUUID()` 生成唯一 ID
- 不可變性：所有狀態切換返回新物件
- 統一 API 設計：一致的錯誤處理和驗證
- 內嵌表單：藍色編輯 / 綠色新增，視覺區分清晰

## 📄 授權

MIT License

---

**開發中** - Phase 2 完成 | 33/33 測試通過 | TDD + Linus 風格 ✅
