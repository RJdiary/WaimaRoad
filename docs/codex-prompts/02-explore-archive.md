# 阶段 2：探索页与史料页

> 执行者只读：本文件 + `docs/codex-prompts/00-baseline.md`。不搜索、不参考旧代码与其他阶段文件。先用一句中文复述「本阶段要做什么」，再写代码；路径、色值、分类 key、文案、字段均已给定，照抄，不改名、不换值。
## 1. 目标
1. 把 `pages/explore/*` 从空壳实现为探索首页：老地图拼贴头部、两列竖排书法、地图卡（marker + POI 卡）、搜索入口、2×2 入口卡、定位说明与拒绝提示条、下拉刷新与分享。
2. 把 `pages/archive/*` 从空壳实现为史料页：书法标题、分类胶囊、陶土卡片列表、骨架屏/空状态/加载失败/上拉加载/下拉刷新、跳详情与跳搜索。
3. 新落地两个公共组件 `site-card`、`filter-chips`（各 4 文件），后续阶段只复用、不重写。
4. 新建 `mock/sites.js`（4 个分类 + 12 条点位），并在 `utils/api.js` 追加 `getSites`、`getSite`；页面只调 api，不直接 require mock。
5. 打通「探索页入口卡 → 专题 / AI 复原 / 走街」「史料页卡片 → 详情」「史料页 → 搜索」的跳转参数链路；本阶段不实现目标页，登录拦截留给阶段 03。
6. 覆盖列表页四态：骨架（3 张卡）、空状态、加载失败重试、上拉加载更多；探索页地图加载态不白屏。

## 2. 前置状态
- 阶段 01 已完成：`miniprogram/app.json` 已注册 20 条路由与 4 项自定义 TabBar，`app.wxss` 有 18 个 Token、`--fs` 字体类与通用类，`app.js` 提供 `globalData` 与 `getPageStyle()`。
- `pages/explore/index.*`、`pages/archive/index.*` 为空壳：`Page({});`，页面 json 已为 `navigationStyle: custom` 且含 `enablePullDownRefresh: true`。
- 已有基础组件 `nav-bar`、`tab-icon`、`section-title`、`empty-state`、`skeleton`；`site-card`、`filter-chips` 尚不存在。
- `utils/api.js` 已导出 `USE_MOCK/ok/fail/mock/request`，`USE_MOCK = true`，尚未 require `mock/`；`utils/format.js` 有 `formatCount/formatDistance`；`utils/location.js` 有 `requestLocation/getDistance/openSetting`；`utils/storage.js` 的 `KEYS` 含 `byxz_locationTip`；`utils/auth.js` 的 `goLogin(redirect)` 可用。
- `mock/` 目录不存在；`assets/markers/` 已有目录但无 PNG（阶段 01 约定本阶段生成 4 张）；`assets/illustrations/header-map.png`、`book.png` 不存在。
- 详情、专题、AI 复原、走街、搜索页均为阶段 01 的空壳，本阶段只做跳转、不实现内容；探索页与史料页**不需要登录**，游客可完整浏览。
- 无任何位图素材：拼贴、封面、入口卡、书与羽毛笔全部用 CSS 渐变/线性占位，不引用外链，不新增 npm 包。

## 3. 需创建的文件清单

| # | 路径 | 职责 | 完成度 |
| --- | --- | --- | --- |
| 1 | `miniprogram/pages/explore/index.js` | 地图 marker、POI 卡、定位、入口卡、搜索、收起、分享 | 完整实现 |
| 2 | `miniprogram/pages/explore/index.wxml` | 拼贴头部 + 地图卡 + 3 圆钮 + POI 卡 + 2×2 入口卡 | 完整实现 |
| 3 | `miniprogram/pages/explore/index.wxss` | 440rpx 头部、620×380 拼贴、竖排书法、540rpx 地图卡、315×220 入口卡 | 完整实现 |
| 4 | `miniprogram/pages/explore/index.json` | `navigationStyle: custom`、标题「探索」、下拉刷新 | 修改 |
| 5 | `miniprogram/pages/archive/index.js` | 分类筛选、分页、四态、刷新、跳详情/搜索 | 完整实现 |
| 6 | `miniprogram/pages/archive/index.wxml` | 头部 + 胶囊 + 搜索钮 + 陶土卡列表 + 骨架/空/失败/底部 | 完整实现 |
| 7 | `miniprogram/pages/archive/index.wxss` | 300rpx 头部、64rpx 书法标题、卡片间距 32rpx、底部 160rpx | 完整实现 |
| 8 | `miniprogram/pages/archive/index.json` | 标题「史料」+ 注册 4 个组件 | 修改 |
| 9 | `miniprogram/components/site-card/index.{js,json,wxml,wxss}` | 陶土/浅杏两态史料卡、数字格式化、事件 | 新建 4 文件 |
| 10 | `miniprogram/components/filter-chips/index.{js,json,wxml,wxss}` | 横向胶囊、受控选中、可吸顶 | 新建 4 文件 |
| 11 | `miniprogram/mock/sites.js` | `categories`（4 项）+ `sites`（12 条 Site） | 新建 |
| 12 | `miniprogram/utils/api.js` | 追加 `getSites({category,keyword,page,pageSize})`、`getSite(id)` | 追加 |
| 13 | `miniprogram/assets/markers/{kaibu,qiaoxiang,wenjiao,hongse}.png` | 4 张 112×144 占位 marker | 占位 |
| 14 | `miniprogram/assets/illustrations/`、`assets/images/sites/` | 本阶段不新增真实图，仅保留目录与 `.gitkeep` | 占位 |

- 除上表与 `app.js` 只读引用外，不得改动阶段 01 的 `app.json`、`app.wxss`、`custom-tab-bar/`、基础组件与 `utils/` 其他文件。
- `site-card`、`filter-chips` 的 `index.json` 均为 `{ "component": true }`，不引入其他组件。

## 4. 详细要求

### 4.1 页面 json 与根节点
```json
// pages/explore/index.json
{ "navigationStyle": "custom", "navigationBarTitleText": "探索", "enablePullDownRefresh": true }

// pages/archive/index.json
{
  "navigationStyle": "custom", "navigationBarTitleText": "史料", "enablePullDownRefresh": true,
  "usingComponents": {
    "filter-chips": "../../components/filter-chips/index",
    "site-card": "../../components/site-card/index",
    "empty-state": "../../components/empty-state/index",
    "skeleton": "../../components/skeleton/index"
  }
}
```
1. 两页均在根节点注入 `style="{{pageStyle}};padding-top:{{statusBarHeight}}px"`；`pageStyle` 由 `getApp().getPageStyle()` 取得，状态栏高度读 `globalData.statusBarHeight`，不写死；`onShow` 重新计算 `pageStyle`，保证字体设置返回后立即生效。
2. 根节点类名 `page page--tab`；探索页与史料页都不使用 `nav-bar`（设计稿头部自带状态栏留白与书法标题）。
3. 两页 `onShow` 同步 TabBar：探索 `selected: 0`、史料 `selected: 1`，按 `typeof this.getTabBar === 'function' && this.getTabBar()` 判断后再 `setData`。
4. 两页 `onShareAppMessage` 均返回 `{ title: '埠影寻踪｜在汕头老城，边走边读百年', path: '/pages/explore/index' }`。

### 4.2 探索页头部与地图
**(1) 头部拼贴区（高 440rpx，`position: relative; overflow: hidden;`）**
- 右侧拼贴：`width: 620rpx; height: 380rpx; top: 30rpx; right: -24rpx; opacity: .95;` 纯 CSS 实现：8 条竖向地图块（`repeating-linear-gradient` 叠加 `#E7D3B4 / #DCC3A2 / #CBB18C` 三段暖褐渐变 + `rgba(120,90,60,.12)` 细线），叠一条 2rpx `#C0392B` 细红线时间轴（距顶 46%），再叠 4 个 96×72rpx 黑白小照片块；边缘用 `mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%)` 米色羽化。
- 左侧两列竖排书法：右列「埠藏史库」、左列「街绘行图」；`writing-mode: vertical-rl; font-size: 56rpx; line-height: 1.15; letter-spacing: 2rpx; gap: 8rpx; left: 48rpx; top: 96rpx;` 颜色用 `.text-calligraphy` 的陶土渐变；两列均为文案元素，**不是页面标题**。
- 无拼贴图时不得留空：上述 CSS 即正式占位，后续替换 `header-map.png` 只换背景层，不改布局尺寸。
**(2) 收起形态（滚动简化版）**
- 页面 `onPageScroll` 记录 `scrollTop`：`< 60px` 为展开（头部 440rpx），`>= 80px` 为收起（头部 200rpx，拼贴 `translateY(-120rpx) scale(.8)`、`opacity: .7`，书法 `scale(.8)`，`transform-origin: top left`）；两次阈值分开，避免抖动；过渡 `240ms cubic-bezier(.2,.8,.2,1)`。
- 收起后搜索按钮固定到页面右上：`top: {{statusBarHeight + 8}}px; right: 24rpx;` 展开时按钮回到地图内 `top: 24rpx; right: 24rpx`；两态只渲染一个按钮，`searchFixed` 由 `scrollTop >= 80px` 决定。
**(3) 地图卡**
- 容器：`margin: -40rpx 48rpx 0; height: 540rpx; border-radius: 24rpx; border: 4rpx solid #F5D9A8; overflow: hidden; background: var(--tan);`
- `<map id="exploreMap" latitude="{{mapCenter.latitude}}" longitude="{{mapCenter.longitude}}" scale="16" markers="{{markers}}" controls="{{controls}}" show-location enable-3D="{{false}}" show-scale="{{false}}" enable-scroll enable-zoom bindmarkertap="onMarkerTap" bindtap="onMapTap" style="width:100%;height:100%;">`；`controls` 初始为 `[]`，3 个圆钮由 CSS 覆盖层实现，后续需要原生控件再填。
- 默认中心 `{ latitude: 23.3546, longitude: 116.6819 }`；不设置 `include-points`，不做折线；WebView 渲染，不开启 Skyline。
- marker：按分类取 `assets/markers/{category}.png`，`width: 28; height: 36`（即 56×72rpx，按 2 倍图 112×144）；`id` 用 `index + 1`（必须为数字），页面内维护 `markerMap`（markerId → site）；`callout` 为 `{ content: 点位名, color: '#333333', fontSize: 11, borderRadius: 4, bgColor: '#FFFFFF', padding: 4, display: 'ALWAYS' }`。
- 选中态：重新 `setData` 仅 marker 数组，被选 marker `width: 34; height: 43; zIndex: 2`（1.2 倍），其余复原为 28×36；选中后滑出 POI 卡，再点同一 marker 或地图空白收起。
- 地图右侧中部 3 个 64rpx 白色半透明圆按钮（`rgba(255,255,255,.85)`、`1rpx solid #F5D9A8`、间距 16rpx）：定位「◎」→ 已授权则 `mapCtx.moveToLocation()`，未授权则走 4.3 的授权流程；图层「▤」→ `wx.showToast({ title: '路线与足迹图层即将开放', icon: 'none' })`（本阶段只显示史料点）；全屏「⛶」→ `mapFullscreen: true`，地图容器改为 `position: fixed; inset: 0; z-index: 50; border-radius: 0`，右上出现「退出全屏」文字钮。
- 搜索按钮：72rpx 圆形，`background: rgba(255,255,255,.85)`，`1rpx solid var(--amber)`，正中 36rpx 琥珀放大镜（CSS 圆环 + 斜线，不用图标库）；点击 `wx.navigateTo({ url: '/subpackages/user/pages/search/index?from=explore' })`。
- 地图加载态：数据未就绪时覆盖米色层 `var(--bg-warm)` + 文案「正在展开老地图…」，24rpx `var(--ink-3)`，数据到位后移除，不出现白屏。
**(4) POI 卡**
- 尺寸与层级：`position: fixed; left: 40rpx; bottom: calc(112rpx + env(safe-area-inset-bottom) + 24rpx); width: 670rpx; height: 260rpx; background: var(--white); border-radius: 24rpx; box-shadow: var(--shadow-float); z-index: 20;` 出现动画 `fade-up 220ms`。
- 左侧 160rpx 缩略图（`aspectFill`，`cover` 为空时 `.media-placeholder` + 点位名）；右侧标题 32rpx/600 `var(--ink)` 单行、分类标签（`--tag` 底 + `#4A2B1E` 字 22rpx）、距离文案；底部三个 88rpx 高文字按钮「详情 / 打卡 / 收藏」。
- 距离：已定位用 `format.formatDistance(location.getDistance(用户位置, site.location))`，未定位显示「定位后显示距离」。
- 点击：详情 → `/subpackages/detail/pages/site-detail/index?siteId=<id>`；打卡 → 同页加 `&action=checkin`；收藏 → 加 `&action=favorite`。本阶段不判断登录、不改收藏数，登录拦截与乐观更新由阶段 03 处理。
- 点击地图空白收起；若 `bindtap` 紧跟在 `bindmarkertap` 的 100ms 内则忽略，避免刚选中即关闭。

### 4.3 探索页定位与其余交互
1. 首次进入若 `storage.get(storage.KEYS.locationTip)` 为空：显示半屏说明（底部抽屉，`--apricot` 底，顶部圆角 `--radius-sheet`，标题「为什么要用你的位置」28rpx/600，正文「只为展示附近史迹与到点打卡，不会在后台持续定位。」24rpx，按钮「允许定位」胶囊 + 文字钮「先逛逛」）；关闭即 `storage.set(storage.KEYS.locationTip, 'shown')`。
2. 「允许定位」→ `location.requestLocation()`：成功则 `mapCtx.moveToLocation()` 并把每个点位 `distance` 计算后写入 marker 对应数据（POI 卡用真实距离），**不排序、不改入口卡**；失败不阻塞页面，转为第 3 条。
3. 拒绝或失败：地图保持小公园默认中心，头部下方出现 64rpx 高浅杏提示条（`--apricot`、24rpx `#4A3B33`）：「开启定位，发现身边的史迹」+ 右侧「去开启」文字钮 → `location.openSetting()` 后重新尝试定位。
4. 下拉刷新：重新 `api.getSites({ page: 1, pageSize: 12 })`，重建 markers、关闭 POI 卡、保持当前定位，完成后 `wx.stopPullDownRefresh()`。
5. 入口卡（`margin: 40rpx 48rpx`，`display: grid; grid-template-columns: repeat(2, 1fr); gap: 24rpx;`）：卡片 `height: 220rpx; border-radius: 20rpx; overflow: hidden; position: relative;`，卡内 `swiper` 3 张图、`autoplay interval="4000" circular`、`bindchange` 同步 3 个 6rpx 白点（距右上 20rpx）的当前态；底部渐变 `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.72) 100%)`；标题 34rpx/700 白、副标题 24rpx `rgba(255,255,255,.9)` 最多两行；图用 3 段暖褐渐变占位（不新增图片）。
6. 埋点：本阶段不接入任何统计 SDK、不写上报字段，曝光/点击口径由阶段 05 统一收口。

| 序 | 标题 | 副标题（逐字） | 点击 |
| --- | --- | --- | --- |
| 1 | 开埠外交 | 从海关与洋行读懂开埠 | `/subpackages/detail/pages/topic/index?theme=kaibu` |
| 2 | 红色革命 | 追寻东征与抗战记忆 | `/subpackages/detail/pages/topic/index?theme=hongse` |
| 3 | AI复原影像 | 看到已消失的点位 | `/subpackages/detail/pages/ai-restore/index?siteId=site_001` |
| 4 | Citywalk路线 | 边走边读老城 | `wx.switchTab({ url: '/pages/walk/index' })` |

### 4.4 史料页结构
1. 头部 300rpx：`position: relative;` 书法标题「埠藏史库」64rpx 陶土渐变、`letter-spacing: 4rpx`、`left: 48rpx; top: 96rpx;`；副标题「外马路·现存与消失的人文空间」28rpx `#555`、距标题 16rpx；右侧线描「翻开的书 + 羽毛笔」200×180rpx、`right: 40rpx; top: 64rpx;`、笔画色 `#6B4A3A`、`opacity: .85`（CSS 描边占位，不使用 `book.png`）。
2. 分类胶囊行：`padding: 0 48rpx;` 使用 `filter-chips`，选项 5 项「全部 / 开埠外交 / 侨乡商贸 / 文教宗教 / 红色革命」，key 依次 `all / kaibu / qiaoxiang / wenjiao / hongse`，默认 `all`；行右侧固定一个 72rpx 琥珀描边圆钮（放大镜）跳 `/subpackages/user/pages/search/index?from=archive`，滚动区右侧留出按钮宽度，避免内容被压住。
3. 列表区：`padding: 32rpx 48rpx calc(160rpx + env(safe-area-inset-bottom));` 卡片间距 32rpx（`margin-bottom: 32rpx`），逐条使用 `<site-card variant="terracotta" site="{{item}}" bind:select="onCardSelect" />`。
4. 状态区：`loading && list.length === 0` → `<skeleton type="list" count="3" />`；`!loading && !error && list.length === 0` → `<empty-state title="这个分类还没有史料" desc="换个分类，或看看全部" action-text="看看全部" bind:action="onShowAll" />`；`error` → 居中块，文案「加载失败，请稍后重试」+ 88rpx 胶囊钮「重试」；列表底部：`hasMore` 时「正在加载更多…」，否则「已经到底啦」。
5. 交互：切换分类立即清空列表、显示骨架并 `wx.pageScrollTo({ scrollTop: 0, duration: 200 })`；`onReachBottom` 仅在 `hasMore && !loading` 时加载下一页；`onPullDownRefresh` 重新拉第 1 页后 `stopPullDownRefresh`；点击卡片 `navigateTo` 详情并带 `id`；长按菜单本阶段不实现。
6. 数据字段：页面只把 `id/name/cover/categoryName/summary/viewCount/favoriteCount` 交给卡片，分页 `pageSize: 10`，接口返回 `{ list, total, hasMore }`。

### 4.5 `site-card` 组件
- props：`site`（Object，默认 `{}`）、`variant`（String，`terracotta` / `plain`，默认 `terracotta`）、`showFavorite`（Boolean，默认 false）、`favorited`（Boolean，默认 false）。
- 事件：整卡 `select` → `triggerEvent('select', { id: site.id })`（**不用 `tap` 作事件名**，避免与原生冒泡 tap 重复触发）；收藏 → `triggerEvent('favorite', { id: site.id, favorited: !this.properties.favorited })`；卡片右上角**默认不显示**收藏按钮（设计稿要求收藏在详情页完成），`showFavorite` 仅阶段 04 收藏页使用。
- 结构照 7.4：封面 100% 宽、390rpx 高、`mode="aspectFill"`、`lazy-load`，`cover` 为空时 `.media-placeholder` 渐变 + 居中点位名（34rpx 白色，不出现「图片待替换」）；左上角标 `--tag` 底、22rpx `#4A2B1E`、圆角 8rpx、内边距 `6rpx 16rpx`、距边 20rpx；内容区 `padding: 28rpx 28rpx 0`，标题 34rpx/600 `#2A2A2A` 单行省略，描述 24rpx `#4A3A33`、行高 1.65、两行省略；分割线 1rpx `rgba(255,255,255,.35)`、上边距 24rpx；底部行 96rpx，左「眼睛 2.6k」+「星标 2.1k」（间距 40rpx、图标 28rpx、文字 24rpx `#3B2B25`），右 32rpx 箭头 `#3B2B25`。
- 数字统一 `require('../../utils/format').formatCount`，在 `observers.site` 中预算 `viewText/favoriteText`，不在 WXML 里拼字符串。
- `plain` 变体：背景 `var(--apricot)`、标题 `var(--ink)`、描述 `var(--ink-2)`、分割线 `var(--line)`、底部文字 `var(--ink-2)`，其余尺寸不变；`terracotta` 背景 `#D98C75`、圆角 24rpx、阴影 `0 8rpx 24rpx rgba(120,90,60,.10)`、无描边。
- 整卡点击区不小于 88rpx，`hover-class="none"`，按压由页面或组件 `scale(.98)` 统一处理；组件左右外边距不写死，由父容器控制宽度（654rpx）。

### 4.6 `filter-chips` 组件
- props：`options`（Array<{key,name}>）、`selected`（String）、`sticky`（Boolean，默认 false）。
- 事件：点击某一项 `triggerEvent('change', { key })`；组件内部不修改 `selected`，由页面回传。
- 样式：`scroll-view scroll-x` 不显示滚动条、`white-space: nowrap`；胶囊可视高度 64rpx、圆角 32rpx、内边距 `0 32rpx`、文字 26rpx `#222`、背景 `var(--chip)`、间距 20rpx；选中 `#333` 底 + 白字；首个胶囊贴左（容器左内边距 48rpx、末尾 48rpx）；未选中项允许 `opacity: .95`，不做阴影。
- 点击热区：胶囊外包一层上下 `12rpx` 的点击区，使总高 ≥ 88rpx；`sticky` 为 true 时容器 `position: sticky; top: 0; z-index: 10; background: var(--bg);`（本阶段史料页不启用吸顶，字段留给后续）。

### 4.7 `mock/sites.js`
- 导出 `{ categories, sites }`：`categories` 为 4 项 `{ key, name }`（`kaibu` 开埠外交、`qiaoxiang` 侨乡商贸、`wenjiao` 文教宗教、`hongse` 红色革命）；`sites` 为 12 条，字段严格按基线 §7.1（`id/name/alias/category/categoryName/cover/images/summary/description/address/location/era/structure/originalUse/currentStatus/openTime/viewCount/favoriteCount/checkinCount/oldPhotos/aiRestored/audio/tags`）。
- 本阶段只保证卡片字段真实可用：`id`、`name`、`category`、`categoryName`、`summary`、`address`、`location`、`viewCount`、`favoriteCount`、`checkinCount`；`cover` 一律空字符串 `''`、`images` 与 `oldPhotos` 为 `[]`、`tags` 为 `[]`、`description` 为 `''`、`aiRestored` 为 `''`、`audio` 为 `{ url: '', duration: 0 }`；`era/structure/originalUse/currentStatus/openTime` 除 `site_001` 外留空字符串，阶段 03/05 补全，不臆造史实。
- `site_001` 逐字照 9.1：`alias: '汕头海关关史陈列馆'`、`summary: '汕头开埠的重要见证，现为汕头海关关史陈列馆所在地。'`、`address: '汕头市金平区外马路 2 号'`、`location: { lat: 23.3520, lng: 116.6785 }`、`era: '1921 年'`、`structure: '钢筋混凝土'`、`originalUse: '海关办公'`、`currentStatus: '现存'`、`openTime: '周二至周日 09:00—17:00'`、`tags: ['海关','开埠','洋行']`、`viewCount: 2600`、`favoriteCount: 2100`、`checkinCount: 860`。
- 其余 11 条 `address` 逐字用 9.4 清单（如「外马路 25 号」）；12 条完整数据见第 5 节表，坐标均为示意值、待腾讯地图拾取器校准，不得引入清单外的点位或济南地名。

### 4.8 `utils/api.js` 追加接口
```js
const { sites } = require('../mock/sites');
const PAGE_SIZE = 10;

// GET /sites?category=&keyword=&page=&pageSize=
function getSites({ category = 'all', keyword = '', page = 1, pageSize = PAGE_SIZE } = {}) {
  return mock(() => {
    let list = sites.slice();
    if (category && category !== 'all') list = list.filter(s => s.category === category);
    const kw = String(keyword || '').trim();
    if (kw) list = list.filter(s => (s.name + s.alias + s.summary).indexOf(kw) > -1);
    const total = list.length;
    const start = (page - 1) * pageSize;
    return { list: list.slice(start, start + pageSize), total, hasMore: start + pageSize < total };
  });
}

// GET /sites/:id
function getSite(id) {
  return mock(() => sites.find(s => s.id === id) || null);
}
module.exports = { USE_MOCK, ok, fail, mock, request, getSites, getSite };
```
- 保留阶段 01 的 `USE_MOCK/ok/fail/mock/request` 行为不变；`USE_MOCK === false` 时改走 `request` 拼 `/sites`，本阶段可不实现，但不得删除分支。
- 页面调用统一 `api.getSites(...).then(res => { if (res.code !== 0) { wx.showToast({ title: res.msg, icon: 'none' }); return; } ... })`，不得直接 `require('../../mock/sites')`。

### 4.9 `assets/markers/` 占位
- 用一次性脚本（PowerShell 或 Node 生成 Base64，不新增依赖、不提交脚本）生成 4 张 112×144 PNG，纯色分别为 `#D98C75`（kaibu）、`#F0AD45`（qiaoxiang）、`#00BAAD`（wenjiao）、`#B65A44`（hongse）；正式手绘 pin 由设计替换，文件名不变。
- `header-map.png`、`book.png`、12 张点位封面、入口卡 3 张图：本阶段一律不新增文件，按 4.2/4.4/4.5 的 CSS 占位；不得引用外链或 `assets` 里不存在的路径。
- 不得把 4 个 marker 的色值改到 `app.wxss` 之外的新 Token，也不得为 marker 新增分类 key。

## 5. 数据与文案

**分类枚举（全阶段固定）**

| key | 中文名 | marker 色 |
| --- | --- | --- |
| `kaibu` | 开埠外交 | `#D98C75` |
| `qiaoxiang` | 侨乡商贸 | `#F0AD45` |
| `wenjiao` | 文教宗教 | `#00BAAD` |
| `hongse` | 红色革命 | `#B65A44` |

**12 条点位（`mock/sites.js`，坐标为示意值）**

| id | 名称 | 分类 | 地址 | 坐标 | 浏览 / 收藏 / 打卡 | 一句话 summary |
| --- | --- | --- | --- | --- | --- | --- |
| `site_001` | 潮海关旧址 | kaibu | 汕头市金平区外马路 2 号 | 23.3520, 116.6785 | 2600 / 2100 / 860 | 汕头开埠的重要见证，现为汕头海关关史陈列馆所在地。 |
| `site_002` | 汕头开埠邮局陈列馆 | kaibu | 外马路 25 号 | 23.3531, 116.6792 | 1800 / 1200 / 430 | 老邮局里的侨批与邮路记忆。 |
| `site_003` | 汕头海关关史陈列馆 | kaibu | 外马路 20 号 | 23.3525, 116.6789 | 1500 / 900 / 380 | 海关旧档与关史陈列所在。 |
| `site_004` | 汕头开埠文化陈列馆 | kaibu | 永平路 1 号 | 23.3542, 116.6798 | 2300 / 1600 / 700 | 一馆读懂汕头开埠百年。 |
| `site_005` | 侨批文物馆 | qiaoxiang | 外马路 18 号 | 23.3535, 116.6804 | 2200 / 1700 / 650 | 一纸侨批，半部侨乡家书史。 |
| `site_006` | 永平酒楼 | qiaoxiang | 永平路 11 号 | 23.3540, 116.6807 | 1200 / 800 / 300 | 外马路旧商埠的百年酒楼。 |
| `site_007` | 老妈宫与戏台 | wenjiao | 升平路 6 号 | 23.3552, 116.6815 | 3000 / 2400 / 1100 | 香火与潮剧同台的街坊记忆。 |
| `site_008` | 存心善堂 | wenjiao | 外马路 87 号 | 23.3514, 116.6801 | 900 / 600 / 260 | 百年善堂，救济与慈善的见证。 |
| `site_009` | 中山纪念亭 | wenjiao | 小公园片区 | 23.3548, 116.6819 | 3400 / 2800 / 1500 | 小公园的心脏，老城的原点。 |
| `site_010` | 大埔会馆 | hongse | 民权路 95 号 | 23.3556, 116.6793 | 1100 / 700 / 320 | 东征军入汕时的革命据点。 |
| `site_011` | 东征军革命史迹陈列馆 | hongse | 外马路 207 号 | 23.3512, 116.6788 | 1000 / 650 / 300 | 东征岁月在汕头的史迹陈列。 |
| `site_012` | 桂园 | hongse | 公园路 23 号 | 23.3562, 116.6802 | 800 / 500 / 240 | 公园路旁的红色旧址与洋楼。 |

**界面文案（逐字）**

| 位置 | 文案 |
| --- | --- |
| 探索分享标题 | 埠影寻踪｜在汕头老城，边走边读百年 |
| 地图加载 | 正在展开老地图… |
| 定位说明标题 | 为什么要用你的位置 |
| 定位说明正文 | 只为展示附近史迹与到点打卡，不会在后台持续定位。 |
| 定位说明按钮 | 允许定位 / 先逛逛 |
| 定位拒绝提示条 | 开启定位，发现身边的史迹 · 去开启 |
| POI 卡未定位距离 | 定位后显示距离 |
| POI 卡按钮 | 详情 / 打卡 / 收藏 |
| 图层按钮提示 | 路线与足迹图层即将开放 |
| 全屏退出 | 退出全屏 |
| 史料页标题 | 埠藏史库 |
| 史料页副标题 | 外马路·现存与消失的人文空间 |
| 分类胶囊 | 全部 / 开埠外交 / 侨乡商贸 / 文教宗教 / 红色革命 |
| 空状态 | 这个分类还没有史料 · 换个分类，或看看全部 · 看看全部 |
| 加载失败 | 加载失败，请稍后重试 · 重试 |
| 加载更多 | 正在加载更多… / 已经到底啦 |

## 6. 验收标准
- [ ] 探索页头部高 440rpx，拼贴 620×380rpx、距顶 30rpx、右边距 -24rpx、透明度 .95；两列竖排书法 56rpx、左 48rpx、顶 96rpx、列距 8rpx、陶土渐变。
- [ ] 地图卡 `margin-top: -40rpx`、左右 48rpx、高 540rpx、圆角 24rpx、4rpx `#F5D9A8` 描边；`<map>` 中心 23.3546/116.6819、`scale=16`、`show-location`、`enable-3D=false`、无内置缩放/比例尺。
- [ ] marker 分 4 色、显示 28×36px（56×72rpx），点击放大 1.2 倍并滑出 POI 卡；点空白收起；POI 卡宽 670rpx、高 260rpx、距底 `112rpx + 安全区 + 24rpx`。
- [ ] 搜索按钮 72rpx 圆钮、`rgba(255,255,255,.85)`、1rpx 琥珀描边、36rpx 放大镜，滚动后吸顶右上，跳 `/subpackages/user/pages/search/index?from=explore`。
- [ ] 2×2 入口卡宽 315rpx、高 220rpx、间距 24rpx、圆角 20rpx，3 图 4s 轮播 + 3 个 6rpx 白点；4 组标题/副标题逐字与 4.3 表一致，跳转参数正确。
- [ ] 首次定位有半屏说明，允许后地图移到用户位置、POI 卡显示真实距离；拒绝后出现 64rpx 浅杏提示条与「去开启」，不阻塞页面。
- [ ] 下拉刷新可重建 marker 并关闭 POI 卡；滚动后头部收起 200rpx、搜索钮吸顶，过渡 240ms、无抖动。
- [ ] 探索页与史料页 `onShow` 正确同步 TabBar 高亮（0 / 1），`onShareAppMessage` 标题逐字一致。
- [ ] 史料页头部 300rpx、书法标题 64rpx/字距 4rpx/左 48rpx/顶 96rpx、副标题 28rpx `#555`、右侧插画 200×180rpx。
- [ ] 分类胶囊 5 项 key 正确、视觉高 64rpx/圆角 32rpx/`#CCCCCC`/文字 26rpx `#222`/选中 `#333` 白字、间距 20rpx，首个贴左。
- [ ] 陶土卡背景 `#D98C75`、封面 654×390rpx、角标 `#F7B878`/22rpx `#4A2B1E`、标题 34rpx/600、描述 24rpx 两行、分割线 1rpx `rgba(255,255,255,.35)`、底部行 96rpx 且数字 k 格式化。
- [ ] 史料页具备骨架 3 卡、空状态（含「看看全部」回到全部）、加载失败重试、上拉 10 条/页、「已经到底啦」、下拉刷新与切分类回顶。
- [ ] 点击史料卡进入 `subpackages/detail/pages/site-detail/index?siteId=site_xxx`，页面无「页面不存在」报错；点击卡内任意区域不出现收藏按钮。
- [ ] `mock/sites.js` 恰好 12 条、分类 4 项，id 连续且 `site_001` 文案、地址、坐标、浏览/收藏数逐字与 9.1 一致；其他点位无济南地名。
- [ ] 页面未直接 require `mock/`、未写死统计数字；`api.getSites` 返回 `{ list, total, hasMore }`，`api.getSiteDetail('site_001')` 可返回对象。
- [ ] 控制台无红色报错、无 Skyline/未定义组件提示；iOS 与安卓模拟器无横向溢出，TabBar 不遮挡列表底部。

## 7. 约束与禁止事项
### 7.1 硬约束
1. 只用微信原生语法（JS ES6 + WXML + WXSS）；禁止 Taro / uni-app / React / TypeScript / 构建工具，禁止 npm 与第三方 UI、图标、动画库。
2. 保持 WebView 渲染：不改 `app.json` 的 `style`，不添加 `renderer: "skyline"`、`rendererOptions` 或任何 Skyline 配置。
3. 色值只取 `app.wxss` 的 18 个 Token 与本文件已写死的值（`#F5D9A8`、`#C0392B`、`#D98C75`、`#F0AD45`、`#00BAAD`、`#B65A44`、`#6B4A3A`、`#555555`、`#2A2A2A`、`#4A3A33`、`#3B2B25`、`#4A2B1E`）；不得引入新主题色。
4. 分类 key 只用 `kaibu/qiaoxiang/wenjiao/hongse`；禁止 `diplomacy/commerce/culture/red/ai`、`building/religion/folk` 等旧枚举；「全部」用 `all` 仅存在于页面筛选层，不写入 Site。
5. 路径只用基线 §5 的 20 条；禁止 `pages/heritage*`、`pages/street*`、`pages/mine*`、`pages/index/index`、`pages/example/index`、`heritageDetail`、`aiCompare`。
6. 设计基准 750rpx；页边距 48rpx、卡片间距 24rpx（史料卡按设计稿 32rpx）、区块间距 40rpx、最小间距 8rpx；不新增字号/间距体系。
7. 产品名一律「埠影寻踪」；「埠藏史库」「街绘行图」只作 Slogan 与书法排版文案，不作小程序名、页面标题或分享标题。

### 7.2 常见错误（必须规避）

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 页面直接 `require('../../mock/sites')` | 绕过 api，阶段 05 无法切后端 | 只调 `api.getSites/getSiteDetail` |
| marker `id` 用字符串或 `site_001` 形式 | `e.detail.markerId` 匹配失败、点击无反应 | 用数字 `index + 1` 并维护 `markerMap` |
| 每次点击重建整页 map 或全量 `setData` | 地图闪烁、性能差 | 只 `setData({ markers })`，POI 卡单独字段 |
| 用 `navigateTo` 打开走街 Tab | 报「can not navigateTo a tabbar page」 | 入口卡 4 用 `wx.switchTab` |
| 空列表不显示空状态、直接白屏 | 分类无数据时体验断裂 | 按 4.4 渲染 empty-state |
| 收藏/打卡在列表或 POI 卡直接改数、请求登录 | 与阶段 03 规则冲突、未登录报错 | 只跳详情并带 `action`，拦截交给阶段 03 |
| 书法标题用普通字体或纯色 | 与设计稿调性不符 | 用 `.text-calligraphy` 陶土渐变 + `STKaiti` |
| 引用 `assets` 中不存在的封面/插画 | 裂图、控制台报错 | 用 `.media-placeholder` 或 CSS 描边占位 |
| 把分类胶囊写死 6 项或含 `ai` | 分类枚举错误、筛选失效 | 只用 5 项（all + 4 类） |

### 7.3 禁止事项
1. 禁止修改 `appid`、`libVersion`、`projectname`、`project.private.config.json`；禁止改动 `docs/`、`README.md`、`uploadCloudFunction.sh`。
2. 禁止改动阶段 01 的 `app.json` 路由、TabBar、`app.wxss` Token、`custom-tab-bar/` 与 5 个基础组件；本阶段只允许新增/改写第 3 节清单内文件。
3. 禁止引入真实底图或 `map` 之外的手绘地图组件；不得用 `<canvas>` 重画地图，不得请求后台持续定位。
4. 禁止在本阶段实现登录、收藏、打卡、详情、专题、AI 复原、走街、搜索页内容；这些属于阶段 03/04。
5. 禁止引用外链图片、网络字体、Lottie；禁止新增位图素材（4 张 marker 占位除外）。
6. 禁止旧命名与模板遗留：`heritage`、`street`、`mine`、`quickstart`、`goods`、`examples`、`business`、`usercenter`、`cloudTipModal`、`install_tip`。
7. 禁止济南地名（济南老火车站、解放阁、洪家楼天主教堂、泉城路等）；点位只取第 5 节 12 条。
8. 禁止把「埠影寻踪」写成「埠藏史库」；禁止出现「页面建设中」「敬请期待」等临时文案（图层按钮的既定提示除外）。
