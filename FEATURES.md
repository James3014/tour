# 滑雪旅程規劃系統 - 功能清單

**專案狀態：** Phase 2 完成 ✅ | 測試: 33/33 通過

---

## 📊 開發進度總覽

| 階段 | 狀態 | 功能數 | 測試數 | 完成度 |
|------|------|--------|--------|--------|
| Phase 1 | ✅ 完成 | 3 | 15 | 100% |
| Phase 2 | ✅ 完成 | 3 | 18 | 100% |
| Phase 3 | 🔄 計劃中 | 2 | TBD | 0% |
| **總計** | **-** | **6** | **33** | **66%** |

---

## ✨ 已實現功能（詳細）

### 1️⃣ 模板系統（Phase 1）
**功能描述：** 提供 6 個預設滑雪旅程模板

| 模板名稱 | 天數 | 滑雪天數 | 地區 | 適合族群 |
|----------|------|----------|------|----------|
| 北海道 6 日 | 6 | 3 | 北海道 | 初學者友善 |
| 北海道 8 日豪華版 | 8 | 5 | 北海道 | 滑雪愛好者 |
| 東北 5 日 | 5 | 3 | 東北 | 中階滑雪者 |
| 長野 5 日 | 5 | 3 | 長野 | 家庭旅遊 |
| 新潟 4 日 | 4 | 2 | 新潟 | 週末快閃 |
| 韓國 4 日 | 4 | 2 | 韓國 | 初學者 |

**UI 特色：**
- 卡片式展示
- 關鍵資訊一目了然
- 一鍵創建旅程

---

### 2️⃣ 旅程管理（Phase 1 & 2）

#### 2.1 旅程創建（Flow 1）
**功能：**
- ✅ 從模板自動生成完整旅程
- ✅ 自動展開所有天數（Day）
- ✅ 自動展開所有項目（Item）
- ✅ 支援 2-10 天可配置

**技術實現：**
- Service: `createTripFromTemplate()`
- API: `POST /api/trips`
- 測試: 15 個單元測試

#### 2.2 旅程編輯（Flow 2）
**功能：**
- ✅ Day-by-day 多日展示
- ✅ 雙 Tab 切換：行程 / 準備事項
- ✅ 滑雪日圖標標記 ⛷️
- ✅ 城市/日期資訊展示

**UI 特色：**
- 時間線式布局
- 清晰的視覺層次
- 即時資訊更新

---

### 3️⃣ Item 項目管理（Phase 2）✨ NEW

#### 3.1 Item 編輯
**功能：**
- ✅ 內嵌編輯表單（藍色邊框）
- ✅ 8 種類型：航班、住宿、交通、滑雪、課程、待辦、筆記、其他
- ✅ 完整欄位支援：
  - 類型選擇
  - 標題（必填）
  - 日期
  - 時間
  - 時段（早上/下午/晚上/全天）
  - 地點
  - 連結
  - 備註
- ✅ 即時儲存
- ✅ 取消編輯

**技術實現：**
- API: `PATCH /api/trips/items/:id`
- 驗證: Zod schema
- 狀態管理: React useState

#### 3.2 Item 新增（TDD 開發）
**功能：**
- ✅ 內嵌新增表單（綠色邊框）
- ✅ 與編輯表單一致的欄位
- ✅ 標題驗證（必填）
- ✅ 即時新增到指定天數

**技術實現：**
- Service: `createItemInDay()`
- API: `POST /api/trips/days/:id/items`
- 測試: 6 個單元測試
- ID 生成: `crypto.randomUUID()`

**測試覆蓋：**
- ✅ 基本創建
- ✅ 唯一 ID 生成
- ✅ 可選欄位處理
- ✅ 欄位初始化
- ✅ 錯誤處理（空標題、空 day_id）

#### 3.3 Item 刪除
**功能：**
- ✅ 確認對話框
- ✅ 即時刪除

**技術實現：**
- API: `DELETE /api/trips/items/:id`

---

### 4️⃣ Checklist 檢查清單（Phase 2）✨ NEW

**功能：**
- ✅ 勾選/取消勾選即時更新
- ✅ 4 大類別：
  1. 訂購前確認（護照、簽證等）
  2. 訂購後準備（機票、住宿等）
  3. 出發前確認（行李、保險等）
  4. 其他
- ✅ 已完成項目自動劃線
- ✅ 分類展示

**技術實現：**
- Service: `toggleChecklistItem()`
- API: `PATCH /api/trips/checklist/:id`
- 測試: 6 個單元測試
- 不可變性: 返回新物件

**測試覆蓋：**
- ✅ 完成/未完成切換
- ✅ 不可變性驗證
- ✅ 資料完整性
- ✅ 多次切換正確性

---

### 5️⃣ Packing 打包清單（Phase 2）✨ NEW

**功能：**
- ✅ 勾選/取消勾選即時更新
- ✅ 6 大類別：
  1. 衣物（滑雪外套、手套等）
  2. 裝備（雪具、護目鏡等）
  3. 配件（太陽眼鏡、保暖用品等）
  4. 電子（充電器、相機等）
  5. 盥洗（防曬、護唇膏等）
  6. 其他
- ✅ 已完成項目自動劃線
- ✅ 分類展示

**技術實現：**
- Service: `togglePackingItem()`
- API: `PATCH /api/trips/packing/:id`
- 測試: 6 個單元測試
- 統一處理: 與 Checklist 共用邏輯

**測試覆蓋：**
- ✅ 完成/未完成切換
- ✅ 不可變性驗證
- ✅ 資料完整性
- ✅ 多次切換正確性

---

## 🧪 測試統計

### 總覽
- **測試套件：** 4 個
- **測試用例：** 33 個
- **通過率：** 100% ✅
- **覆蓋率：** 核心業務邏輯 100%

### 分類統計

| 測試套件 | 測試數 | 覆蓋功能 | 狀態 |
|----------|--------|----------|------|
| trip.test.ts | 15 | Trip 創建、多日展開、錯誤處理 | ✅ |
| item.test.ts | 6 | Item 新增、驗證、ID 生成 | ✅ |
| checklist.test.ts | 6 | Checklist 切換、不可變性 | ✅ |
| packing.test.ts | 6 | Packing 切換、不可變性 | ✅ |

### TDD 開發流程
```
Red (失敗) → Green (通過) → Refactor (重構)
     ↓              ↓              ↓
  寫測試         實現代碼         優化代碼
```

---

## 🔌 API 端點總覽

### Templates（模板）
```
GET  /api/templates              獲取所有模板
```

### Trips（旅程）
```
POST   /api/trips                創建新旅程（從模板）
GET    /api/trips/:id            獲取旅程詳情
PATCH  /api/trips/:id            更新旅程
DELETE /api/trips/:id            刪除旅程
```

### Items（項目）
```
POST   /api/trips/days/:id/items 新增 Item 到指定天數
PATCH  /api/trips/items/:id      更新 Item
DELETE /api/trips/items/:id      刪除 Item
```

### Checklist & Packing（清單）
```
GET   /api/trips/:id/checklist   獲取旅程的 Checklist
GET   /api/trips/:id/packing     獲取旅程的 Packing List
PATCH /api/trips/checklist/:id   切換 Checklist 項目狀態
PATCH /api/trips/packing/:id     切換 Packing 項目狀態
```

**總計：** 11 個 API 端點

---

## 📊 數據結構

### 核心實體關係
```
Template (模板)
    ↓ creates
Trip (旅程)
    ├── Day 1 (天數)
    │   ├── Item 1 (項目)
    │   ├── Item 2
    │   └── Item 3
    ├── Day 2
    │   └── Items...
    ├── Checklist (檢查清單)
    │   ├── ChecklistItem 1
    │   └── ChecklistItem 2
    └── Packing (打包清單)
        ├── PackingItem 1
        └── PackingItem 2
```

### 欄位統計
- **Trip**: 9 個欄位
- **Day**: 6 個欄位
- **Item**: 10 個欄位
- **ChecklistItem**: 7 個欄位
- **PackingItem**: 7 個欄位

---

## 🎨 UI/UX 特色

### 視覺設計
- ✅ **顏色編碼**
  - 藍色邊框：編輯表單
  - 綠色邊框：新增表單
  - 灰色劃線：已完成項目

- ✅ **互動設計**
  - 懸停效果（hover state）
  - 即時反饋
  - 確認對話框（刪除操作）

- ✅ **資訊層次**
  - 卡片式布局
  - 時間線式行程展示
  - 分類折疊/展開

### 響應式特性
- ✅ 桌面端優化
- ⏳ 移動端適配（待優化）

---

## 🏗️ 技術架構

### 前端
- **框架**: Next.js 15 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態**: React useState (local state)

### 後端
- **API**: Next.js Route Handlers
- **驗證**: Zod Schema
- **儲存**: In-memory (開發) / Prisma (生產)

### 測試
- **框架**: Jest
- **運行器**: @swc/jest (快速編譯)
- **覆蓋**: 核心業務邏輯 100%

### 開發工具
- **Git**: 語義化提交訊息
- **TDD**: 紅綠重構循環
- **Linting**: ESLint + TypeScript

---

## 🎯 Linus 原則體現

### 1. 數據結構優先
```typescript
// 好的數據結構 = 簡單的代碼
interface ChecklistItem {
  id: string;
  completed: boolean;  // 簡單的布林值
  // ... 其他欄位
}

// 切換狀態只需要一行
function toggle(item: ChecklistItem): ChecklistItem {
  return { ...item, completed: !item.completed };
}
```

### 2. 消除特殊情況
```typescript
// ❌ 不好：特殊情況處理
if (type === 'checklist') {
  toggleChecklistItem(item);
} else if (type === 'packing') {
  togglePackingItem(item);
}

// ✅ 好：統一介面
function toggleItem(item: { completed: boolean }) {
  return { ...item, completed: !item.completed };
}
```

### 3. 簡單實用
- 不過度設計
- 解決實際問題
- 代碼易讀易維護

### 4. 不可變性
```typescript
// 所有狀態更新都返回新物件
const newItem = { ...oldItem, completed: true };
// 而不是 oldItem.completed = true;
```

---

## 📈 開發統計

### 提交歷史（Phase 2）
```
e44a0d9 docs: 更新 README 詳細功能列表
5ccc218 feat: 實現 Packing 勾選功能（TDD）
6295e51 feat: 實現 Checklist 勾選功能（TDD）
1d390d8 feat: 實現 Item 新增功能（TDD）
e930f4c docs: 新增完整測試指南
b600373 feat: 實現 Item 完整編輯功能
```

### 代碼量統計（估算）
- **前端代碼**: ~2,000 行
- **後端 API**: ~800 行
- **測試代碼**: ~600 行
- **類型定義**: ~400 行
- **總計**: ~3,800 行

### 開發時間（估算）
- **Phase 1**: ~3 天
- **Phase 2**: ~2 天
- **總計**: ~5 天

---

## 🚀 下一步計劃

### Phase 3（進行中）⭐ 優先級已調整

**1. Trip 分享功能**（最高優先）
- **目標**：讓揪團者能分享行程給團員查看
- **實現**：
  - `/trips/[id]/share` - read-only 分享頁
  - 無需登入即可查看
  - 顯示：Day、Item、Checklist（隱藏敏感資訊）
  - 分享追蹤：記錄訪問次數
- **價值驗證**：
  - 每個 Trip 分享給多少人
  - 分享頁被打開幾次
  - 團員是否真的會看

**2. Day 新增/刪除功能**
- 動態新增天數
- 刪除天數（含確認）
- 重新排序 day_index

**3. 錯誤處理優化**
- 統一錯誤訊息
- Loading 狀態
- 樂觀更新（Optimistic UI）

### Phase 4（近期）
- 連接真實 PostgreSQL
  - Prisma migrate
  - 資料持久化
- 最簡單的登入
  - Email magic link 或
  - Google OAuth（擇一即可）
- UI/UX 優化
  - 響應式設計
  - 深色模式

### Phase 5+（未來）
- 模板管理後台
- 多人協作編輯
- 進階功能（預算、天氣、地圖、匯出）

---

## 🎯 立即行動建議（基於產品方向討論）

### 1. 用戶測試（最重要）⭐
**目標**：找 3-5 個真實滑雪揪團者測試

**測試問題**：
- 他有沒有把所有訂單資訊都放進去？
- 還需要開 Excel / Notion 嗎？為什麼？
- 分享給團員後，團員會看嗎？

**驗證指標**：
- 欄位是否太多/太少
- 模板骨架是否貼近真實行程
- 分享功能的使用頻率

### 2. 分享頁實現（技術簡單但價值高）
**技術方案**：
- 複用現有 `/trips/[id]` 的渲染邏輯
- 移除所有編輯 UI（按鈕、表單）
- 保留：Day、Item、Checklist（只讀）
- 隱藏：敏感資訊（價格、個人備註）

**追蹤指標**：
- 每個 Trip 的分享次數
- 分享頁訪問次數
- 訪問來源（QR code / 連結）

### 3. 商業掛鉤（輕量驗證）
**實現方式**：
- 在 Checklist 項目旁加「前往 Klook 搜尋」連結
- 例如：「預約租雪具」→ 連到 Klook 搜尋頁
- 不需要分潤、先測點擊率

**價值**：
- 驗證用戶是否願意從這裡跳出去預訂
- 未來談聯盟行銷的數據基礎

---

## 🚫 刻意不做的事（避免分散精力）

### 短期內不要：
1. ❌ 再加更多模板（6 個夠測市場）
2. ❌ 在 Item 加航班 API 等特殊邏輯
3. ❌ 做智慧推薦（Checklist/Packing）
4. ❌ 過度優化 UI/動畫
5. ❌ 做後台管理系統

### 為什麼？
- 現階段重點是**驗證核心價值**
- 技術債可以還，產品方向錯了很難回頭
- 揪團者的痛點是「資訊整合」和「團員溝通」，不是功能炫技

---

## 📞 討論要點

### 展示亮點
1. ✅ **完整的 TDD 流程** - 33 個測試全部通過
2. ✅ **Linus 原則實踐** - 簡單、清晰、不可變
3. ✅ **實用功能** - 解決真實旅行規劃痛點
4. ✅ **可擴展架構** - 易於添加新功能

### 技術深度
- TypeScript 強型別
- Next.js 15 最新特性
- TDD 紅綠重構
- 不可變性設計模式

### 商業價值
- 提升旅行規劃效率
- 減少遺漏重要事項
- 可視化行程管理
- 未來可擴展社群分享

---

**更新時間：** 2025-01-17
**版本：** Phase 2 完成
**測試狀態：** 33/33 通過 ✅
