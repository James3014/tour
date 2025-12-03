# Tour 應用 - 行動版優化指南

## 🎯 核心問題與解決方案

### 問題 1: 文字在窄螢幕上擠壓難看

**Before**:
```tsx
<h1 className="text-4xl font-bold">選擇旅程模板</h1>
// 手機上 36px 太大，導致換行擠壓
```

**After**:
```tsx
<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl">
  選擇旅程模板
</h1>
// 手機 36px → 平板 48px → 桌面 60px
```

**CSS 全域調整**:
```css
@media (max-width: 640px) {
  .text-6xl { font-size: 2.5rem !important; }  /* 原 4rem = 64px */
  .text-4xl { font-size: 2rem !important; }    /* 原 2.25rem = 36px */
  .text-2xl { font-size: 1.5rem !important; }  /* 原 1.5rem = 24px */
}
```

---

### 問題 2: DayItem Header 資訊過多導致版面混亂

**Before** (單列強制排列):
```tsx
<button className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    ▶ 📅日期 Day 1 城市名稱 🏔️雪場 ⛷️滑雪日
  </div>
  <div>3 個項目 指定雪場</div>
</button>
// 手機上擠成一團，文字重疊
```

**After** (響應式垂直/水平排列):
```tsx
<button className="flex flex-col sm:flex-row sm:justify-between gap-2">
  <div className="flex items-center gap-2 flex-wrap">
    ▶ <Badge>日期</Badge> Day 1 <Badge>雪場</Badge> <Badge>滑雪日</Badge>
  </div>
  <div className="flex gap-2 self-start sm:self-auto">
    3 個項目 指定雪場
  </div>
</button>
```

**關鍵技巧**:
- `flex-col sm:flex-row` - 手機垂直，桌面水平
- `flex-wrap` - 徽章允許換行
- `gap-2 sm:gap-3` - 手機緊湊，桌面舒適
- `self-start sm:self-auto` - 手機左對齊，桌面跟隨

---

### 問題 3: 徽章 (Badge) 在手機上太大

**Before**:
```css
.tour-badge {
  font-size: 0.75rem;  /* 12px - 桌面合適，手機過大 */
  padding: 0.375rem 0.75rem;  /* 6px 12px */
}
```

**After**:
```css
.tour-badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

@media (max-width: 640px) {
  .tour-badge {
    font-size: 0.625rem;  /* 10px */
    padding: 0.25rem 0.5rem;  /* 4px 8px */
  }
}
```

**HTML 使用**:
```tsx
<div className="tour-badge badge-emerald">
  <span className="tour-badge-inner text-xs sm:text-sm">
    📅 {date}
  </span>
</div>
```

---

### 問題 4: Tab 標籤文字太長

**Before**:
```tsx
<button>📍 行程</button>
<button>✅ 行前準備</button>
// 手機上兩個 tab 各佔 50% 寬度，文字擠壓
```

**After**:
```tsx
<button>
  <span className="inline sm:hidden">📍</span>
  <span className="hidden sm:inline">📍 行程</span>
</button>
<button>
  <span className="inline sm:hidden">✅</span>
  <span className="hidden sm:inline">✅ 行前準備</span>
</button>
// 手機僅顯示 emoji，桌面顯示完整文字
```

---

### 問題 5: 卡片內間距手機上過於擁擠

**Before**:
```tsx
<div className="tour-card p-6">
// 手機上 24px padding 佔用太多空間
```

**After**:
```tsx
<div className="tour-card p-4 sm:p-6 lg:p-8">
// 手機 16px → 平板 24px → 桌面 32px
```

**間距策略表**:

| 元素 | 手機 | 平板 | 桌面 | Tailwind Class |
|-----|------|------|------|---------------|
| 卡片 padding | 16px | 24px | 32px | `p-4 sm:p-6 lg:p-8` |
| 卡片間距 | 16px | 24px | 24px | `gap-4 sm:gap-6` |
| 標題 margin-bottom | 12px | 16px | 24px | `mb-3 sm:mb-4 lg:mb-6` |
| 元素 gap | 8px | 12px | 16px | `gap-2 sm:gap-3 lg:gap-4` |
| 頁面 padding | 16px | 24px | 32px | `p-4 sm:p-6 lg:p-8` |

---

## 📱 響應式模式庫

### 模式 1: 響應式排版 (Flex Direction)

```tsx
// 垂直 → 水平
<div className="flex flex-col sm:flex-row">

// 對齊方式
<div className="items-start sm:items-center">

// 間距
<div className="gap-2 sm:gap-3 lg:gap-4">
```

### 模式 2: 響應式文字大小

```tsx
// 標題
<h1 className="text-4xl sm:text-5xl lg:text-6xl">

// 內文
<p className="text-sm sm:text-base lg:text-lg">

// 小字
<span className="text-xs sm:text-sm">
```

### 模式 3: 響應式顯示/隱藏

```tsx
// 僅手機顯示
<span className="inline sm:hidden">📱</span>

// 僅桌面顯示
<span className="hidden sm:inline">Desktop Text</span>

// 僅大螢幕顯示
<div className="hidden lg:block">Large Screen</div>
```

### 模式 4: 響應式寬度

```tsx
// 按鈕全寬 → 自動寬度
<button className="w-full sm:w-auto">

// 欄位寬度
<div className="w-full sm:w-1/2 lg:w-1/3">
```

### 模式 5: 響應式間距

```tsx
// Padding
className="p-4 sm:p-6 lg:p-8"

// Margin
className="mb-4 sm:mb-6 lg:mb-8"

// Gap
className="gap-2 sm:gap-3 lg:gap-4"
```

---

## 🎨 觸控友善設計

### 最小觸控目標尺寸: 44×44px

**按鈕高度計算**:
```
py-3 = padding-y: 12px × 2 = 24px
line-height: 約 20px (text-base)
總高度: 24 + 20 = 44px ✅
```

**實際應用**:
```tsx
// 主要按鈕 (CTA)
<button className="py-3 sm:py-4">  // 44px → 52px

// 次要按鈕
<button className="py-2 sm:py-3">  // 36px → 44px

// Icon 按鈕
<button className="w-11 h-11">    // 44×44px
```

---

## 📐 手機版間距韻律

### 推薦間距系統 (4px 倍數)

```
2  = 8px   ✅ 密集排列 (徽章間距、icon gap)
3  = 12px  ✅ 一般間距 (元素間距)
4  = 16px  ✅ 舒適間距 (卡片 padding、頁面 padding)
6  = 24px  ✅ 區塊間距 (section margin)
8  = 32px  ⚠️  手機上過大，建議用於桌面
```

### 實際應用範例

**頁面結構**:
```tsx
<main className="p-4 sm:p-6 lg:p-8">           // 頁面邊距
  <div className="mb-6 sm:mb-8">               // 大區塊間距
    <h1 className="mb-3 sm:mb-4">              // 標題間距
    <div className="flex gap-2 sm:gap-3">      // 元素間距
      <Badge />
      <Badge />
    </div>
  </div>

  <div className="grid gap-4 sm:gap-6">        // 卡片間距
    <Card className="p-4 sm:p-6" />
    <Card className="p-4 sm:p-6" />
  </div>
</main>
```

---

## 🧪 測試檢查清單

### 視覺測試 (使用 Chrome DevTools)

- [ ] iPhone SE (375×667) - 最小寬度
- [ ] iPhone 12 Pro (390×844) - 常見尺寸
- [ ] iPad Mini (768×1024) - 平板直向
- [ ] iPad Pro (1024×1366) - 平板橫向
- [ ] Desktop (1920×1080) - 桌面

### 互動測試

- [ ] 所有按鈕可點擊 (44×44px)
- [ ] 文字不重疊
- [ ] 徽章不會換行混亂
- [ ] 卡片內容不超出邊界
- [ ] 滾動流暢 (無水平滾動)

### 內容測試

- [ ] 長文字自動換行
- [ ] 短文字不會過於分散
- [ ] emoji 對齊正常
- [ ] 日期格式適配寬度

---

## 🚀 效能優化

### 1. 避免不必要的斷點

**Bad**:
```tsx
<div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
// 過多斷點，增加 CSS 體積
```

**Good**:
```tsx
<div className="text-sm sm:text-base lg:text-lg">
// 3 個關鍵斷點足夠
```

### 2. 使用 Tailwind JIT

`tailwind.config.ts` 已啟用 JIT，僅生成實際使用的類別。

### 3. 合併重複的響應式模式

**Bad**:
```tsx
<div className="p-4 sm:p-6">
  <h1 className="text-4xl sm:text-5xl">
    <p className="text-sm sm:text-base">
// 每個元素都重複 sm: 斷點
```

**Good**: 使用 CSS 變數或 Component Wrapper
```tsx
<div className="mobile-spacing">  // 統一處理間距
  <h1 className="display-title">
  <p className="body-text">
```

---

## 📊 前後對比數據

### 文字可讀性

| 元素 | Before (手機) | After (手機) | 改善 |
|-----|--------------|-------------|-----|
| 主標題 | 64px (過大) | 40px | ✅ -37.5% |
| 副標題 | 36px (過大) | 32px | ✅ -11% |
| 內文 | 16px | 14-16px | ✅ 適中 |
| 徽章 | 12px | 10px | ✅ -16.7% |

### 觸控目標

| 元素 | Before | After | 符合標準 |
|-----|--------|-------|---------|
| 主按鈕 | 48px | 44px+ | ✅ |
| 次按鈕 | 36px | 44px+ | ✅ |
| Tab 按鈕 | 48px | 48px | ✅ |
| Icon 按鈕 | 32px ❌ | 44px+ | ✅ |

### 版面密度

| 頁面 | Before | After | 改善 |
|-----|--------|-------|-----|
| 首頁 | 擁擠 | 舒適 | ✅ |
| 模板頁 | 卡片過大 | 適中 | ✅ |
| DayItem | 文字重疊 ❌ | 清晰排列 | ✅ |

---

## 💡 最佳實踐總結

### 1. 永遠從手機開始設計
```tsx
// ✅ Mobile First
<div className="p-4 sm:p-6 lg:p-8">

// ❌ Desktop First
<div className="p-8 lg:p-6 sm:p-4">
```

### 2. 使用語意化斷點
```tsx
sm:  640px  → 平板直向
md:  768px  → 平板橫向
lg:  1024px → 桌面
xl:  1280px → 大桌面 (少用)
```

### 3. 保持間距一致性
- 所有間距使用 4px 倍數
- 同類元素使用相同間距模式
- 避免特殊數值 (如 5px, 7px)

### 4. 測試真實裝置
- Chrome DevTools 僅模擬，需真機測試
- 關注 iPhone SE (375px) 最小寬度
- 測試橫向/直向切換

### 5. 效能優先
- 避免過多動畫
- 減少不必要的斷點
- 使用 CSS 變數統一管理

---

**文件版本**: v1.0
**最後更新**: 2025-12-03
**測試裝置**: iPhone SE, iPhone 12 Pro, iPad Mini, Desktop
**設計原則**: Mobile First + 44px Touch Target + 4px Grid
