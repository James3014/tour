# ⛷️ 滑雪旅程規劃系統

MVP 版本 - 基於模板的滑雪旅程規劃工具

## 🚀 在線演示

**Zeabur 部署:** https://tour-app.zeabur.app

## ✨ 核心功能

### 已實現（完整功能）

#### 1. 模板系統 ✅
- **5 個對應實際雪場的模板**
  - 北海道 6 日（3 滑 1 市區）：經典入門
  - 北海道 8 日豪華版（二世谷 + 富良野）：進階玩家
  - 長野 5 日（白馬多雪場）：粉雪 & 多樣地形
  - 新潟 4 日（苗場／田代）：週末快閃、交通最方便
  - 東北 5 日（安比 + 藏王）：樹冰 + 粉雪 + 溫泉療癒

#### 2. 旅程管理（Flow 1 & 2）✅
- **旅程創建**（Flow 1）
  - 從模板創建新旅程
  - 自動展開所有天數（Day）和項目（Item）
  - 多日自動生成（2-10 天可配置）

- **旅程編輯**（Flow 2）
  - Day-by-day 多日展示
  - 雙 Tab 切換：行程 / 準備事項
  - **智能日期顯示**：自動計算並顯示每天的具體日期（例如 "第 1 天 (12/25)"）

#### 3. Item 項目管理 ✅（TDD 開發 + UX 優化）
- **Item 編輯與新增**
  - **Zod 前端驗證**：即時錯誤提示，確保資料正確性
  - **極簡表單設計**：預設折疊次要欄位（地點、連結、備註），專注於核心資訊
  - **自動排序**：行程根據時間 > 時段 > 創建順序自動排列
  - 8 種類型：航班、住宿、交通、滑雪、課程、待辦、筆記、其他
  - 完整欄位：類型、標題、日期、時間、時段、地點、連結、備註

- **Item 刪除**
  - 確認對話框
  - **樂觀更新**：刪除操作立即反映在 UI，無需等待伺服器回應

#### 4. 行前準備清單 ✅（TDD 開發）
- **Checklist 檢查清單**
  - 勾選/取消勾選即時更新（樂觀更新）
  - 4 大類別：訂購前確認、訂購後準備、出發前確認、其他
  - 已完成項目自動劃線

- **Packing 打包清單**
  - 勾選/取消勾選即時更新（樂觀更新）
  - 6 大類別：衣物、裝備、配件、電子、盥洗、其他
  - 已完成項目自動劃線

#### 5. 極致效能與體驗 ✅
- **樂觀更新 (Optimistic Updates)**：所有操作（新增、修改、刪除、勾選）皆為即時響應，提供原生 App 般的流暢體驗。
- **骨架屏 (Skeleton Loading)**：資料載入時顯示優雅的骨架屏，提升感知效能。
- **錯誤回滾**：若伺服器請求失敗，UI 會自動回滾至先前狀態，確保資料一致性。

## 🗂️ 雪場資料維護

- Trip Planner 會優先讀取 `RESORT_API_BASE_URL` 指向的 `resort_api`，若環境缺此服務才會 fallback 至 `lib/data/resorts.generated.json`。
- 若更新 `specs/resort-services/data` 下的 YAML，請執行：

```bash
npm run resorts:generate
```

- Commit 時務必包含新的 `lib/data/resorts.generated.json`，並在 README/部署說明提醒這只是最終保險來源。

## 🧱 模板資料驗證

- 所有模板/Checklist/Packing 在編譯階段會透過 `lib/templates/schema.ts`（Zod）驗證欄位。
- 新增或修改模板後請執行：

```bash
npm run templates:validate
```

- 此命令會檢查每個 template 是否具備對應的 Checklist/Packing，避免遺漏。

## 🔐 部署前環境檢查

- 提供 `npm run check:env` 檢查 `RESORT_API_BASE_URL`、`USER_CORE_API_URL` 是否設定。
- CI/CD 或 Zeabur 部署腳本可在 build 前執行一次，以避免缺少必要服務端點。

## 🏗️ 技術架構

```
技術棧：
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (schema 已定義)
- Jest (單元測試)
- Zod (Schema 驗證)

架構設計（Linus 風格）：
- 簡單：Template → Trip/Day/Item 三層結構
- 清晰：數據所有權明確，零特殊情況
- 可擴展：硬編碼模板可輕鬆遷移到資料庫
- 好品味 (Good Taste)：
  - 職責分離：API 層 (client.ts) 與 UI 層 (components) 完全解耦
  - 邏輯抽離：排序邏輯 (sort.ts) 為純函數，不污染組件
  - 消除特殊情況：自動排序邏輯內建於渲染層
  - **O(1) 操作**：重構後所有 Item/Day 操作都是 O(1) 複雜度（之前是 O(n³)）
```

## 🔌 API 端點

### Templates
- `GET /api/templates` - 獲取所有模板

### Trips
- `POST /api/trips` - 創建新旅程（從模板）
- `GET /api/trips/:id` - 獲取旅程詳情
- `PATCH /api/trips/:id` - 更新旅程
- `DELETE /api/trips/:id` - 刪除旅程

### Days (NEW!)
- `POST /api/trips/days` - 創建新的 Day
- `PATCH /api/trips/days/:id` - 更新 Day
- `DELETE /api/trips/days/:id` - 刪除 Day（cascade delete Items）

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
│   ├── trips/[id]/                        # 旅程詳情頁（重構後）
│   │   ├── page.tsx                       # 主頁面（Layout & Container）
│   │   ├── hooks/
│   │   │   └── useTrip.ts                 # 核心邏輯 Hook (Data & Actions)
│   │   └── components/
│   │       ├── TripHeader.tsx             # 頂部資訊
│   │       ├── DayItem.tsx                # 單日行程組件
│   │       ├── TripItem.tsx               # 單項行程組件
│   │       ├── ItemEditForm.tsx           # 編輯/新增表單 (Zod 驗證)
│   │       ├── ChecklistSection.tsx       # 檢查清單區塊
│   │       ├── PackingSection.tsx         # 打包清單區塊
│   │       └── schemas.ts                 # Zod 定義
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
│   ├── api/
│   │   └── client.ts                      # API 客戶端封裝 (New!)
│   ├── utils/
│   │   └── sort.ts                        # 純函數工具 (New!)
│   ├── types/template.ts                  # TypeScript 類型定義
│   ├── templates/                         # 硬編碼模板
│   ├── services/
│   │   ├── trip.ts                       # Trip 核心邏輯
│   │   ├── item.ts                       # Item 核心邏輯
│   │   ├── checklist.ts                  # Checklist/Packing 核心邏輯
│   │   └── __tests__/                    # 單元測試
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

## 🎯 最近更新（2025-11）

### Phase 4 完成 ✅（Clean Code 重構）

**Commit 歷史：**
```
245bc02 feat(P2-1): add pagination to trips list
8c07c2a docs(P1-2): add comprehensive API documentation
7e5d204 refactor(P0-3): eliminate duplicate code in checklist/packing routes
8414301 refactor(P0-2): add unified error handling
732f790 refactor(P0-1): eliminate O(n) traversal in checklist/packing routes
```

**成就：**
- ✅ **P0-1 效能優化**：消除 O(n) 遍歷，改用 O(1) 直接查詢
- ✅ **P0-2 統一錯誤處理**：建立 `handleApiError` 工具，減少重複代碼
- ✅ **P0-3 消除重複**：抽象 `handleToggleItem` 通用函數
- ✅ **P1-2 API 文檔**：完整的 API.md 文檔
- ✅ **P2-1 分頁功能**：行程列表支援分頁（預設 20 筆）

**代碼品質提升：**
- 減少 150+ 行重複代碼
- API routes 平均減少 50% 代碼量
- 統一錯誤處理格式
- 完整的 API 文檔

### Phase 3 完成 ✅（前端架構重構與體驗升級）

**Commit 歷史：**
```
83a7342 docs: update README to reflect 95+ score refactoring and actual template status
a1b4f61 refactor: achieve 95+ score - separate api layer, fix zod types, and extract logic
f2a5b28 fix: resolve build errors - syntax error in DayItem and Zod type issue
8c2d836 refactor: implement Linus principles - auto-sorting, smart dates, and simplified form
```

**成就：**
- ✅ **前端架構重構**：將 800 行的 `page.tsx` 拆解為模組化組件與 Custom Hook。
- ✅ **代碼品質 (95+ 分)**：
  - **API 層抽離**：建立 `lib/api/client.ts`，徹底解耦資料獲取與 UI 邏輯。
  - **純函數邏輯**：將排序邏輯抽離至 `lib/utils/sort.ts`，提升可測試性。
  - **類型安全**：修正 Zod 版本問題，移除所有 `any` 斷言。
- ✅ **樂觀更新 (Optimistic Updates)**：實現無延遲的操作體驗。
- ✅ **Linus 原則實踐**：
  - **好品味**：自動排序邏輯，讓數據自己說話。
  - **實用主義**：折疊次要欄位，降低使用者負擔。
  - **細節**：智能日期顯示，提升資訊可讀性。

### Bug 修復與優化 (2025-11-21) 🔧
- **修復日期保存問題 (P1)**：修正 Zod Schema 驗證邏輯，支援 ISO 日期格式，解決出發日期無法保存的問題。
- **新增旅程編輯功能 (P2)**：實作 `TripEditForm`，允許用戶修改旅程標題、日期、人數與備註。
- **優化 UI 交互**：
  - 修正 `TripHeader` 按鈕狀態。
  - 完善人數顯示邏輯（未填寫時顯示提示）。

## 📄 授權

MIT License

---

**開發中** - Phase 3 完成 | 架構重構 | 極致體驗 ✅
