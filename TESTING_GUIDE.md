# 完整流程測試指南

## MVP 功能測試清單

### Flow 1: 從模板建立旅程

#### ✅ 1. 模板列表頁 (`/templates`)
- [ ] 顯示 5 個核心模板（北海道 6d、北海道 8d 豪華、長野 5d、新潟 4d、東北 5d）
- [ ] 每個模板顯示：名稱、區域、天數、適合對象、描述
- [ ] 行程節奏預覽條正確顯示
- [ ] 保證說明文字存在："選擇後可自由增刪修改每一天"
- [ ] 「從空白開始」選項顯示（功能待實現提示）
- [ ] 點擊「查看詳情」按鈕跳轉到模板詳情頁

#### ✅ 2. 模板詳情頁 (`/templates/[id]`)
- [ ] 顯示完整模板資訊（名稱、區域、適合對象、描述）
- [ ] 行程節奏預覽：每天用 emoji 標示
- [ ] 總天數 & 滑雪天數卡片顯示
- [ ] 詳細行程：每天的 Day template 和 Item templates
- [ ] 保證說明：可自由修改提示
- [ ] CTA 按鈕：「使用此模板建立旅程」
- [ ] 點擊 CTA 跳轉到旅程資訊填寫頁

#### ✅ 3. 旅程資訊填寫頁 (`/templates/[id]/create`)
- [ ] 顯示「使用模板：XXX」提示
- [ ] 表單欄位：
  - [ ] 旅程名稱（必填，預設為模板名稱）
  - [ ] 出發日期（選填，日期選擇器）
  - [ ] 旅程天數（必填，預設為模板天數）
  - [ ] 預計同行人數（選填）
  - [ ] 簡短備註（選填，最多 500 字）
- [ ] 取消按鈕返回模板詳情
- [ ] 提交後創建 Trip 並跳轉到 Trip 編輯頁
- [ ] **驗證後端：**
  - [ ] POST /api/trips 成功
  - [ ] Checklist 自動生成
  - [ ] Packing 清單自動生成

### Flow 2: Trip 編輯

#### ✅ 4. Trip 編輯頁面 (`/trips/[id]`)

**Header 資訊：**
- [ ] 顯示旅程標題
- [ ] 顯示出發日期（如有）
- [ ] 顯示天數 & 滑雪天數
- [ ] 顯示同行人數（如有）
- [ ] 顯示備註（如有）
- [ ] 「編輯資訊」按鈕（功能待實現）

**Tab 切換：**
- [ ] 兩個 Tab：📍 行程、✅ 行前準備
- [ ] 點擊可切換 Tab
- [ ] 當前 Tab 用藍色底線標示

**行程 Tab - Day 展開/收合：**
- [ ] **核心功能：可同時展開多個 Day**
- [ ] 預設展開前 2 天
- [ ] 點擊 Day header 可展開/收合
- [ ] 展開/收合不影響其他 Day 狀態
- [ ] 「展開全部」按鈕可一次展開所有 Day
- [ ] 「收合全部」按鈕可一次收合所有 Day
- [ ] 提示文字：「可以同時展開多個 Day，方便對照不同天的行程」

**Item 顯示（View Mode）：**
- [ ] 顯示 emoji 圖示
- [ ] 顯示標題
- [ ] 具體時間優先顯示（綠色標籤）
- [ ] 時段提示次要顯示（灰色標籤）
- [ ] 顯示地點（如有）
- [ ] 顯示相關連結（如有，可點擊）
- [ ] 顯示備註（如有）
- [ ] Hover 時顯示「編輯」「刪除」按鈕

**Item 編輯（Edit Mode）：**
- [ ] 點擊「編輯」按鈕進入編輯模式
- [ ] 編輯表單顯示藍色邊框 + 藍色背景
- [ ] 所有欄位可編輯：
  - [ ] 類型（下拉選單）
  - [ ] 時段提示（下拉選單，可選「不指定」）
  - [ ] 標題（文字輸入，必填）
  - [ ] 具體時間（時間選擇器）
  - [ ] 地點（文字輸入）
  - [ ] 相關連結（文字輸入）
  - [ ] 備註（文字區域）
- [ ] 「取消」按鈕取消編輯
- [ ] 「儲存」按鈕保存（標題空白時 disabled）
- [ ] 儲存時顯示「儲存中...」
- [ ] 儲存成功後回到 View Mode

**Item 刪除：**
- [ ] 點擊「刪除」按鈕
- [ ] 顯示確認對話框
- [ ] 確認後刪除 Item
- [ ] 刪除後 Item 從列表消失

**新增項目：**
- [ ] 每個 Day 底部有「+ 新增項目」按鈕
- [ ] 點擊提示「功能即將實現」

**行前準備 Tab：**

**Checklist 清單：**
- [ ] 顯示「📋 行前檢查清單」標題
- [ ] 按類別分組顯示：
  - [ ] 訂購前確認
  - [ ] 訂購後準備
  - [ ] 出發前確認
- [ ] 每個項目有 checkbox
- [ ] 點擊 checkbox 提示「勾選功能即將實現」
- [ ] 已完成項目顯示刪除線
- [ ] 如果沒有 checklist，顯示提示文字

**Packing 清單：**
- [ ] 顯示「🎒 打包清單」標題
- [ ] 按類別分組顯示：
  - [ ] 🧥 服裝防寒
  - [ ] 📄 證件金流
  - [ ] 💊 藥品
  - [ ] ⛷️ 雪具護具
- [ ] 每個項目有 checkbox
- [ ] 點擊 checkbox 提示「勾選功能即將實現」
- [ ] 已完成項目顯示刪除線
- [ ] 如果沒有 packing，顯示提示文字

**Footer：**
- [ ] 「← 返回模板選擇」按鈕
- [ ] 「分享旅程」按鈕（功能待實現）

## API 測試

### Trip 創建
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "jp_hokkaido_6d3s1c_v1",
    "user_id": "test_user",
    "title": "我的北海道滑雪之旅",
    "start_date": "2025-02-01T00:00:00Z",
    "people_count": 4,
    "note": "家庭旅遊"
  }'
```

預期：
- 返回 201 狀態碼
- 返回完整 Trip 數據（包含 Days 和 Items）
- Trip 包含 start_date, people_count, note

### Checklist 獲取
```bash
curl http://localhost:3000/api/trips/[trip-id]/checklist
```

預期：
- 返回 200 狀態碼
- 返回 Checklist 陣列
- 項目按 category 和 order 排序

### Packing 獲取
```bash
curl http://localhost:3000/api/trips/[trip-id]/packing
```

預期：
- 返回 200 狀態碼
- 返回 Packing 陣列
- 項目按 category 和 order 排序

### Item 更新
```bash
curl -X PATCH http://localhost:3000/api/trips/items/[item-id] \
  -H "Content-Type: application/json" \
  -d '{
    "title": "去程航班 CI102",
    "time": "08:30",
    "location": "桃園機場第二航廈",
    "link": "https://example.com/booking"
  }'
```

預期：
- 返回 200 狀態碼
- 返回更新後的 Item 數據

### Item 刪除
```bash
curl -X DELETE http://localhost:3000/api/trips/items/[item-id]
```

預期：
- 返回 200 狀態碼
- 返回 { "success": true }

## 單元測試

```bash
npm test
```

預期：
- ✅ 15/15 tests passed
- 涵蓋：
  - Trip 創建
  - 自定義標題、日期、人數、備註
  - 自定義天數
  - Day 生成
  - Item 生成
  - 欄位初始化
  - 錯誤處理

## Build 驗證

```bash
npm run build
```

預期：
- ✅ Compiled successfully
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ All routes generated

## Linus 原則驗證

### ✅ 1. 數據結構優先
- TripWithDetails 清晰表達關係
- ChecklistItem/PackingItem 簡單結構
- 所有 ID 使用 UUID（無碰撞風險）

### ✅ 2. 消除特殊情況
- 所有 Day 用相同邏輯處理
- 所有 Item 用相同編輯流程
- 統一的錯誤處理

### ✅ 3. 簡單勝過複雜
- expandedDays 用 Record<id, boolean> 管理
- editingItemId + editForm 管理編輯狀態
- Tab 切換用簡單 state

### ✅ 4. 清晰的接口
- Database interface 定義清楚
- API 遵循 RESTful 原則
- 類型定義完整（TypeScript）

## 已知待實現功能

1. **新增 Item 功能**
2. **Checklist/Packing 勾選功能**
3. **Trip 資訊編輯功能**
4. **分享旅程功能**
5. **從空白開始功能**
6. **認證系統（user_id 目前固定）**

## 測試結果

- [ ] 所有 UI 測試通過
- [ ] 所有 API 測試通過
- [ ] 單元測試：15/15 ✅
- [ ] Build 成功 ✅
- [ ] Linus 原則驗證通過 ✅
