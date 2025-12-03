# Tour 應用 - AI 生圖需求清單

## 🎨 設計風格指引

所有圖片應遵循 **Alpine Velocity** 美學：
- **色調**: Emerald/Teal 綠色系 + 深色背景
- **風格**: 現代、簡潔、高科技感
- **情感**: 冒險、成長、協調、專業

---

## 📷 圖片需求清單

### 1. 首頁 Hero Background (可選)
**用途**: 首頁背景裝飾圖
**位置**: `/app/page.tsx`
**尺寸**: `1920×1080px` (Full HD橫幅)
**格式**: WebP / PNG (透明背景優先)

**提示詞 (Midjourney/DALL-E)**:
```
Abstract geometric mountain landscape, emerald and teal gradient,
minimalist ski slope silhouettes, dark background (#0a0a0a),
diagonal motion lines suggesting speed and movement,
subtle grain texture, modern tech aesthetic,
atmospheric depth with layered transparency,
no text, no people, ultra-wide panoramic view,
digital art style, high contrast --ar 16:9 --v 6
```

**中文提示詞 (Stable Diffusion / 通義萬相)**:
```
抽象幾何山脈景觀，祖母綠和青綠色漸層，
極簡滑雪坡道剪影，深黑色背景，
對角線運動線條暗示速度與動感，
細微顆粒質感，現代科技美學，
具層次感的透明度營造大氣深度，
無文字，無人物，超寬全景視角，
數位藝術風格，高對比度
```

---

### 2. 模板卡片縮圖 (4張)
**用途**: 模板選擇頁的視覺吸引
**位置**: `/app/templates/page.tsx`
**尺寸**: `800×600px` (4:3 比例)
**格式**: WebP / JPG

#### 2.1 東北精華 5 日 (北海道 + 長野)
**提示詞**:
```
Split view composition: left side Hokkaido powder snow mountain
with conifer trees, right side Nagano hot spring village at dusk,
emerald accent glow, dark moody sky, cinematic lighting,
snowflakes floating, 4:3 aspect ratio,
travel photography style, no text --ar 4:3 --v 6
```

**中文**:
```
分割式構圖：左側北海道粉雪山峰配針葉樹林，
右側長野溫泉村落黃昏景色，
祖母綠強調光暈，深沉戲劇性天空，電影感打光，
飄雪氛圍，4:3 比例，旅行攝影風格，無文字
```

#### 2.2 新手友善 4 日 (輕鬆入門)
**提示詞**:
```
Gentle beginner-friendly ski slope, wide open groomed run,
soft morning light, welcoming atmosphere,
small group of distant skiers for scale,
emerald green trees lining the slope,
4:3 ratio, bright and inviting mood, no text --ar 4:3 --v 6
```

**中文**:
```
平緩的初學者友善滑雪道，寬闊的整備雪道，
柔和晨光，溫暖氛圍，
遠處小群滑雪者顯示比例，
翠綠松樹環繞雪道，
4:3 比例，明亮歡迎的氛圍，無文字
```

#### 2.3 深度探索 7 日 (進階挑戰)
**提示詞**:
```
Dramatic steep mountain backcountry terrain,
powder spray action shot, advanced skier carving,
dynamic diagonal composition,
emerald and teal color grading,
high contrast lighting, adventure photography,
4:3 ratio, energetic mood, no text --ar 4:3 --v 6
```

**中文**:
```
戲劇性陡峭山地野雪地形，
粉雪噴濺動作特寫，進階滑雪者刻滑，
動態對角線構圖，
祖母綠和青綠色調，
高對比打光，探險攝影風格，
4:3 比例，充滿活力的氛圍，無文字
```

#### 2.4 家庭親子 6 日 (全家同樂)
**提示詞**:
```
Family-friendly ski resort scene, colorful ski school area,
gentle slopes with safety nets,
warm afternoon light, playful atmosphere,
emerald pine trees, snowman decorations,
4:3 ratio, cheerful and safe mood, no text --ar 4:3 --v 6
```

**中文**:
```
家庭友善滑雪度假村景象，色彩繽紛的滑雪學校區域，
平緩坡道配安全網，
溫暖午後陽光，趣味氛圍，
翠綠松樹，雪人裝飾，
4:3 比例，愉快安全的氛圍，無文字
```

---

### 3. 行程類型圖示 (8組)
**用途**: TripItem 卡片的圖示背景
**位置**: `/app/trips/[id]/components/TripItem.tsx`
**尺寸**: `128×128px` (正方形)
**格式**: PNG (透明背景)

**統一提示詞模板**:
```
Icon background square 128px, [SPECIFIC_THEME] theme,
emerald to teal gradient (#10b981 to #14b8a6),
subtle geometric pattern,
minimal abstract design, dark edges fade to center,
transparent background, no text, no emoji --v 6
```

#### 3.1 航班 (Flight)
```[SPECIFIC_THEME] = airplane takeoff with subtle contrails```

#### 3.2 住宿 (Hotel)
```[SPECIFIC_THEME] = building roof skyline with windows```

#### 3.3 交通 (Transfer)
```[SPECIFIC_THEME] = road path with motion lines```

#### 3.4 滑雪 (Ski)
```[SPECIFIC_THEME] = mountain slope with ski tracks```

#### 3.5 課程 (Lesson)
```[SPECIFIC_THEME] = book pages with mountain silhouette```

#### 3.6 待辦 (Todo)
```[SPECIFIC_THEME] = checkmark with dotted pattern```

#### 3.7 備註 (Note)
```[SPECIFIC_THEME] = paper note with corner fold```

#### 3.8 其他 (Other)
```[SPECIFIC_THEME] = pin marker with circular ripple```

---

### 4. 雪場區域背景 (3張)
**用途**: DayItem 展開時的雪場資訊背景
**位置**: `/app/trips/[id]/components/DayItem.tsx`
**尺寸**: `1200×300px` (超寬橫幅)
**格式**: WebP (半透明優先)

#### 4.1 北海道風格
**提示詞**:
```
Hokkaido winter landscape banner,
wide powder snow fields, distant conifer forests,
soft blue-purple twilight,
ethereal misty atmosphere,
emerald accent lighting,
1200x300px ultra-wide format,
semi-transparent overlay-ready (#40000000),
no text --ar 4:1 --v 6
```

**中文**:
```
北海道冬季景觀橫幅，
廣闊粉雪原野，遠處針葉林，
柔和藍紫色黃昏，
空靈霧氣氛圍，
祖母綠強調光效，
1200×300px 超寬格式，
半透明疊加就緒（40% 透明度），無文字
```

#### 4.2 長野風格
**提示詞**:
```
Nagano mountain valley banner,
traditional onsen town in snow,
warm orange lantern lights contrasting cold blue snow,
cozy inviting atmosphere,
emerald pine trees framing,
1200x300px ultra-wide,
semi-transparent, no text --ar 4:1 --v 6
```

**中文**:
```
長野山谷橫幅，
雪中傳統溫泉小鎮，
溫暖橙色燈籠光與冷調藍雪對比，
溫馨邀請氛圍，
翠綠松樹框景，
1200×300px 超寬，半透明，無文字
```

#### 4.3 新潟風格
**提示詞**:
```
Niigata heavy snowfall banner,
bullet train (shinkansen) passing through snowy landscape,
dynamic motion blur,
modern infrastructure meets nature,
emerald accent highlights,
1200x300px ultra-wide,
semi-transparent, no text --ar 4:1 --v 6
```

**中文**:
```
新潟大雪橫幅，
新幹線穿越雪景，
動態運動模糊，
現代基建與自然交融，
祖母綠強調亮點，
1200×300px 超寬，半透明，無文字
```

---

### 5. Empty State 插圖 (2張)
**用途**: 無資料時的友善提示
**位置**: 各頁面的 empty state
**尺寸**: `600×600px` (正方形)
**格式**: WebP / PNG (透明背景)

#### 5.1 無行程
**提示詞**:
```
Illustration of empty map with dotted path waiting to be drawn,
minimalist line art, emerald and teal colors,
playful friendly style,
small mountain icon in corner,
transparent background, no text --v 6
```

**中文**:
```
空白地圖插畫配等待繪製的虛線路徑，
極簡線條藝術，祖母綠和青綠色，
俏皮友善風格，
角落小山圖示，
透明背景，無文字
```

#### 5.2 無項目
**提示詞**:
```
Illustration of empty checklist clipboard with one item placeholder,
minimal line art, emerald accent color,
encouraging positive vibe,
transparent background, no text --v 6
```

**中文**:
```
空白核對清單夾板插畫配一個項目佔位符，
極簡線條藝術，祖母綠強調色，
鼓勵正面氛圍，
透明背景，無文字
```

---

## 📐 圖片尺寸總覽

| 類型 | 尺寸 | 數量 | 格式 | 透明度 |
|-----|------|------|------|-------|
| Hero Background | 1920×1080 | 1 | WebP/PNG | 可選 |
| 模板縮圖 | 800×600 | 4 | WebP/JPG | 不透明 |
| 圖示背景 | 128×128 | 8 | PNG | **透明** |
| 雪場橫幅 | 1200×300 | 3 | WebP | **半透明** |
| Empty State | 600×600 | 2 | WebP/PNG | **透明** |
| **總計** | - | **18張** | - | - |

---

## 🎯 生成優先級

### Phase 1 (優先) - 立即改善視覺
1. ✅ **模板縮圖 ×4** - 最吸引用戶點擊
2. ✅ **圖示背景 ×8** - 大幅提升 TripItem 質感

### Phase 2 (次要) - 增強氛圍
3. 🔲 **雪場橫幅 ×3** - 區域識別感
4. 🔲 **Empty State ×2** - 友善體驗

### Phase 3 (可選) - 錦上添花
5. 🔲 **Hero Background ×1** - 首頁氛圍

---

## 💡 生成技巧建議

### Midjourney 用戶
```bash
# 基礎指令結構
/imagine prompt: [YOUR_PROMPT] --ar [RATIO] --v 6 --style raw

# 調整參數
--stylize 500    # 控制藝術化程度 (0-1000)
--chaos 30       # 控制變化度 (0-100)
--quality 2      # 提高品質 (1 或 2)
```

### DALL-E 3 用戶
- 使用 "no text, no watermark" 強調無文字
- 描述越詳細越好，特別是色彩和氛圍
- 可加 "photorealistic" 或 "digital art" 指定風格

### Stable Diffusion 用戶
```
Negative prompt:
text, watermark, signature, low quality, blurry,
bad anatomy, ugly, deformed, noise, artifacts
```

### 通義萬相 / 文心一格
- 中文提示詞更直觀
- 強調"無文字、無標誌、高品質"
- 可使用"電影感"、"商業攝影"等關鍵詞

---

## 📦 交付格式

生成完成後請提供：

### 檔案命名規範
```
hero-background.webp
template-hokkaido-nagano.webp
template-beginner.webp
template-advanced.webp
template-family.webp
icon-flight-bg.png
icon-hotel-bg.png
...
resort-hokkaido-banner.webp
resort-nagano-banner.webp
resort-niigata-banner.webp
empty-no-trips.webp
empty-no-items.webp
```

### 資料夾結構
```
tour/public/images/
├── hero/
│   └── background.webp
├── templates/
│   ├── hokkaido-nagano.webp
│   ├── beginner.webp
│   ├── advanced.webp
│   └── family.webp
├── icons/
│   ├── flight-bg.png
│   ├── hotel-bg.png
│   ├── transfer-bg.png
│   ├── ski-bg.png
│   ├── lesson-bg.png
│   ├── todo-bg.png
│   ├── note-bg.png
│   └── other-bg.png
├── resorts/
│   ├── hokkaido-banner.webp
│   ├── nagano-banner.webp
│   └── niigata-banner.webp
└── empty/
    ├── no-trips.webp
    └── no-items.webp
```

---

## ✅ 品質檢查清單

生成後請確認：
- [ ] 尺寸正確（使用工具裁剪至精確像素）
- [ ] 格式正確（PNG 透明背景 / WebP 半透明）
- [ ] 無浮水印、無文字
- [ ] 色調符合 Emerald/Teal 綠色系
- [ ] 檔案大小合理（圖示 <50KB，橫幅 <200KB）
- [ ] 在深色背景 (#0a0a0a) 上測試顯示效果

---

**文件版本**: v1.0
**建立日期**: 2025-12-03
**配合專案**: Tour Application - Alpine Velocity Design System
