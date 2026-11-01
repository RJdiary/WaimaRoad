# 阶段 3：史料详情、专题聚合、AI 复原影像、走街页与走街进行中

> 执行者只读：本文件 + `docs/codex-prompts/00-baseline.md`。先复述「本段要实现什么」再写代码；所有路径、字段、色值、尺寸、文案均已给定，不得改名或换值。地图页禁止开启 Skyline，浮层用 `cover-view` / `cover-image`；页面只调用 `utils/api.js`，不直接读写 `mock/`。上传文档未给出的补充文案（专题一句话、route_02—route_04 简介等）已在本文件定稿，不得再改词。

## 1. 目标

1. 创建 6 个页面：`site-detail`（史料详情）、`topic`（专题聚合）、`ai-restore`（AI 复原影像）、`walk`（走街 Tab）、`route-detail`（路线详情）、`walking`（走街进行中）。
2. 打通「史料详情 → 收藏/打卡/今昔对比/AI 复原/导航 → 相关推荐」「走街列表 → 路线详情 → 定位打卡 → 完成海报」两条闭环。
3. 落地 4 个公共组件：`compare-slider`、`checkin-sheet`、`map-poi-sheet`（与阶段 02 同名复用）、`route-card`。
4. 建立 `mock/routes.js`（4 条路线，字段按 9.2、点位 id 按 9.4），进度与已打卡集合实时联动。
5. 所有写操作走 `utils/api.js`，`USE_MOCK` 下写 `byxz_` 前缀 Storage；未登录的收藏、打卡、走街开始先存 `redirect` 再跳登录页。

## 2. 前置状态

- 阶段 01 已完成：`app.js` / `app.json`（20 条路由、自定义 TabBar）、`app.wxss`（18 个色彩 Token、字体/圆角/阴影）、`utils/api.js` 骨架与 `USE_MOCK`、`components/nav-bar`、`tab-icon`、`section-title`、`empty-state`、`skeleton`。
- 阶段 02 已完成：`pages/explore`、`pages/archive`、`mock/sites.js`（12 条，字段按 00-baseline 7.1）、`components/site-card`、`filter-chips`、`map-poi-sheet`；史料卡点击已带点位 id 参数。
- 可直接复用：`utils/format.js`（`2.6k` / `1.2w` 格式化）、`utils/location.js`（坐标距离计算）、`utils/storage.js`（`byxz_` key 集中管理）、`utils/auth.js`（登录态与 `redirect` 处理；若仅有骨架，只补 `requireLogin` 一个函数）。
- 尚未实现：登录/注册页（阶段 04）、用户中心二级页（阶段 04）、云函数与真实接口（阶段 05）；本阶段用 Mock，切接口只改 `USE_MOCK` 与 `request`。
- `mock/sites.js` 每条须有至少 1 张 `oldPhotos`、可用的 `aiRestored` 与 `currentStatus`（`现存` / `已消失`）；缺失时页面按第 4 节降级，阶段 05 补齐 6 条「已消失」点位。
- 图片一律本地 `assets/`；无素材用暖灰/陶土渐变底 + 居中白色建筑名 + 右下角「图片待替换」，`mode="aspectFill"`、`lazy-load`。

## 3. 需创建的文件清单

| 分组 | 文件 | 职责 |
| --- | --- | --- |
| 史料详情 | `subpackages/detail/pages/site-detail/index.{js,wxml,wxss,json}` | 图集、档案、今昔对比、打卡、收藏、推荐、底部操作栏 |
| 专题聚合 | `subpackages/detail/pages/topic/index.{js,wxml,wxss,json}` | 主题头图、筛选、复用史料卡列表、路线/AI 入口 |
| AI 复原 | `subpackages/detail/pages/ai-restore/index.{js,wxml,wxss,json}` | 说明卡、6 组旧照/复原卡、生成我的复原 |
| 走街页 | `pages/walk/index.{js,wxml,wxss,json}` | 路牌头部、总览进度、4 张路线卡、空状态 |
| 路线详情 | `subpackages/route/pages/route-detail/index.{js,wxml,wxss,json}` | 折线地图、序号 marker、可拉伸抽屉、时间轴、开始按钮 |
| 走街进行中 | `subpackages/route/pages/walking/index.{js,wxml,wxss,json}` | 全屏地图、定位跟随、到点打卡、完成海报 |
| 对比滑块 | `components/compare-slider/index.{js,wxml,wxss,json}` | 今昔两图拖动分割线，事件抛出百分比 |
| 打卡成就卡 | `components/checkin-sheet/index.{js,wxml,wxss,json}` | 遮罩 + 成就卡 + 纸屑 + 分享 |
| 地图点位卡 | `components/map-poi-sheet/index.{js,wxml,wxss,json}` | 点位底部卡（阶段 02 已建则只校准 props/事件） |
| 路线卡 | `components/route-card/index.{js,wxml,wxss,json}` | 序号、主题胶囊、数据行、进度、开始走街 |
| 路线数据 | `mock/routes.js` | 导出 `routes` 4 条，字段见 6.1 |

- 页面 json：全部 `"navigationStyle": "custom"`，标题分别「史料详情」「专题」「AI 复原影像」「走街」「路线详情」「走街进行中」。
- 分包组件路径：`subpackages/*` 下用 `../../../../components/<name>/index`；`pages/walk` 用 `../../components/<name>/index`。
- `site-detail` 注册 `nav-bar`、`compare-slider`、`checkin-sheet`；`topic` 注册 `nav-bar`、`site-card`、`filter-chips`、`empty-state`；`ai-restore` 注册 `nav-bar`、`compare-slider`、`empty-state`；`walk` 注册 `route-card`、`empty-state`、`skeleton`；`walking` 注册 `checkin-sheet`。
- 禁止创建旧路径 `pages/heritage*`、`pages/street*`、`pages/mine*`，禁止模板遗留页面与组件。

## 4. 各页面详细要求

### 4.1 `site-detail`（史料详情）

**数据**：`onLoad` 读 `options.siteId`；`site` 初值 `null`，先显示 `skeleton`（type=`detail`），`api.getSiteDetail(siteId)` 成功后 `setData`；失败整页「史料加载失败」+「重新加载」。进入页面上报 `POST /sites/:id/view`，同一设备同一天同一点位只报一次（`byxz_view_log` 为 `{ [siteId]: 'YYYY-MM-DD' }` 映射，命中即跳过）。`favorited` 由 `api.getMyFavorites` 结果判断。

**布局**
1. 顶部导航：返回圆钮 64rpx 半透明黑底 + 44rpx 白色箭头；右侧「分享」「收藏」同规格，浮在图上。
2. 图集：750×560rpx `swiper`，5 张图，底部圆点；右下角「1/5」计数胶囊（白底 80%，22rpx）。
3. 内容层：上压 48rpx、顶部圆角 48rpx、背景 `#FCF7EE`、内边距 48rpx。
   - 标题 44rpx / 700；标题下一行标签：分类名 + `era` + `currentStatus`。
   - 元信息行：地址单行省略 + 32rpx 箭头（点击 `wx.openLocation` 传经纬度与名称）；`openTime`；「距你 320m」（未定位时不显示距离）。
   - 导语：`description` 首段，28rpx、行高 1.8、首行缩进 2 字符。
   - 「建筑小档案」：浅杏 `#FFE8C7` 卡，2 列键值对：建造年代 / 结构 / 原用途 / 现状。
4. 今昔对照模块：标题「今昔对照」，副标「拖动分割线，看同一机位的一百年」；`compare-slider` 容器 654×420rpx、圆角 24rpx；底层今照（`images[0] || cover`），上层老照片（`oldPhotos[0].url`），缺失老照片时整块隐藏。
   - 右下角按钮「AI 复原」：点击后按钮内进度 0—100%、持续 2.5s，调 `POST /ai/restore { siteId }`；完成后 `compare-slider` 上层切为 `aiRestored`，并显示水印「AI 复原示意，非历史原貌」。
5. 打卡模块：浅杏卡；显示「距点位 320m」与「可打卡范围 200m」；按钮「到此打卡」。距离 > 200m 时按钮置灰并显示「距离点位 320m」；已打卡显示打卡时间与「已打卡」印章。
6. 相关推荐：标题 + 横向滚动 3 张 240×180rpx 小卡（同分类，排除自身），点击 `site-detail?siteId=`。
7. 底部固定操作栏：高 112rpx + 安全区，白底上阴影；左「收藏」（星标 + 文字）、中「打卡」（主蓝胶囊）、右「分享」（`button open-type="share"`）。

**交互**
- 收藏：乐观更新图标填充、收藏数 +1、`wx.vibrateShort({type:'light'})`；失败回滚并 Toast「收藏失败，请重试」。收藏数用 `formatCount`。
- 打卡：先 `wx.getLocation({type:'gcj02'})` 校验距离，≤ 200m 才允许；定位精度 > 100m Toast「信号较弱，请稍后重试」；成功后 `checkin-sheet` 显示「你已点亮 {siteName}」与累计打卡数；同一点位每天最多计 1 次，重复打卡 Toast「今天已经打过卡啦」但仍展示已有记录。
- 图片点击 `wx.previewImage` 全屏预览；分享标题「{siteName}｜埠影寻踪」，带当前封面。
- 未登录点收藏/打卡：存 `redirect`（含 `siteId`）后跳登录，成功后回本页并保留当前滚动位置。

### 4.2 `topic`（专题聚合）

- 入口：探索页「开埠外交」「红色革命」卡与史料页分类「更多」，参数 `theme`（`kaibu` / `qiaoxiang` / `wenjiao` / `hongse`）；未知或缺省时默认 `kaibu`。
- 头部：主题色渐隐头图（主题 Token 底 + `linear-gradient(180deg, rgba(252,247,238,0), #FCF7EE 90%)`），距顶 180rpx；主题名 44rpx / 700；一句话副标 28rpx `#555`；右侧「{n} 个点位」24rpx。
- 一句话固定：kaibu「从海关与洋行读懂开埠」、qiaoxiang「侨批与商号里的乡愁」、wenjiao「香火、书声与老城日常」、hongse「追寻东征与抗战记忆」。
- 筛选：两排 `filter-chips`。年代选项「全部」+ 由 `era` 年份去重生成的「1920年代 / 1930年代 / 1940年代」；状态选项固定「全部 / 现存 / 已消失」。两组取交集过滤，切换后回到列表顶部；空态「这个专题还没有史料」+「看看全部」。
- 列表：复用 `site-card variant="terracotta"`，按主题预筛选，每页 10 条，上拉加载显示「已经到底啦」，点击进 `site-detail?siteId=`。
- 底部两张入口卡：左「Citywalk路线」`wx.switchTab({url:'/pages/walk/index'})`；右「AI复原影像」`wx.navigateTo({url:'/subpackages/detail/pages/ai-restore/index'})`（不经过本页中转）。

### 4.3 `ai-restore`（AI 复原影像）

- 顶部说明卡（浅杏）：文案「用 AI 补全已消失的天际线，复原仅供想象，不作为史料依据。」
- 列表：取 `currentStatus === '已消失'` 的 6 个点位（阶段 05 mock 保证 6 条）。每项一张「旧照 / 复原」对比卡：左侧旧照、右侧 `aiRestored`，中间 2rpx 分割；下方名称 34rpx / 600、年代 24rpx、一句话 24rpx `#666`；右上角常驻「AI 生成」水印（22rpx，半透明白字）。
- 点击卡片进 `site-detail?siteId=`，自动定位到今昔对照模块。
- 「生成我的复原」按钮：弹出选图半屏，从 6 张老照片中选 1 张 → 模拟 3s 进度 0—100% → 结果卡用 `compare-slider`（`todaySrc` 为所选旧照、`oldSrc` 为生成图、初始 50）可拖动对比，并显示「保存」「分享」两个按钮；保存走 `wx.saveImageToPhotosAlbum`（失败引导设置），分享 `onShareAppMessage` 标题「我的 AI 复原影像｜埠影寻踪」。结果同样带「AI 生成」水印；不做人脸复原。
- 空态「暂无可复原点位」+ 重试；加载显示 3 张骨架卡。

### 4.4 `walk`（走街页）

**头部**（高约 320rpx，背景 `#FCF7EE`，顶部按状态栏高度留白）
1. 左侧手绘木质路牌插画 `signpost.png`，约 200×160rpx，距左 40rpx、距顶 72rpx，旋转 -4°。
2. 标题「街绘行图」64rpx 书法渐变，距左 260rpx、距顶 96rpx。
3. 副标「四条citywalk路线，边走边读外马路。」28rpx `#555`，距标题 20rpx。
4. 右侧地图定位插画 `pin-map.png`，约 180×160rpx，距右 32rpx、距顶 48rpx。

**总览条**：浅杏 `#FFE8C7`、圆角 24rpx、左右 48rpx、高 88rpx；文案「已解锁 {unlocked} / 4 条路线」+ 右侧 200×8rpx 细进度条（琥珀 `#F0AD45` 填充）。已解锁口径 = 该路线已打卡点位数 ≥ 1；分母 4 = 路线总数。

**路线列表**：左右 48rpx、卡间距 28rpx，使用 `route-card`。数据：`api.getRoutes()` 按 `order` 升序；已打卡集合 = `api.getMyCheckins()` 的 `siteId` 去重（未登录返回空数组），与 `route.stops` 取交集。
- 卡片内进度条分母为 `route.stops.length`，分子为交集数；文案「{checked}/{total} 已打卡」。
- 点击卡体进 `route-detail?routeId=`；点击「开始走街 →」区分登录态：已登录 `wx.navigateTo` 到 `walking?routeId=`，未登录存 `redirect` 后跳登录，登录成功直达 `walking?routeId=`。
- 空态：路线配置为空时显示「路线正在绘制中」；加载显示 3 张骨架卡。
- TabBar 由自定义组件自动显示，列表底部预留 112rpx + 安全区。

### 4.5 `route-detail`（路线详情）

- 上半屏地图：高 620rpx，`<map>` 显示整条 `polyline`（`width: 4`、主题色、`arrowLine: false`），端点由圆形序号 marker 遮盖；`includePoints` 包含折线与 marker，`padding` 按 60rpx 换算 px 后传数组。
- marker：`iconPath` 用 `assets/markers/{theme}.png`（112×144），`label` 显示序号 1…n；已打卡 marker 加主题色边框；选中态放大 1.2 倍。
- 浮层（`cover-view`）：左上返回、右上「路线信息」；地图底部 80rpx 渐隐到 `#FCF7EE`。
- 底部抽屉（普通 view，位于地图下方）：圆角 40rpx、白底、默认高度 50vh，上滑可到 85vh，点击点位收到 40vh；`transition: 240ms cubic-bezier(.2,.8,.2,1)`。
  - 路线名 40rpx / 700 + 主题胶囊 + 收藏按钮（未登录拦截）。
  - 数据行：距离 / 时长 / 点位数 / 已打卡。
  - 一句话介绍 + 「展开全部」（展开显示 `intro` 全文，按钮变「收起」）。
  - 点位时间轴：竖线 + 序号圆点（已打卡填主题色 + 勾，未打卡白底描边）；每项含序号、120rpx 缩略图、名称 30rpx、副信息「距下一点 180m」（最后一点显示「终点」）、右侧状态；点击该项调用 `MapContext.moveToLocation` 到该点、marker 高亮、抽屉收到 40vh。
- 底部固定按钮：主蓝胶囊、宽 600rpx、高 88rpx；未走完「开始走街」，已走完「查看走街记录」→ `subpackages/user/pages/checkins/index`。点位数与已打卡数取自 `api.getMyCheckins()` 与 `route.stops` 的交集。
- 开始前弹层：「将使用你的位置用于到点打卡」+「开始」/「取消」；同意后 `wx.navigateTo` 到 `walking?routeId=`；未登录先存 `redirect`（`walking?routeId=`）再跳登录。
- 加载失败：地图区「路线加载失败」+「重新加载」。

### 4.6 `walking`（走街进行中）

- 全屏 `<map>`，隐藏 TabBar；`show-location`，`scale=16`，主题色 `polyline` 与序号 marker；不显示系统导航。
- 顶部悬浮信息条（`cover-view`，高 88rpx，白底 90%）：当前目标点位名（`stops` 中第一个未打卡点位）、剩余距离「剩余 320m」、进度「{checked}/{total}」。
- 底部卡片（`cover-view`，圆角 32rpx、白底、左右 24rpx、距底安全区 24rpx）：封面 160rpx、名称 34rpx、一句话 24rpx；三个按钮「导航到这里」（`wx.openLocation`）、「到此打卡」、「语音讲解」（`site.audio.url` 为空时 Toast「该点位暂无语音讲解」）。
- 定位：进入即 `wx.startLocationUpdate` + `wx.onLocationChange`，每移动 ≥ 10m 更新一次；离开页面 `wx.offLocationChange` + `wx.stopLocationUpdate`。
- 打卡：当前目标距离 ≤ 50m 时按钮变「已到达，立即打卡」；≤ 200m 可手动打卡；> 200m 按钮置灰并显示「距离点位 {d}m」。打卡成功后目标切换下一点、进度 +1（同一点位每天只计 1 次）；全部完成进入完成态。
- 偏航：距折线最近点 > 80m 时顶部黄条「你已偏离路线约 {d}m」，30s 内不重复提示；GPS 精度 > 100m 时黄条「信号较弱，请稍后重试」。
- 完成态：全屏覆盖层显示用时、里程、打卡数；Canvas 2D 绘制海报（600×800rpx，米纸底 `#FCF7EE`）：路线名、`YYYY.MM.DD` 日期、`{total}` 枚点位印章、右下二维码占位（白底 +「小程序码」）。按钮「保存海报」「分享海报」「返回走街页」；分享标题「我的走街足迹｜埠影寻踪」。
- 退出：右上「结束走街」→ 二次确认「进度会保留，下次可继续」；确认后 `wx.navigateBack()`。
- 定位被拒：半屏引导「需要位置权限才能到点打卡」+「去设置」（`wx.openSetting`）/「取消」。

## 5. 组件规格

### 5.1 `compare-slider`

| 项 | 规格 |
| --- | --- |
| props | `todaySrc`（底层今照）、`oldSrc`（上层老照/复原图）、`percent`（初始 50）、`height`（默认 `420rpx`）、`todayLabel`（默认「今」）、`oldLabel`（默认「昔」） |
| data | `percentValue`、`containerLeft`、`containerWidth`（px）、`dragging` |
| 事件 | `bind:change` → `detail.percent`；`bind:dragend` → `detail.percent` |
| 状态 | 上层裁切层 `width:{{percentValue}}%`、`overflow:hidden`，内层图片宽度固定为测量到的容器宽度；分割线 `left:{{percentValue}}%`，4rpx 白线 + 64rpx 圆形双向箭头钮 |
| 手势 | `touchstart` / `touchmove` / `touchend`；`percent = clamp((clientX - containerLeft) / containerWidth * 100, 0, 100)` 四舍五入；`onReady` 用 `createSelectorQuery().in(this)` 测量，窗口变化重新测量 |
| 无障碍 | 左右各一个 88rpx 点击区，点击 ±5% 并 `wx.announceForAccessibility('{percent}%')`；`aria-role="slider"` |
| 样式 | 圆角 24rpx，图片 `aspectFill`，不写死主题色 |

### 5.2 `checkin-sheet`

| 项 | 规格 |
| --- | --- |
| props | `visible`、`siteName`、`count`（累计打卡数）、`stampText`（默认「已打卡」）、`time` |
| 事件 | `bind:close`、`bind:share` |
| 结构 | 全屏遮罩 `rgba(0,0,0,.45)`；中央成就卡（陶土/米纸，圆角 32rpx，宽 600rpx），主标题「你已点亮 {siteName}」、副文「累计打卡 {count} 次」、圆形印章 `stampText`、时间、分享按钮「分享这份足迹」、关闭按钮 |
| 动效 | 遮罩 200ms 淡入、卡片 240ms 上浮 24rpx；纸屑 12 片纯 CSS（绝对定位 + `nth-child` 不同 left/delay/旋转），禁止 Lottie/图片 |

### 5.3 `map-poi-sheet`

| 项 | 规格 |
| --- | --- |
| props | `visible`、`poi`（`{cover,name,categoryName,distance}`）、`favorited` |
| 事件 | `bind:detail`、`bind:checkin`、`bind:favorite`、`bind:close` |
| 结构 | 宽 670rpx、白底、圆角 24rpx、高约 260rpx；左 160rpx 缩略图；右标题 32rpx、分类标签、距离「距你 320m」；底部三个文字按钮「详情 / 打卡 / 收藏」 |
| 状态 | 点击详情/打卡先抛事件由页面做登录拦截；点击地图空白关闭 |

### 5.4 `route-card`

| 项 | 规格 |
| --- | --- |
| props | `route`（9.2 对象）、`index`（从 0 起，显示时补零为「01」）、`checkedCount` |
| 事件 | `bind:select` → `detail.route`（卡体）；`bind:start` → `detail.route`（右下「开始走街 →」，用 `catchtap` 阻止冒泡） |
| 结构 | 背景 `#FFE8C7`、圆角 24rpx、内边距 32rpx；序号 56rpx 琥珀 700；主题胶囊 22rpx（主题色 15% 底 + 主题色文字）；数据行「{distance}km · {duration}分钟 · {stops.length}个点位」24rpx `#666`；介绍单行省略；进度条 8rpx（底 `rgba(0,0,0,.08)`、填充主题色）+「{checked}/{total} 已打卡」22rpx；右下「开始走街 →」28rpx 主题色；右下虚线路径 + 小圆点装饰 |
| 主题色 | kaibu `--terracotta`、qiaoxiang `--amber`、wenjiao `--teal`、hongse `--terracotta-deep`；只用 Token，不新增色值 |

## 6. 数据写入与参数传递

### 6.1 `mock/routes.js`

导出 `{ routes }`，严格按 9.2 字段：`id`、`name`、`theme`、`themeName`、`cover`、`distance`（km）、`duration`（min）、`intro`、`stops`（点位 id 数组）、`polyline`（`[{latitude, longitude}]`）、`order`。

| order | id | name | theme / themeName | distance | duration | stops |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `route_01` | 开埠外交线 | `kaibu` / 开埠外交 | 1.2 | 40 | `site_001, site_002, site_005, site_006, site_003` |
| 2 | `route_02` | 侨乡商贸线 | `qiaoxiang` / 侨乡商贸 | 1.5 | 50 | `site_005, site_006, site_004, site_002, site_009` |
| 3 | `route_03` | 文教宗教线 | `wenjiao` / 文教宗教 | 1.0 | 35 | `site_007, site_008, site_009, site_004` |
| 4 | `route_04` | 红色革命线 | `hongse` / 红色革命 | 1.8 | 60 | `site_010, site_011, site_012, site_009` |

- 点位 id 对应 9.4：`site_001` 潮海关旧址、`site_002` 汕头开埠邮局陈列馆、`site_003` 汕头海关关史陈列馆、`site_004` 汕头开埠文化陈列馆、`site_005` 侨批文物馆、`site_006` 永平酒楼、`site_007` 老妈宫与戏台、`site_008` 存心善堂、`site_009` 中山纪念亭、`site_010` 大埔会馆、`site_011` 东征军革命史迹陈列馆、`site_012` 桂园。
- `intro` 固定：route_01「从海关到洋行，读懂汕头开埠的第一课。」；route_02「从侨批与酒楼，读懂一纸乡愁的往来。」；route_03「从香火到书声，走进老城的日常信仰。」；route_04「从会馆到史迹，走一遍东征与抗战的记忆。」
- `cover` 置空字符串，页面与海报取 `stops[0]` 点位的封面兜底，不新增 `assets/images/routes/` 目录。
- `polyline` 每条 5—7 个坐标点，按 `stops` 顺序沿外马路—永平路—升平路—民权路连线；坐标示意，阶段 05 用腾讯地图拾取器校准。route_01 示例：
  `[{latitude:23.35399,longitude:116.67865},{latitude:23.35362,longitude:116.67966},{latitude:23.35405,longitude:116.68062},{latitude:23.35442,longitude:116.68128},{latitude:23.35470,longitude:116.68195}]`

### 6.2 Storage 与 Mock 写入口径

| key | 内容 | 写入者 |
| --- | --- | --- |
| `byxz_favorites` | `Favorite[]`（`{id,type,targetId,createdAt}`，`type` 为 `site` / `route`） | `api.addFavorite / api.removeFavorite` |
| `byxz_checkins` | `Checkin[]`（9.3 字段，`time` 为 ISO 字符串，`count` 为累计次数） | `api.createCheckin` |
| `byxz_redirect` | 登录后回跳的完整路径（含参数） | 页面拦截时写，登录页读并清除 |
| `byxz_view_log` | `{ [siteId]: 'YYYY-MM-DD' }` 浏览去重映射（与基线 §7.5 一致，不是数组） | `api.reportSiteView` |
| `byxz_token` / `byxz_user` | 登录 token 与用户对象（阶段 04 写） | 登录页 |

- `USE_MOCK` 下 `api.addFavorite / api.removeFavorite`：读 `byxz_favorites`，已收藏则过滤，否则 `concat({id:'fav_'+Date.now(),type,targetId,createdAt:Date.now()})`，写回后 resolve `{code:0,data:{favorited:!favorited}}`；失败 reject 由页面回滚。
- `USE_MOCK` 下 `api.createCheckin`：读 `byxz_checkins`，若 `time` 的日期部分与今天相同且 `siteId` 相同，返回 `{duplicated:true,count}` 不新增；否则插入 `{id:'checkin_'+Date.now(),siteId,siteName,cover,time,lat,lng,distance,count: 该点位累计次数 + 1}` 并写回。
- 切换真实接口时只改 `USE_MOCK` 与 `request` 基地址，页面不变：收藏 `POST/DELETE /sites/:id/favorite`，打卡 `POST /checkins {siteId,lat,lng}`，路线列表 `GET /routes`，路线详情 `GET /routes/:id`，AI 复原 `POST /ai/restore {siteId}`。
- 路线收藏无对应服务端接口，Mock 下同样写 `byxz_favorites`；阶段 05 切真实接口时补 `/routes/:id/favorite`，页面无改动。
- 若 `utils/api.js` 尚无 `getRoutes` / `getRouteDetail` / `getSiteDetail` / `getMyCheckins` / `addFavorite` / `removeFavorite` / `createCheckin` / `reportSiteView`，只在 `USE_MOCK` 分支补最小实现，不改动既有方法与导出。

### 6.3 路由参数与跳转

| 起点 | 目标 | 参数 |
| --- | --- | --- |
| 史料页 / 相关推荐 / 搜索「史料」「点位」 | `subpackages/detail/pages/site-detail/index` | `siteId=site_001` |
| 探索卡 / 史料「更多」 | `subpackages/detail/pages/topic/index` | `theme=kaibu` |
| 探索卡 / 专题卡 | `subpackages/detail/pages/ai-restore/index` | 无 |
| 走街页 / 搜索「路线」 | `subpackages/route/pages/route-detail/index` | `routeId=route_01` |
| 路线详情「开始走街」 | `subpackages/route/pages/walking/index` | `routeId=route_01` |
| 走街页「开始走街 →」 | `subpackages/route/pages/walking/index` | `routeId=route_01` |
| 路线详情「查看走街记录」 | `subpackages/user/pages/checkins/index` | 无 |
| 专题「Citywalk路线」 | `pages/walk/index` | 无，`wx.switchTab` |

- 只认 `siteId` / `routeId`；`site-detail` 的 `onLoad` 只读 `options.siteId`，不接受 `id`。
- 未登录拦截：收藏、打卡、走街开始统一调用 `requireLogin(当前页完整路径含参数)`（例如 `requireLogin('/subpackages/detail/pages/site-detail/index?siteId=site_001')`）；内部若无 `byxz_token` 则 `wx.setStorageSync('byxz_redirect', url)` 后 `wx.navigateTo({url:'/pages/login/index'})`。登录页（阶段 04）成功时读 `byxz_redirect`，普通页 `redirectTo`、Tab 页 `switchTab`，随后清除该 key；无 `redirect` 回「我的」。
- 分享：`onShareAppMessage` 标题统一带「埠影寻踪」；详情页带 `siteId`，路线详情带 `routeId`，走街海报带 `imageUrl`。

## 7. 验收标准

- [ ] 6 个页面与 4 个组件文件齐全（`map-poi-sheet` 复用阶段 02 并校准 props），均能在开发者工具编译打开，无「页面/组件不存在」。
- [ ] 史料详情：图集「1/5」、标题标签、地址导航、开放时间、距离、导语、建筑小档案、相关推荐、底部三按钮全部呈现。
- [ ] 今昔对照：容器 654×420rpx，拖动分割线百分比实时变化，左右不可越界，按钮可 ±5% 微调。
- [ ] AI 复原：2.5s 进度、复原图替换、水印「AI 复原示意，非历史原貌」均正确；AI 复原影像页 6 组卡带「AI 生成」水印。
- [ ] 打卡：> 200m 按钮置灰并显示距离；≤ 200m 可打卡；成功弹 `checkin-sheet`（遮罩 + 成就卡 + 纸屑 +「你已点亮 {siteName}」）；同点位当天重复打卡不重复计数。
- [ ] 收藏：图标与数字乐观更新，失败回滚；未登录点收藏跳登录并写入 `redirect`。
- [ ] 专题页：主题头图、点位数、年代/状态筛选、复用史料卡、路线/AI 两张入口卡跳转正确。
- [ ] 走街页：路牌头部、书法渐变「街绘行图」、副标、总览条「已解锁 x / 4 条路线」、4 条路线卡数据与 7.6 表格一致。
- [ ] 进度口径：分子 = 该路线已打卡点位数，分母 = `stops.length`，文案「x/5 已打卡」；总览已解锁 = 至少打卡 1 个点的路线数，分母固定 4。
- [ ] 路线详情：620rpx 地图、主题色折线、序号 marker、`includePoints` 自动缩放、抽屉 50%→85%/40%、时间轴已打卡勾选态、点位点击联动。
- [ ] 走街进行中：定位跟随、顶部「2/5」、剩余距离、≤50m「已到达，立即打卡」、偏航/弱信号黄条、结束二次确认文案正确。
- [ ] 完成态：用时/里程/打卡数、Canvas 2D 海报含路线名、日期、点位印章、二维码占位，可保存与分享。
- [ ] 地图页浮层全部使用 `cover-view`/`cover-image`，WebView 下不被原生地图遮挡；未开启 Skyline。
- [ ] 列表页具备骨架屏 3 卡、空状态、加载失败重试、上拉到底文案；空态「路线正在绘制中」「这个专题还没有史料」「暂无可复原点位」。
- [ ] 所有色值、字号、圆角、阴影取自 00-baseline Token；无新增色值、无第三方依赖、无 Lottie。
- [ ] 控制台无报错，无未定义变量，无重复 `setData`，无横向滚动。

## 8. 约束与禁止事项

1. 只使用微信原生语法（WXML + WXSS + ES6），禁止 Taro / uni-app / TypeScript / npm 组件库；零新增依赖，不建 `package.json`。
2. 禁止开启 Skyline；`<map>` 一律同层渲染，浮层用 `cover-view`，marker `iconPath` 用本地 PNG。
3. 复用阶段 01 的 Token、字体、圆角、阴影与 `nav-bar` / `empty-state` / `skeleton`；复用阶段 02 的 `site-card` / `filter-chips` / `map-poi-sheet`，不得复制一套新样式。
4. 页面只调 `utils/api.js`，禁止 `require('../../mock/sites')` 或直接 `wx.getStorageSync('byxz_favorites')` 写业务数据（组件内展示态除外）。
5. 禁止修改 `00-baseline.md`、01/02/04/05 阶段文件；禁止新增 `pages/heritage*`、`pages/street*`、`pages/mine*` 等旧路径。
6. 不得改产品名：页面文案、分享标题、注释只用「埠影寻踪」；「埠藏史库」「街绘行图」仅作书法文案。
7. 不得新增 `diplomacy` / `commerce` / `culture` / `red` / `ai` 等旧分类枚举，统一 `kaibu` / `qiaoxiang` / `wenjiao` / `hongse`。
8. 数值不得写死：距离、时长、点位数、进度、收藏数、打卡数全部来自 `api` 返回值或 Storage 实时计算。
9. 打卡半径固定 ≤ 200m、自动提示 ≤ 50m、精度 > 100m 提示「信号较弱，请稍后重试」；不做后台持续定位。
10. AI 复原必须标注「AI 生成」或「AI 复原示意，非历史原貌」，不得暗示历史真实性，不做人脸。
11. 不在本阶段实现登录页、用户中心、云函数；遇到依赖只按第 6 节约定跳转或预留接口。
12. 图片无素材时用渐变底 + 建筑名占位并保留替换清单，禁止外链图片。
