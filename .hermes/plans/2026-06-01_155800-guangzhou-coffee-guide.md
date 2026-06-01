# 广州咖啡指南 — 项目规划 v2

> **参考:** [Garry's Coffee Map (汕头)](https://garryscoffee.com/) — 单页滚动架构、双层筛选、咖啡杯进度条、手绘 SVG 装饰
>
> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 打造一个收录广州咖啡店的可筛选、可探索的在线咖啡指南，以个人视角帮用户找到好店。

**Architecture:** 单页滚动网站 (SPA)，纯 HTML/CSS/JS，无框架依赖。咖啡店数据以 JSON 文件管理，前端提供区域筛选、标签筛选、搜索等交互能力。部署为纯静态站点。

**Tech Stack:** Vanilla HTML + CSS + JavaScript + Google Fonts

**设计参考:** Garry's Coffee Map 的温暖编辑感风格，适配广州城市气质

---

## 项目愿景

这不是一个点评平台，而是一份**个人视角的广州咖啡地图**。每家店都有你的亲身体验和推荐理由，帮用户绕过踩坑，直接找到好店。

### 核心功能

| 功能 | 说明 |
|------|------|
| 🗺️ 区域筛选 | 按天河、越秀、海珠、荔湾等广州行政区筛选（深色条） |
| 🏷️ 风格标签 | 精品手冲、创意特调、工业风、安静办公等（浅色条） |
| ⭐ 个人推荐 | 你的独家推荐语和评分 |
| 🔍 搜索 | 按店名、地址、关键词搜索 |
| ☕ 精选推荐 | 横向滚动 + 手绘咖啡杯进度条 |
| 💬 Why I pick | 点击精选店铺弹出推荐理由气泡 |
| 📱 响应式 | 手机端优先，咖啡探店场景天然移动端 |

### 非功能目标

- 首屏加载 < 1s（纯静态）
- 数据维护简单（改 JSON 即可，无需后台）
- Vercel / Cloudflare Pages / GitHub Pages 一键部署

---

## 设计系统

### 配色方案（灵感来自 Garry's，适配广州）

```css
:root {
  /* 主色调 — 温暖咖啡感 */
  --cream: #F7F3ED;           /* 主背景 */
  --warm-white: #FEFCF9;      /* Hero 背景 */
  --sand: #E8E0D4;            /* 分割线、次要背景 */
  --stone: #C4B9A8;           /* 占位色 */

  /* 文字 */
  --ink: #1A1612;             /* 主文字 */
  --ink-light: #3D362E;       /* 次要文字 */
  --ink-faded: #6B6158;       /* 辅助文字 */

  /* 强调色 — 广州蓝（替代 Garry's 的日本蓝） */
  --accent: #2B5F8A;          /* 广州蓝 — 主强调 */
  --accent-soft: #4A7FA8;     /* 柔和蓝 */
  --accent-light: #E8EFF6;    /* 蓝色背景 */

  /* 辅助色 */
  --matcha: #6B7F5A;          /* 抹茶绿 — 标签 */
  --gold: #B8963E;            /* 金色 — 评分 */
}
```

### 字体

```css
/* 显示字体 — 优雅衬线 */
--font-display: 'Cormorant Garamond', 'Noto Serif SC', 'Georgia', serif;

/* 正文 — 清晰无衬线 */
--font-body: 'DM Sans', 'Noto Sans SC', 'Hiragino Sans', sans-serif;
```

### 视觉细节

- 装饰性圆点（dot elements）
- 手绘风格 SVG 图标（咖啡杯、咖啡豆）
- 柔和的背景渐变动画
- 卡片 hover 微上浮 + 阴影
- 字体 staggered reveal 动画

---

## 页面结构（单页滚动）

```
┌─────────────────────────────────────────┐
│  Hero Section (100vh)                    │
│  "Guangzhou" 字母间距动画               │
│  大标题 staggered word reveal            │
│  副标题 + 咖啡插画                       │
│  统计：X家店 · X个区域 · X.X平均评分     │
│  向下滚动提示箭头                        │
├─────────────────────────────────────────┤
│  Toolbar (sticky)                        │
│  Logo + 搜索框 + 结果计数                │
├─────────────────────────────────────────┤
│  Areas Bar (深色条)                      │
│  [全部] [天河] [越秀] [海珠] [荔湾] ...  │
├─────────────────────────────────────────┤
│  Tags Bar (浅色条)                       │
│  [手冲好评] [意式好评] [创意特调] ...     │
├─────────────────────────────────────────┤
│  Featured Section                        │
│  "我的推荐" 标题 + 副标题                │
│  横向滚动精选卡片                        │
│  ☕ 手绘咖啡杯进度条（液面随滚动上升）    │
├─────────────────────────────────────────┤
│  Main Content (店铺列表)                 │
│  按区域分组的店铺卡片网格                 │
│  或筛选后的结果列表                       │
├─────────────────────────────────────────┤
│  Footer                                 │
│  "广州咖啡指南 · Made with ☕"           │
└─────────────────────────────────────────┘

弹出层：
│  💬 Thought Bubble (点击精选店铺触发)    │
│  "Why I pick" + 推荐理由                 │
```

---

## 数据模型

### 咖啡店数据结构 `data/shops.json`

```json
{
  "id": 1,
  "name": "JPG Coffee",
  "nameEn": "JPG Coffee",
  "address": "广东省广州市天河区体育西路天河街54号",
  "lat": 23.136,
  "lng": 113.329,
  "area": "天河区",
  "district": "体育西",
  "rating": 4.5,
  "tags": ["精品手冲", "自烘焙", "安静办公"],
  "featured": true,
  "recommendation": "广州精品咖啡的标杆之一，dirty是招牌。豆子自烘，品质稳定。",
  "highlights": ["dirty", "手冲单品"],
  "priceRange": "¥30-50",
  "hours": "周一至周日 08:00-20:00",
  "metro": "体育西路站 B 出口步行 3 分钟",
  "features": {
    "wifi": true,
    "powerOutlets": true,
    "petFriendly": false,
    "outdoor": false
  }
}
```

### 标签分类

**咖啡风味：**
- 精品手冲、意式好评、创意特调、日式深烘、自烘焙

**空间环境：**
- 环境好评、工业风、日式简约、复古怀旧、独栋老宅、社区小店

**场景适配：**
- 安静办公、朋友聚会、一人独享、约会首选、拍照打卡、宠物友好

### 区域数据

| 区域 | 片区 | 描述 |
|------|------|------|
| 天河区 | 体育西、珠江新城、天河南、岗顶 | 精品咖啡密度最高 |
| 越秀区 | 东山口、北京路、淘金、环市东 | 老城区新活力 |
| 海珠区 | 琶洲、江南西、滨江东、客村 | 文艺隐藏宝藏 |
| 荔湾区 | 沙面、永庆坊、恩宁路 | 西关风情碰撞 |
| 白云区 | 白云新城、嘉禾望岗 | 新兴势力 |
| 番禺区 | 万博、市桥、大学城 | 年轻氛围 |

---

## 目录结构

```
E:\coffee map\
├── index.html                # 主页面（单页滚动）
├── css/
│   └── style.css             # 全部样式
├── js/
│   ├── data.js               # 咖啡店数据（const coffeeShops = [...]）
│   └── main.js               # 筛选、渲染、交互逻辑
├── images/
│   ├── hero-coffee.png       # Hero 区域插画
│   ├── shops/                # 店铺照片
│   │   ├── jpg-coffee.jpg
│   │   └── ...
│   └── favicon.ico
└── README.md
```

---

## 实施计划

### Phase 1: 基础框架（Task 1-3）

#### Task 1: 创建 HTML 结构

**Objective:** 搭建完整的 HTML 骨架

**Files:**
- Create: `index.html`

**结构:**
- Hero section（100vh）— 城市名、标题、副标题、统计数字、插画、装饰元素
- Toolbar（sticky）— Logo、搜索框、结果计数
- Areas bar — 区域筛选条
- Tags bar — 标签筛选条
- Featured section — 精选推荐区
- Main content — 店铺列表区
- Footer
- Thought bubble portal（弹出层）

**Hero 装饰元素:**
```html
<div class="dot dot-1"></div>
<div class="dot dot-2"></div>
<div class="dot dot-3"></div>
<div class="dot dot-4"></div>
<div class="overlap-slash"></div>
<div class="corner-accent"></div>
```

**验证:** 浏览器打开 index.html，看到所有 section 的骨架

---

#### Task 2: 编写完整 CSS 样式

**Objective:** 实现 Garry's 风格的温暖编辑感设计

**Files:**
- Create: `css/style.css`

**样式清单:**

1. **CSS Variables** — 配色方案、字体、圆角、阴影
2. **Reset & Base** — 全局重置、基础排版
3. **Hero Section** — 100vh、装饰点动画、标题 staggered reveal、插画浮动、统计数字
4. **Toolbar** — sticky、毛玻璃效果、搜索框样式
5. **Areas Bar** — 深色背景、横向滚动标签
6. **Tags Bar** — 浅色背景、标签 pill 样式
7. **Featured Section** — 横向滚动、精选卡片、咖啡杯进度条 SVG
8. **Shop Cards** — 网格布局、hover 效果
9. **Thought Bubble** — 弹出气泡动画
10. **Footer** — 简洁
11. **Responsive** — 移动端适配
12. **Animations** — bgDrift、wordSlideUp、fadeSlideUp、imgBounceIn、imgFloat

**关键动画:**
```css
@keyframes bgDrift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(2%, -1%) rotate(0.3deg); }
  66% { transform: translate(-1%, 1%) rotate(-0.2deg); }
}

@keyframes wordSlideUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes labelReveal {
  0% { opacity: 0; letter-spacing: 1.2em; transform: translateY(8px); }
  100% { opacity: 1; letter-spacing: 0.5em; transform: translateY(0); }
}
```

**验证:** 页面视觉效果接近 Garry's 的温暖感

---

#### Task 3: 创建数据文件

**Objective:** 建立咖啡店数据和 JS 入口

**Files:**
- Create: `js/data.js` — 咖啡店数组
- Create: `js/main.js` — 空骨架

**data.js 结构:**
```javascript
const coffeeShops = [
  {
    id: 1,
    name: "JPG Coffee",
    address: "广东省广州市天河区体育西路天河街54号",
    lat: 23.136,
    lng: 113.329,
    area: "天河区",
    rating: 4.5,
    tags: ["精品手冲", "自烘焙", "安静办公"],
    featured: true,
    recommendation: "广州精品咖啡的标杆之一，dirty是招牌。"
  },
  // ... 8-10 家示例店铺
];

const allAreas = ["天河区", "越秀区", "海珠区", "荔湾区", "白云区", "番禺区"];

const allTags = [
  "精品手冲", "意式好评", "创意特调", "日式深烘", "自烘焙",
  "环境好评", "工业风", "日式简约", "复古怀旧", "独栋老宅", "社区小店",
  "安静办公", "朋友聚会", "一人独享", "约会首选", "拍照打卡", "宠物友好"
];
```

**验证:** 浏览器 console 可访问 `coffeeShops` 数组

---

### Phase 2: 核心交互（Task 4-6）

#### Task 4: 筛选与渲染逻辑

**Objective:** 实现区域筛选、标签筛选、搜索、列表渲染

**Files:**
- Modify: `js/main.js`

**功能:**
1. **renderAreasList()** — 渲染区域筛选标签
2. **renderCategoriesList()** — 渲染标签筛选
3. **renderShopCards()** — 渲染店铺卡片网格
4. **filterShops()** — 根据当前筛选条件过滤
5. **searchInput** — 实时搜索（店名/地址/标签）
6. **updateResultCount()** — 更新结果计数
7. **URL 参数同步** — 筛选状态可分享

**筛选逻辑:**
- 点击区域标签 → toggle 激活状态 → 重新渲染
- 点击风格标签 → toggle 激活状态 → 重新渲染
- 输入搜索词 → 实时过滤
- 多条件取交集

**验证:** 筛选组合都能正确过滤，结果计数准确

---

#### Task 5: 精选推荐 + 咖啡杯进度条

**Objective:** 实现横向滚动精选区和手绘咖啡杯进度指示器

**Files:**
- Modify: `js/main.js`
- Modify: `css/style.css`

**精选卡片:**
- 横向滚动容器
- 仅显示 `featured: true` 的店铺
- 卡片包含：店名、区域、评分、标签

**咖啡杯进度条 SVG:**
- 手绘风格咖啡杯（Garry's 同款）
- 滚动精选区域时液面上升
- 显示 "1 / N" 页码
- 液面到达顶部时显示蒸汽动画

**SVG 咖啡杯结构:**
```html
<svg class="pour-cup" viewBox="0 0 64 80">
  <!-- 杯身 - 手绘线条 -->
  <!-- 杯口 - 粗线条 -->
  <!-- 杯柄 -->
  <!-- 咖啡液面（clipPath 裁剪） -->
  <!-- 蒸汽线 -->
  <!-- 小表情（两点一眼） -->
</svg>
```

**验证:** 横向滚动时咖啡杯液面平滑上升，到达顶部时蒸汽出现

---

#### Task 6: "Why I pick" 气泡弹窗

**Objective:** 点击精选店铺弹出推荐理由

**Files:**
- Modify: `js/main.js`
- Modify: `css/style.css`

**交互:**
- 点击精选卡片 → 计算位置 → 弹出气泡
- 气泡包含：三点连线动画 + "Why I pick" 标签 + 推荐文字
- 点击其他区域关闭气泡

**HTML 结构:**
```html
<div class="thought-bubble-portal" id="thoughtPortal">
  <div class="thought-dot thought-dot-1"></div>
  <div class="thought-dot thought-dot-2"></div>
  <div class="thought-dot thought-dot-3"></div>
  <div class="thought-cloud">
    <span class="thought-label">Why I pick</span>
    <p class="thought-text" id="thoughtText"></p>
  </div>
</div>
```

**验证:** 点击精选卡片弹出气泡，推荐文字正确显示

---

### Phase 3: 完善与优化（Task 7-9）

#### Task 7: Hero 区域动画

**Objective:** 实现 Hero 区域的入场动画

**Files:**
- Modify: `css/style.css`
- Modify: `js/main.js`

**动画:**
1. 城市名 "Guangzhou" — letter-spacing 从宽到窄 + fadeIn
2. 大标题 "广州咖啡指南" — 每个词 staggered slideUp
3. 副标题 — fadeIn + slideUp（延迟 1s）
4. 统计数字 — fadeIn + slideUp（延迟 1.2s）
5. 插画 — bounceIn + 持续 float
6. 装饰点 — 柔和脉冲

**统计数字动态计算:**
```javascript
document.getElementById('shopCount').textContent = coffeeShops.length;
document.getElementById('areaCount').textContent = allAreas.length;
// 平均评分
const avgRating = (coffeeShops.reduce((sum, s) => sum + s.rating, 0) / coffeeShops.length).toFixed(1);
```

**验证:** 页面加载时各元素依次入场，动画流畅

---

#### Task 8: 移动端适配

**Objective:** 确保手机端体验优秀

**Files:**
- Modify: `css/style.css`

**适配点:**
- Hero：垂直布局，插画缩小
- Toolbar：搜索框全宽
- 筛选条：横向可滚动
- 卡片：单列布局
- 精选：卡片尺寸缩小
- 气泡：居中显示

**验证:** Chrome DevTools 模拟 375px 宽度，所有功能正常

---

#### Task 9: 店铺详情卡片

**Objective:** 点击店铺卡片显示详细信息

**Files:**
- Modify: `js/main.js`
- Modify: `css/style.css`

**交互:**
- 点击店铺卡片 → 弹出详情面板（modal 或 slide-over）
- 包含：店名、地址、评分、推荐语、标签、营业时间、地铁、设施
- 点击遮罩或关闭按钮关闭

**验证:** 每家店的详情信息正确显示，缺失字段优雅降级

---

### Phase 4: 部署（Task 10）

#### Task 10: 部署上线

**Objective:** 部署到 Vercel / Cloudflare Pages / GitHub Pages

**步骤:**
1. 初始化 git 仓库
2. 推送到 GitHub
3. 连接 Vercel 或 Cloudflare Pages
4. 配置自定义域名（可选）

**验证:** 线上可访问，所有功能正常

---

## 首批咖啡店建议（待你填充）

> 以下为广州常见知名咖啡店示例，你可以替换为你实际去过的店：

1. **JPG Coffee** — 天河区·体育西 — 精品手冲标杆
2. **急急脚咖啡公司** — 越秀区·东山口 — 独栋老宅创意特调
3. **来回咖啡** — 天河区·天河南 — 社区精品小店
4. **郁源咖啡** — 越秀区·东山口 — 自烘焙老店
5. **四序咖啡** — 海珠区·晓港 — 日式深烘
6. **无牌咖啡** — 荔湾区·永庆坊 — 西关风情
7. **玫瑰咖啡** — 越秀区·淘金 — 社区老店
8. **Seed Down** — 天河区·体育西 — 精品自烘

---

## 快速启动

```bash
# 1. 进入项目目录
cd "E:\coffee map"

# 2. 创建目录结构
mkdir -p css js images/shops

# 3. 启动本地服务器
# 方式一：Python
python -m http.server 8000

# 方式二：Node.js
npx serve .

# 4. 浏览器打开
# http://localhost:8000
```

---

## 后续扩展（可选）

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 🗺️ 地图视图 | P2 | 接入高德/腾讯地图，标记店铺位置 |
| 🌙 暗色模式 | P2 | 跟随系统 / 手动切换 |
| 💾 收藏功能 | P2 | localStorage 存储用户收藏 |
| 📸 用户投稿 | P3 | 接收读者推荐新店 |
| 🔔 更新推送 | P3 | 新店收录通知（RSS） |

---

*Plan updated: 2026-06-01 · 广州咖啡指南 v2.0 — 参考 Garry's Coffee Map 重构*
