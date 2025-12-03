# Trip Planner Integration TODO

## Phase 1 — Documentation & Bootstrapping
- [x] 更新 `/README.md`，在「前端應用」與「後端服務」章節加入 Trip Planner（tour）描述與依賴關係
- [x] 說明 Trip Planner 的 `.env` / Prisma DB 需求與 docker-compose 服務組成

## Phase 2 — Data Contract & API
- [x] Prisma `Day`/`Item` schema 加上 `resort_id`, `resort_name`, `region` 欄位並產生 migration
- [x] 調整模板 (`lib/templates/*.ts`) 支援 `resort_id`/`suggested_resorts`
- [x] 建立 `lib/external/resort-client.ts`，包裝 `resort_api` 的 `/resorts` 與 `/resorts/{id}` 呼叫（含快取）
- [x] Trip API (`/app/api/trips`) 驗證 `resort_id` 存在並寫入 Prisma

## Phase 3 — UI/UX
- [x] 模板詳情頁、Trip 詳情頁的 Day/Item 編輯器加入雪場搜尋/選擇器（使用 `ResortSearchInput`）
- [x] Day/Item 卡片顯示雪場標籤與摘要（region/tagline 提醒），提供交通與票價建議
- [x] Checklist/Packing 讀取所選雪場特性（夜滑、粉雪、溫泉）動態顯示建議項目/提醒

## Phase 4 — Cross-service Sync
- [x] user-core：新增 `POST /users/{user_id}/ski-preferences`（payload：`{ resort_ids: string[], source: "trip_planner", last_trip_id: string }`），並記錄最後同步時間
- [x] Trip Planner：在 `POST /api/trips` 與 Day/Item 雪場更新時呼叫 user-core API，失敗時重試或寫入錯誤日誌
- [x] Trip Header：呼叫 snowbuddy-matching `/matching/searches` + `/matching/searches/{id}`，顯示 Top 3 `MatchSummary`（nickname、skill_level、自我角色、match_score）及 CTA（「請他加入」）

## Phase 5 — Automation & Monitoring
- [ ] （Resort 更新）確認 `resort_api` 是否提供 change feed；若無，實作每日 cron 拉取 `GET /resorts` 快照比對後更新 Trip metadata（短期內無需對使用者發通知）
- [ ] ADR：紀錄 Trip Planner ↔ resort_api ↔ user-core ↔ snowbuddy-matching 的資料流、授權、失敗處理方案
