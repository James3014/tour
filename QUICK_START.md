# Tour 應用 - 快速開始指南

## 🚀 5 分鐘上手 Alpine Velocity

### 1. 建立新頁面

```tsx
// app/my-page/page.tsx
import Link from 'next/link';

export default function MyPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 返回連結 */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-4">
          <span>←</span>
          <span>返回</span>
        </Link>

        {/* 頁面標題 */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-3 text-gradient-velocity tracking-wide skew-title">
          <span className="unskew inline-block">我的頁面</span>
        </h1>
        <div className="h-1 w-24 sm:w-32 tour-card-stripes mb-6"></div>

        {/* 內容區 */}
        <div className="space-y-4 sm:space-y-6">
          {/* 你的內容 */}
        </div>
      </div>
    </main>
  );
}
```

---

### 2. 建立卡片列表

```tsx
// 響應式網格
<div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <div key={item.id} className="tour-card p-4 sm:p-6 hover:tour-card-animate">
      <h2 className="font-display text-2xl sm:text-3xl mb-3 text-gradient-velocity tracking-wide skew-title">
        <span className="unskew inline-block">{item.title}</span>
      </h2>

      <p className="text-zinc-400 text-sm sm:text-base mb-4 leading-relaxed">
        {item.description}
      </p>

      {/* 徽章 */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
        <div className="tour-badge badge-emerald">
          <span className="tour-badge-inner">{item.badge1}</span>
        </div>
        <div className="tour-badge badge-purple">
          <span className="tour-badge-inner">{item.badge2}</span>
        </div>
      </div>

      {/* 按鈕 */}
      <button className="btn-tour-primary w-full velocity-shine">
        查看詳情 →
      </button>

      <div className="tour-card-stripes"></div>
    </div>
  ))}
</div>
```

---

### 3. 建立表單

```tsx
<div className="tour-card p-4 sm:p-6">
  <h2 className="font-display text-2xl sm:text-3xl mb-4 text-gradient-velocity">
    表單標題
  </h2>

  <form className="space-y-4">
    {/* 輸入框 */}
    <div>
      <label className="block text-sm font-bold text-emerald-400 mb-2">
        標籤名稱
      </label>
      <input
        type="text"
        className="w-full px-4 py-3 bg-zinc-900 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
        placeholder="請輸入..."
      />
    </div>

    {/* 下拉選單 */}
    <div>
      <label className="block text-sm font-bold text-emerald-400 mb-2">
        選項
      </label>
      <select className="w-full px-4 py-3 bg-zinc-900 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500">
        <option>選項 1</option>
        <option>選項 2</option>
      </select>
    </div>

    {/* 按鈕組 */}
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <button type="submit" className="btn-tour-primary velocity-shine flex-1">
        確認送出
      </button>
      <button type="button" className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold transition-colors clip-corner">
        取消
      </button>
    </div>
  </form>
</div>
```

---

### 4. 建立折疊面板

```tsx
'use client';
import { useState } from 'react';

export default function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tour-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 flex items-center justify-between bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
      >
        <h3 className="font-display text-lg sm:text-xl text-gradient-velocity">
          {title}
        </h3>
        <span className={`transform transition-transform text-emerald-400 ${isOpen ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-emerald-500/20 p-4 sm:p-6 bg-zinc-900/20">
          {children}
        </div>
      )}

      <div className="tour-card-stripes"></div>
    </div>
  );
}
```

---

### 5. 建立 Loading 狀態

```tsx
// Skeleton Loading
<div className="space-y-4">
  <div className="tour-card h-48 loading-pulse"></div>
  <div className="tour-card h-32 loading-pulse"></div>
  <div className="tour-card h-32 loading-pulse"></div>
</div>

// Spinner Loading
<div className="tour-card p-12 text-center">
  <div className="inline-block w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
  <p className="text-zinc-400 mt-4">載入中...</p>
</div>
```

---

### 6. 建立 Error 狀態

```tsx
<div className="tour-card p-6 sm:p-8 border-red-500/30">
  <div className="text-4xl mb-4">⚠️</div>
  <h2 className="font-display text-2xl mb-2 text-red-400">發生錯誤</h2>
  <p className="text-zinc-400 mb-4">{errorMessage}</p>
  <button
    onClick={retry}
    className="btn-tour-primary velocity-shine"
  >
    重試
  </button>
</div>
```

---

### 7. 建立 Empty State

```tsx
<div className="tour-card p-12 text-center">
  <div className="text-5xl mb-4">🗺️</div>
  <h2 className="font-display text-2xl sm:text-3xl mb-2 text-gradient-velocity">
    尚無資料
  </h2>
  <p className="text-zinc-400 mb-6">開始建立你的第一個項目</p>
  <button className="btn-tour-primary velocity-shine">
    立即開始 →
  </button>
</div>
```

---

## 🎨 常用元件片段

### 徽章組合

```tsx
// 主要資訊 (emerald)
<div className="tour-badge badge-emerald">
  <span className="tour-badge-inner">📅 日期</span>
</div>

// 次要資訊 (purple)
<div className="tour-badge badge-purple">
  <span className="tour-badge-inner">👥 人數</span>
</div>

// 補充資訊 (teal)
<div className="tour-badge badge-teal">
  <span className="tour-badge-inner">📝 天數</span>
</div>
```

### 按鈕變體

```tsx
// 主要按鈕
<button className="btn-tour-primary velocity-shine">
  主要動作
</button>

// 次要按鈕
<button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold transition-colors clip-corner">
  次要動作
</button>

// 危險按鈕
<button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg font-bold transition-colors">
  刪除
</button>

// 連結按鈕
<button className="text-emerald-400 hover:text-emerald-300 transition-colors">
  了解更多 →
</button>
```

### 分隔線

```tsx
// 水平線
<div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

// 垂直線
<div className="w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
```

---

## 📱 響應式速查表

### 文字大小
```tsx
// 超大標題
text-6xl sm:text-7xl lg:text-8xl

// 大標題
text-4xl sm:text-5xl lg:text-6xl

// 中標題
text-2xl sm:text-3xl lg:text-4xl

// 小標題
text-xl sm:text-2xl

// 內文
text-sm sm:text-base lg:text-lg

// 小字
text-xs sm:text-sm
```

### 間距
```tsx
// Padding
p-4 sm:p-6 lg:p-8

// Margin
mb-4 sm:mb-6 lg:mb-8

// Gap
gap-2 sm:gap-3 lg:gap-4
```

### 排版
```tsx
// 垂直 → 水平
flex flex-col sm:flex-row

// 對齊
items-start sm:items-center

// 寬度
w-full sm:w-auto
```

---

## 🎯 設計原則

### 1. 行動優先
永遠從手機尺寸開始設計，逐步增強到桌面。

### 2. 觸控友善
所有按鈕最小 44×44px。

### 3. 清晰階層
使用卡片、徽章、標題建立視覺層級。

### 4. 一致性
遵循 4px 間距韻律，使用統一的色彩系統。

### 5. 效能
避免過度動畫，優先使用 CSS 動畫。

---

## ⚠️ 常見錯誤

### ❌ 錯誤 1: 忘記響應式
```tsx
<h1 className="text-6xl">  // 手機上太大
```
✅ 正確:
```tsx
<h1 className="text-4xl sm:text-5xl lg:text-6xl">
```

### ❌ 錯誤 2: 硬編碼顏色
```tsx
<div className="bg-green-500">  // 不符合設計系統
```
✅ 正確:
```tsx
<div className="bg-emerald-500">  // 使用 emerald
```

### ❌ 錯誤 3: 忘記 unskew
```tsx
<h1 className="skew-title">標題</h1>  // 文字也傾斜了
```
✅ 正確:
```tsx
<h1 className="skew-title">
  <span className="unskew">標題</span>
</h1>
```

### ❌ 錯誤 4: 忘記 tour-card-stripes
```tsx
<div className="tour-card">
  {/* 內容 */}
</div>
```
✅ 正確:
```tsx
<div className="tour-card">
  {/* 內容 */}
  <div className="tour-card-stripes"></div>
</div>
```

### ❌ 錯誤 5: 按鈕太小
```tsx
<button className="py-1">  // 觸控目標太小
```
✅ 正確:
```tsx
<button className="py-3 sm:py-4">  // 最小 44px
```

---

## 🔗 相關文件

- **DESIGN_SYSTEM.md** - 完整設計系統文件
- **MOBILE_OPTIMIZATION.md** - 行動版優化指南
- **UI_COMPARISON.md** (specs/) - 與其他系統的對比

---

## 🎓 學習資源

### Tailwind CSS
- 官方文件: https://tailwindcss.com/docs
- 響應式設計: https://tailwindcss.com/docs/responsive-design

### Alpine Velocity
- 參考 `specs/resort-services/UI_COMPARISON.md`
- 色彩系統、動畫、字體皆遵循相同規範

### 無障礙設計
- WCAG 2.1 AA 標準
- 44×44px 觸控目標
- 鍵盤導航支援

---

**版本**: v1.0
**更新日期**: 2025-12-03
**維護者**: DIY Ski Development Team
