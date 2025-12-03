# Trip Planner 部署前檢查清單

**檢查日期**: 2025-12-03 17:05  
**檢查人**: Kiro AI  
**狀態**: ✅ 準備就緒

---

## ✅ 新增功能確認

### 1. 資料治理腳本（3 個）
- ✅ `scripts/generate-resorts-json.js` - 從 YAML 生成 JSON fallback
- ✅ `scripts/validate-templates.js` - 驗證 Template/Checklist/Packing
- ✅ `scripts/check-env.js` - 部署前環境變數檢查

### 2. NPM Scripts
```json
{
  "resorts:generate": "node scripts/generate-resorts-json.js",
  "templates:validate": "node scripts/validate-templates.js",
  "check:env": "node scripts/check-env.js"
}
```

### 3. Resort 選擇器重構
- ✅ `hooks/useResortSearch.ts` - 搜尋邏輯集中管理
- ✅ `components/ResortSearchInput.tsx` - UI 組件簡化

### 4. Template Schema 驗證
- ✅ `lib/templates/schema.ts` - Zod schema 定義
- ✅ 所有 template 使用 `defineTemplate` 包裝

### 5. 測試覆蓋
- ✅ `lib/services/__tests__/resort-metadata.test.ts`
- ✅ `lib/services/__tests__/preference-sync.test.ts`
- ✅ `lib/external/__tests__/resort-client.test.ts`

---

## ✅ 測試結果

### 1. 資料治理腳本測試

#### ✅ Resort JSON 生成
```bash
$ npm run resorts:generate
[generate-resorts-json] 已輸出 43 筆資料 -> lib/data/resorts.generated.json
```

#### ✅ Template 驗證
```bash
$ npm run templates:validate
[templates:validate] 5 templates, 5 checklists, 5 packing 清單 — OK
```

#### ✅ 環境變數檢查
```bash
$ npm run check:env
[check-env] 所有必要變數已設定。
```

### 2. 單元測試

```bash
$ npm test

Test Suites: 8 passed, 8 total
Tests:       51 passed, 51 total
Time:        1.06 s
```

**測試套件**:
- ✅ lib/validation/__tests__/schemas.test.ts
- ✅ lib/external/__tests__/resort-client.test.ts
- ✅ lib/services/__tests__/checklist.test.ts
- ✅ lib/services/__tests__/trip.test.ts
- ✅ lib/services/__tests__/resort-metadata.test.ts
- ✅ lib/services/__tests__/packing.test.ts
- ✅ lib/services/__tests__/item.test.ts
- ✅ lib/services/__tests__/preference-sync.test.ts

### 3. API 功能測試

#### ✅ 雪場搜尋
```bash
GET /api/resorts?q=niseko
```
**結果**: 返回 1 個結果（二世谷Moiwa滑雪場）

#### ✅ Trip 創建與查詢
- 創建 Trip: ✅
- 查詢 Trip: ✅
- 雪場資訊整合: ✅

---

## 🔧 環境變數配置

### 本地開發 (.env.local)
```bash
DATABASE_URL="postgresql://diyski:diyski@localhost:5432/tour_dev"
RESORT_API_BASE_URL=https://resort-api.zeabur.app
USER_CORE_API_URL=https://user-core.zeabur.app
SNOWBUDDY_API_URL=
```

### Zeabur 生產環境
需要在 Zeabur 設定以下環境變數：

```bash
# 由 Zeabur PostgreSQL 服務自動注入
DATABASE_URL=<auto-injected>

# 需手動設定
RESORT_API_BASE_URL=https://resort-api.zeabur.app
USER_CORE_API_URL=https://user-core.zeabur.app
SNOWBUDDY_API_URL=
```

**注意**: 環境變數名稱已統一為 `RESORT_API_BASE_URL`（不是 `RESORT_API_URL`）

---

## 📋 部署流程

### 1. 部署前檢查
```bash
# 驗證 templates
npm run templates:validate

# 檢查環境變數
npm run check:env

# 運行測試
npm test
```

### 2. Commit 變更
```bash
git add .
git commit -m "feat: complete Phase 1-4 integration with data governance"
```

### 3. Push 到 GitHub
```bash
git push origin refactor/frontend-architecture
```

### 4. Zeabur 設定
1. 進入 Zeabur 專案設定
2. 添加環境變數：
   - `RESORT_API_BASE_URL=https://resort-api.zeabur.app`
   - `USER_CORE_API_URL=https://user-core.zeabur.app`
3. 儲存並觸發重新部署

### 5. 驗證部署
訪問 https://tour-app-2.zeabur.app 並測試：
- ✅ 創建 Trip
- ✅ 搜尋雪場
- ✅ 編輯 Item/Day
- ✅ 查看 Trip 詳情

---

## 📊 變更統計

### 新增檔案
- Scripts: 3 個
- Hooks: 1 個
- Tests: 3 個
- Schema: 1 個
- 文件: 多個

### 修改檔案
- Components: ResortSearchInput 重構
- Templates: 全部加入 schema 驗證
- Package.json: 新增 3 個 scripts

### 測試覆蓋
- 單元測試: 51 個測試全部通過
- 測試套件: 8 個套件全部通過

---

## 🎯 後續建議

### 1. 變更雪場資料後
```bash
npm run resorts:generate
npm run templates:validate
```

### 2. 部署前
```bash
npm run check:env
npm test
```

### 3. UI 互動測試（可選）
如需前端測試，可安裝 jsdom 依賴：
```bash
npm install --save-dev jsdom @testing-library/react @testing-library/jest-dom
```

---

## ✅ 部署就緒

**所有檢查通過，可以推送到生產環境！**

### 快速部署指令
```bash
# 1. 最終檢查
npm run check:env && npm test

# 2. Commit & Push
git add .
git commit -m "feat: complete Phase 1-4 integration with data governance"
git push origin refactor/frontend-architecture

# 3. 在 Zeabur 設定環境變數
# RESORT_API_BASE_URL=https://resort-api.zeabur.app
# USER_CORE_API_URL=https://user-core.zeabur.app
```

---

**檢查完成時間**: 2025-12-03 17:05  
**狀態**: ✅ 準備就緒
