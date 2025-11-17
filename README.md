# ⛷️ 滑雪旅程規劃系統

MVP 版本 - 基於模板的滑雪旅程規劃工具

## 🚀 在線演示

**Zeabur 部署:** https://tour-app.zeabur.app

## ✨ 核心功能

### 已實現
- ✅ **6 個硬編碼滑雪模板**
  - 北海道 6 日（3 滑 1 市區）
  - 北海道 8 日豪華版（二世古 + 富良野，5 天滑雪）
  - 東北 5 日（3 天滑雪）
  - 長野 5 日（白馬滑雪）
  - 新潟 4 日（苗場快閃）
  - 韓國 4 日（龍平滑雪）

- ✅ **模板選擇 UI**
  - 卡片展示所有模板
  - 顯示天數、滑雪天數、適合族群
  - 一鍵創建旅程

- ✅ **旅程詳情頁**
  - Day-by-day 展示
  - 每天的 Items（航班、住宿、交通、滑雪等）
  - 完整的提示訊息

- ✅ **TDD 開發**
  - 12/12 核心邏輯測試通過
  - Jest + TypeScript

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

## 📂 專案結構

```
tour/
├── app/
│   ├── page.tsx                    # 首頁
│   ├── templates/page.tsx          # 模板選擇頁
│   ├── trips/[id]/page.tsx        # 旅程詳情頁
│   └── api/
│       ├── templates/route.ts      # GET /api/templates
│       ├── trips/route.ts          # POST /api/trips
│       └── trips/[id]/route.ts    # GET /api/trips/:id
├── lib/
│   ├── types/template.ts           # TypeScript 類型定義
│   ├── templates/                  # 硬編碼模板
│   │   ├── hokkaido-6d.ts
│   │   ├── hokkaido-8d-deluxe.ts
│   │   ├── tohoku-5d.ts
│   │   ├── nagano-5d.ts
│   │   ├── niigata-4d.ts
│   │   ├── korea-4d.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── trip.ts                 # 核心邏輯
│   │   └── __tests__/trip.test.ts # 單元測試
│   └── db/memory.ts                # In-memory 儲存
└── prisma/schema.prisma            # 資料庫 schema
```

## 🧪 測試

```bash
# 運行所有測試
npm test

# 監聽模式
npm run test:watch
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

## 📊 數據模型

### Template（模板）
```typescript
{
  template_id: string;
  name: string;
  region: string;
  default_days: number;
  default_ski_days: number;
  target_group: string;
  description: string;
  day_templates: DayTemplate[];
}
```

### Trip（實際旅程）
從 Template 生成，可自由編輯

### Day（某天）
包含 day_index, label, city, is_ski_day

### Item（某天上的事件）
包含 type, title, time_hint, location, note

## 🚧 下一步（Roadmap）

### 近期
- [ ] 添加 favicon
- [ ] Day/Item 編輯功能（增刪改）
- [ ] 連接真實的 PostgreSQL
- [ ] 用戶認證

### 未來
- [ ] 模板管理後台
- [ ] 分享旅程功能
- [ ] Checklist 功能
- [ ] Packing List
- [ ] 多人協作

## 📝 開發原則

**Linus Torvalds 風格**
- "Talk is cheap. Show me the code."
- 數據結構優先：好的數據結構 > 複雜的程式碼
- 消除特殊情況：通過設計消除 if/else
- 簡單實用：解決實際問題，不過度設計
- 向後兼容：Never break userspace

## 📄 授權

MIT License

---

**開發中** - MVP 版本 | TDD 開發 | Linus 風格
