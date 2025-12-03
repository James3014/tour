# Tour Application - Alpine Velocity Design System

## 概述

Tour 應用已完全整合 **Alpine Velocity** 設計系統，使用 **Emerald (綠色系)** 作為主色調，代表「成長與協調」的旅程規劃理念。

---

## 🎨 設計語言

### 核心美學要素
- ✅ **斜切角卡片** (Polygon Clipping) - `.tour-card`
- ✅ **傾斜字體元素** (Skewed Typography) - `.skew-title`, `.tour-badge`
- ✅ **動態光效** (Velocity Shine + Pulse) - `.velocity-shine`, `.tour-card-animate`
- ✅ **高對比深色主題** (Dark Mode First)
- ✅ **觸控友善設計** (44px+ 觸控目標)
- ✅ **行動優先響應式** (Mobile-First Responsive Design)

---

## 🎨 色彩系統

### 主色調 - Emerald (成長與協調)

```css
--tour-primary: #10b981;        /* emerald-500 */
--tour-primary-dark: #059669;   /* emerald-600 */
--tour-primary-light: #34d399;  /* emerald-400 */
--tour-accent: #14b8a6;         /* teal-500 */
```

### 與平台其他系統的色彩區別

| 系統 | 主色 | 用途 | 情感定位 |
|-----|------|------|---------|
| **單板教學** | Amber/Orange | 學習技能 | 運動感、熱情 |
| **雪場服務** | Cyan/Sky | 地理探索 | 冰雪、清新 |
| **Tour (旅程規劃)** | **Emerald/Teal** | **行程規劃** | **成長、協調** |

### 共通色 (跨系統一致)
- **Purple/Pink**: 次要資訊徽章 (如人數、技能類型、垂直落差)
- **Background**: `#0a0a0a` (深黑)
- **Cards**: `#27272a` (zinc-800)

---

## 🧩 元件系統

### 1. 卡片元件 (`.tour-card`)

**特色**:
- 6 角斜切 (右上、左下各 12px)
- 左上高光 (白色光暈 `rgba(255,255,255,0.1)`)
- 右上裝飾 (emerald 光暈 `rgba(16,185,129,0.1)`)
- 底部速度條紋 (`.tour-card-stripes`)
- Hover 動畫: `translateY(-2px)` + emerald glow

**使用範例**:
```tsx
<div className="tour-card p-6 hover:tour-card-animate">
  {/* 內容 */}
  <div className="tour-card-stripes"></div>
</div>
```

### 2. 徽章系統 (`.tour-badge`)

**三種配色**:
- `.badge-emerald` - 主要資訊 (日期、雪道數)
- `.badge-purple` - 次要資訊 (人數、雪場名稱)
- `.badge-teal` - 補充資訊 (天數、最長雪道)

**特色**: `-skewX(-2deg)` 傾斜 + 內部反向 `skewX(2deg)` 保持文字可讀

```tsx
<div className="tour-badge badge-emerald">
  <span className="tour-badge-inner">📅 2025/1/15</span>
</div>
```

### 3. 按鈕 (`.btn-tour-primary`)

**特色**:
- Emerald 漸層背景
- 斜切角 (右上、左下各 8px)
- Velocity Shine 動畫 (`.velocity-shine`)
- Active 回饋: `scale(0.97)` + `translateY(1px)`

```tsx
<button className="btn-tour-primary velocity-shine">
  開始規劃 →
</button>
```

### 4. 標題文字 (`.font-display`)

**字體**: Bebas Neue (全大寫展示字體)
**效果**:
- `.skew-title` - 容器傾斜 `-skewX(-2deg)`
- `.unskew` - 內容反向 `skewX(2deg)` 保持可讀
- `.text-gradient-velocity` - 白色漸層文字

```tsx
<h1 className="font-display text-6xl text-gradient-velocity skew-title">
  <span className="unskew">滑雪旅程規劃</span>
</h1>
```

---

## 📱 行動優先響應式設計

### 斷點策略
- `sm`: 640px - 平板直向
- `md`: 768px - 平板橫向
- `lg`: 1024px - 桌面

### 文字縮放 (Mobile)

```css
@media (max-width: 640px) {
  .text-6xl { font-size: 2.5rem !important; }  /* 原 4rem */
  .text-4xl { font-size: 2rem !important; }    /* 原 2.25rem */
  .text-2xl { font-size: 1.5rem !important; }  /* 原 1.5rem */
}
```

### 徽章縮放

```css
.tour-badge {
  font-size: 0.75rem;  /* Desktop */
  padding: 0.375rem 0.75rem;
}

@media (max-width: 640px) {
  .tour-badge {
    font-size: 0.625rem;  /* 10px */
    padding: 0.25rem 0.5rem;
  }
}
```

### 間距調整模式

使用 Tailwind 的響應式前綴:
```tsx
className="p-4 sm:p-6 lg:p-8"  // Padding: 手機 16px → 平板 24px → 桌面 32px
className="gap-2 sm:gap-3"     // Gap: 手機 8px → 平板 12px
className="mb-6 sm:mb-8"       // Margin: 手機 24px → 平板 32px
```

---

## 📄 已更新頁面清單

### ✅ 1. 首頁 (`/app/page.tsx`)
- Alpine Velocity 標題與漸層
- Logo 圖標 (emerald + teal 漸層 + 斜切角)
- CTA 按鈕 velocity-shine 動畫
- 特色徽章 (模板系統、智慧推薦、行動優先)
- 全響應式 (手機/平板/桌面)

### ✅ 2. 模板選擇頁 (`/app/templates/page.tsx`)
- Tour-card 卡片設計
- 模板資訊行響應式排版 (`flex items-start sm:items-center`)
- 日程預覽圖示適配手機寬度
- Loading 狀態使用 `.loading-pulse`

### ✅ 3. 我的行程列表 (`/app/trips/page.tsx`)
- Tour-card 行程卡片
- 三色徽章系統 (日期/人數/天數)
- 行動優先 header 排版
- Hover 動畫與箭頭過渡效果

### ✅ 4. 行程詳情頁 (`/app/trips/[id]/page.tsx`)
- 響應式 Tabs (手機僅顯示 icon)
- 展開/收合控制優化
- Loading/Error 狀態使用 tour-card
- 全響應式間距

### ✅ 5. DayItem 元件 (`/app/trips/[id]/components/DayItem.tsx`)
- **最複雜的行動優化**:
  - Header 從 `flex-row` → 手機 `flex-col`
  - 徽章自動換行 (`flex-wrap`)
  - 雪場提示卡片適配窄螢幕
  - 所有文字使用 `text-xs sm:text-sm` 模式
  - 新增項目按鈕全寬 + 觸控友善高度

---

## 🎭 動畫效果

### 1. Velocity Shine (光澤掃過)

**觸發**: `.velocity-shine` 類別
**效果**: 白色光澤從左掃到右 (0.6s)
**用途**: CTA 按鈕、重要卡片

```css
@keyframes velocity-shine {
  0%   { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}
```

### 2. Tour Card Pulse (呼吸光暈)

**觸發**: `.tour-card-animate` 類別
**效果**: Emerald 光暈 2s 循環脈動
**用途**: Hover 狀態、強調卡片

```css
@keyframes tour-card-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  50%      { box-shadow: 0 0 20px 4px rgba(16,185,129,0.15); }
}
```

### 3. Loading Pulse (載入動畫)

**觸發**: `.loading-pulse` 類別
**效果**: Emerald 漸層背景透明度脈動

---

## ♿ 無障礙設計

### 1. 鍵盤導航
```css
*:focus-visible {
  outline: 2px solid var(--tour-primary);
  outline-offset: 2px;
}
```

### 2. 減少動畫偏好
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. 觸控目標尺寸
- 所有按鈕最小 `py-3` (12px × 2 + 行高 ≥ 44px)
- 手機版 badge 仍保持可讀性 (10px 字體 + padding)

---

## 📐 間距韻律系統

**Tailwind 4px 倍數原則**:
```
gap-2   = 8px   (密集排列)
gap-3   = 12px  (一般間距)
gap-4   = 16px  (舒適間距)

p-4     = 16px  (手機 padding)
p-6     = 24px  (平板 padding)
p-8     = 32px  (桌面 padding)

mb-2    = 8px   (小元素間距)
mb-4    = 16px  (段落間距)
mb-6    = 24px  (區塊間距)
mb-8    = 32px  (大區塊間距)
```

---

## 🔤 字體系統

### Display Font (標題)
**字體**: Bebas Neue
**引入**: Google Fonts CDN
**使用**: `.font-display`
**特色**: 全大寫、tracking-wide (字距寬鬆)

### Monospace Font (內文/數據)
**字體**: Space Mono
**使用**: `body` 預設
**特色**: 等寬、適合數據顯示

```tsx
// 標題
<h1 className="font-display text-6xl tracking-wide">

// 內文 (自動繼承 Space Mono)
<p className="text-base">
```

---

## 🚀 效能優化

### 1. 自訂滾動條
- 避免預設粗滾動條影響視覺
- Emerald 色主題化

### 2. 動畫節流
- 使用 `prefers-reduced-motion` 尊重用戶偏好
- 僅關鍵互動使用動畫

### 3. 響應式圖片/間距
- 避免手機載入過大素材
- 使用 Tailwind JIT 僅生成使用的類別

---

## 📱 手機版特別優化點

### 問題 1: 文字擠壓
**解決**: 所有標題使用 `text-base sm:text-lg` 模式

### 問題 2: Badge 換行混亂
**解決**: `flex-wrap` + `shrink-0` + 縮小 padding

### 問題 3: 行程 Header 資訊過多
**解決**: `flex-col sm:flex-row` + `items-start sm:items-center`

### 問題 4: 按鈕觸控目標小
**解決**: 手機版 `py-3` (最小 44px 高度)

### 問題 5: Tab 文字太長
**解決**: 手機僅顯示 icon (`inline sm:hidden`)

---

## 🎯 與平台其他系統的一致性

### 共享元素 (100% 一致)
- ✅ Polygon Clipping 卡片結構
- ✅ Skewed Typography 傾斜設計
- ✅ Velocity Shine 動畫
- ✅ Purple/Pink 次要徽章色
- ✅ Bebas Neue + Space Mono 字體組合
- ✅ 4px 倍數間距韻律
- ✅ 觸控友善設計

### 差異化元素
- 🎨 主色: **Emerald** (vs Amber/Cyan)
- 🎨 光暈: **Emerald Glow** (vs Amber/Cyan Glow)
- 🎨 語意: **旅程規劃** (vs 學習/探索)

---

## 📚 開發者使用指南

### 快速開始

1. **建立新卡片**:
```tsx
<div className="tour-card p-6">
  <h2 className="font-display text-2xl text-gradient-velocity skew-title">
    <span className="unskew">標題</span>
  </h2>
  <div className="tour-card-stripes"></div>
</div>
```

2. **新增徽章**:
```tsx
<div className="tour-badge badge-emerald">
  <span className="tour-badge-inner">📅 資訊</span>
</div>
```

3. **建立按鈕**:
```tsx
<button className="btn-tour-primary velocity-shine">
  立即行動 →
</button>
```

4. **響應式文字**:
```tsx
<p className="text-sm sm:text-base lg:text-lg">
  內容
</p>
```

### 常見模式

**手機優先間距**:
```tsx
className="p-4 sm:p-6 lg:p-8"
className="gap-2 sm:gap-3 lg:gap-4"
className="mb-4 sm:mb-6 lg:mb-8"
```

**響應式排版**:
```tsx
className="flex flex-col sm:flex-row"
className="items-start sm:items-center"
className="text-xs sm:text-sm lg:text-base"
```

**條件顯示**:
```tsx
className="inline sm:hidden"      // 僅手機顯示
className="hidden sm:inline"      // 僅桌面顯示
className="hidden lg:block"       // 僅大螢幕顯示
```

---

## ✅ 檢查清單

### 設計系統完整性
- [x] 色彩變數定義
- [x] 卡片元件樣式
- [x] 徽章系統
- [x] 按鈕樣式
- [x] 字體系統
- [x] 動畫效果
- [x] 響應式斷點

### 頁面覆蓋率
- [x] 首頁
- [x] 模板選擇
- [x] 我的行程
- [x] 行程詳情
- [x] DayItem 元件

### 行動優化
- [x] 文字縮放
- [x] 徽章縮放
- [x] 按鈕觸控目標
- [x] 排版響應式
- [x] 間距調整

### 無障礙
- [x] 鍵盤導航 focus
- [x] 減少動畫偏好
- [x] 觸控目標尺寸
- [x] 色彩對比度

---

**設計系統版本**: v1.0
**最後更新**: 2025-12-03
**設計原則**: Alpine Velocity (Emerald Variant)
**開發哲學**: Linus "Good Taste" - 統一而非重複，差異化有意義
