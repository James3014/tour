# Implementation Plan

## Overview

重構數據庫接口層，從 O(n³) 遍歷改為 O(1) 直接操作。按照 Linus 原則：數據結構優先，消除特殊情況，簡單實用。

---

## Tasks

- [x] 1. 更新 Database Interface
  - 在 `lib/db/interface.ts` 添加直接的 Item/Day 操作方法
  - 保持向後兼容（不刪除現有方法）
  - 只用域類型，不暴露 Prisma
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 4.1, 4.4, 4.5_

- [x] 2. 重構 MemoryDB 實現
  - 添加獨立的 `days: Map<string, DayData>` 和 `items: Map<string, ItemData>`
  - 實現 `createItem(dayId, data)` - O(1) 操作
  - 實現 `updateItem(id, data)` - O(1) 操作
  - 實現 `deleteItem(id)` - O(1) 操作
  - 實現 `getItemById(id)` - O(1) 操作
  - 實現 `createDay(tripId, data)` - O(1) 操作
  - 實現 `updateDay(id, data)` - O(1) 操作
  - 實現 `deleteDay(id)` - 包含 cascade delete 和 day_index 重排
  - 實現 `getDayById(id)` - O(1) 操作
  - 更新 `getTripById(id)` - 從 Map 組裝完整結構
  - 更新 `createTrip(trip)` - 同時填充 days 和 items Map
  - 更新 `deleteTrip(id)` - cascade delete 所有相關數據
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.2, 8.3, 8.5_

- [ ]* 2.1 寫 MemoryDB 的 unit tests
  - 測試 Item CRUD 操作
  - 測試 Day CRUD 操作
  - 測試 cascade delete
  - 測試 day_index 重排
  - 測試錯誤情況（不存在的 parent）
  - _Requirements: 1.5, 2.3, 2.4, 2.5, 8.1, 8.2, 8.3, 10.1_

- [ ]* 2.2 寫 property-based tests
  - **Property 1: Item creation returns complete object**
  - **Validates: Requirements 1.3, 5.2**
  - **Property 2: Non-existent parent throws error**
  - **Validates: Requirements 1.5, 2.5, 8.2**
  - **Property 3: Day creation returns complete object**
  - **Validates: Requirements 2.1, 5.4**
  - **Property 4: Cascade delete removes all children**
  - **Validates: Requirements 2.3, 8.1**
  - **Property 5: Day deletion reorders indices**
  - **Validates: Requirements 2.4**
  - **Property 11: Update non-existent throws error**
  - **Validates: Requirements 8.3**
  - _Requirements: 1.3, 1.5, 2.1, 2.3, 2.4, 2.5, 5.2, 5.4, 8.1, 8.2, 8.3_

- [x] 3. 創建統一的 Zod schemas
  - 創建 `lib/validation/schemas.ts`（如果不存在）
  - 定義 `UpdateItemSchema` - 使用 `z.coerce.date()` 處理日期
  - 定義 `CreateItemSchema`
  - 定義 `UpdateDaySchema`
  - 定義 `CreateDaySchema`
  - 定義 `UpdateTripSchema` - 替換現有的手動驗證
  - 所有 nullable 字段使用 `.nullable().optional()`
  - 所有日期字段使用 `z.coerce.date().nullable().optional()`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 3.1 寫 Zod schema tests
  - 測試日期 coercion（string → Date）
  - 測試空字符串 → null 轉換
  - 測試可選字段處理
  - 測試驗證錯誤格式
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [x] 4. 重構 Item API 端點
  - 更新 `app/api/trips/items/[id]/route.ts` PATCH
    - 使用 `UpdateItemSchema` 驗證
    - 調用 `db.updateItem(id, data)` 直接更新
    - 返回更新後的 Item
    - 統一錯誤處理（Zod/NotFound/Unexpected）
  - 更新 `app/api/trips/items/[id]/route.ts` DELETE
    - 調用 `db.deleteItem(id)` 直接刪除
    - 返回 `{ success: true }`
  - 更新 `app/api/trips/days/[id]/items/route.ts` POST
    - 使用 `CreateItemSchema` 驗證
    - 調用 `db.createItem(dayId, data)` 直接創建
    - 返回新創建的 Item
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 5.1, 5.2, 5.3, 6.1, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 4.1 寫 Item API integration tests
  - 測試 PATCH 成功情況
  - 測試 PATCH 404 錯誤
  - 測試 PATCH 400 驗證錯誤
  - 測試 DELETE 成功情況
  - 測試 POST 成功情況
  - 測試 POST parent 不存在錯誤
  - _Requirements: 5.1, 5.2, 5.3, 7.3, 7.4, 7.5_

- [ ]* 4.2 寫 property tests for API responses
  - **Property 6: Validation errors return 400**
  - **Validates: Requirements 3.2, 7.4**
  - **Property 8: Update returns updated object**
  - **Validates: Requirements 5.1**
  - **Property 9: Not found returns 404**
  - **Validates: Requirements 7.3**
  - **Property 10: Unexpected errors return 500**
  - **Validates: Requirements 7.5**
  - _Requirements: 3.2, 5.1, 7.3, 7.4, 7.5_

- [x] 5. 創建 Day API 端點（新功能）
  - 創建 `app/api/trips/days/route.ts` POST
    - 使用 `CreateDaySchema` 驗證
    - 調用 `db.createDay(tripId, data)` 創建
    - 返回新創建的 Day
  - 創建 `app/api/trips/days/[id]/route.ts` PATCH
    - 使用 `UpdateDaySchema` 驗證
    - 調用 `db.updateDay(id, data)` 更新
    - 返回更新後的 Day
  - 創建 `app/api/trips/days/[id]/route.ts` DELETE
    - 調用 `db.deleteDay(id)` 刪除（cascade）
    - 返回 `{ success: true }`
  - 統一錯誤處理
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 5.4, 6.1, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 5.1 寫 Day API integration tests
  - 測試 POST 成功情況
  - 測試 POST parent 不存在錯誤
  - 測試 PATCH 成功情況
  - 測試 DELETE cascade delete
  - 測試 DELETE day_index 重排
  - _Requirements: 2.1, 2.3, 2.4, 5.4, 7.3_

- [x] 6. 更新 Trip API 端點
  - 更新 `app/api/trips/[id]/route.ts` PATCH
    - 使用 `UpdateTripSchema` 替換手動驗證
    - 移除日期的特殊情況處理（Zod 處理）
    - 統一錯誤處理
  - 保持其他端點不變（GET, POST, DELETE）
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 6.1 寫 Trip API tests
  - 測試 PATCH 日期處理（string/Date/null）
  - 測試 PATCH 空字符串 → null
  - 測試驗證錯誤
  - _Requirements: 3.2, 3.3, 3.5_

- [x] 7. 更新前端 API client
  - 更新 `lib/api/client.ts`
    - 保持現有方法不變（向後兼容）
    - 添加 `createDay(tripId, data)` 方法（如果需要）
    - 添加 `updateDay(dayId, data)` 方法（如果需要）
    - 添加 `deleteDay(dayId)` 方法（如果需要）
  - 不需要修改 `useTrip.ts`（API 響應格式不變）
  - _Requirements: 4.2, 5.1, 5.4_

- [x] 8. Checkpoint - 確保所有測試通過
  - 運行 `npm test`
  - 確認所有 unit tests 通過
  - 確認所有 property tests 通過
  - 確認所有 integration tests 通過
  - 如有問題，詢問用戶

- [x] 9. 創建 PrismaDB 實現
  - 創建 `lib/db/prisma.ts`
  - 實現所有 Database interface 方法
  - Item 操作：
    - `createItem` - 使用 `prisma.item.create()`
    - `updateItem` - 使用 `prisma.item.update()`
    - `deleteItem` - 使用 `prisma.item.delete()`
    - `getItemById` - 使用 `prisma.item.findUnique()`
  - Day 操作：
    - `createDay` - 使用 `prisma.day.create()`
    - `updateDay` - 使用 `prisma.day.update()`
    - `deleteDay` - 使用 `prisma.day.delete()` + 手動重排 day_index
    - `getDayById` - 使用 `prisma.day.findUnique()`
  - Trip 操作：
    - `getTripById` - 使用 `include: { days: { include: { items: true } } }`
    - `createTrip` - 使用嵌套 create
    - `updateTrip` - 只更新 Trip 字段（不更新 days）
    - `deleteTrip` - cascade delete 由 Prisma schema 處理
  - 處理 Prisma 錯誤（P2025 → NotFoundError）
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3_

- [ ]* 9.1 寫 PrismaDB tests
  - 使用測試數據庫（SQLite in-memory）
  - 運行與 MemoryDB 相同的測試套件
  - 確保行為一致
  - _Requirements: 4.2, 4.3, 10.2_

- [x] 10. 文檔更新
  - 更新 `README.md`
    - 添加新的 API 端點文檔
    - 更新架構說明
  - 更新 `FEATURES.md`
    - 添加 Day 管理功能
    - 更新性能說明（O(1) 操作）
  - 創建 `MIGRATION.md`
    - 記錄從舊架構到新架構的變更
    - 說明如何切換到 Prisma
  - _Requirements: 所有_

- [x] 11. Final Checkpoint - 生產就緒檢查
  - 運行所有測試（MemoryDB + PrismaDB）
  - 檢查 TypeScript 編譯（零錯誤）
  - 檢查 ESLint（零警告）
  - 手動測試關鍵流程
  - 確認向後兼容性
  - 如有問題，詢問用戶

---

## Notes

**測試策略：**
- 標記 `*` 的任務為可選測試任務（可以跳過以加快 MVP）
- Property-based tests 使用 `fast-check` 庫
- 每個 property test 運行 100 次迭代
- 所有測試使用 MemoryDB（不需要 mock）

**實現順序：**
1. 先更新 Database interface 和 MemoryDB
2. 再重構 API 層
3. 最後實現 PrismaDB
4. 這樣可以逐步驗證，降低風險

**向後兼容：**
- 不刪除現有的 Database 方法
- API 響應格式保持不變
- 前端代碼無需修改

**切換到 Prisma：**
- 完成所有任務後，只需修改 `lib/db/index.ts`：
  ```typescript
  // export { db } from './memory';  // 舊的
  export { db } from './prisma';     // 新的
  ```
