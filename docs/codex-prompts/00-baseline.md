# 00 · 重建事实基线（01–05 共享事实源）

> 本文件为 01–05 的共同事实源，与上传的《埠影寻踪》提示词文档一致，冲突以本文件为准。每个阶段只读「本文件 + 本阶段文件」，不读其他阶段文件；旧版提示词包（旧 `00-baseline` 及 docs 下的旧规格）整体作废。

## 1. 产品定义

| 项 | 内容 |
|---|---|
| 产品名 | **埠影寻踪** |
| 副标题 / Slogan | **埠藏史库，街绘行图** |
| 地域 | 广东汕头 · 小公园开埠区 · 外马路历史文化街区 |
| 产品定位 | 一座「可走、可读、可收藏」的线上地方史博物馆：用地图把散落的开埠建筑、侨批记忆、红色旧址串起来，让用户边走边读 |
| 目标用户 | 18—35 岁城市漫游者、返乡青年、亲子家庭、研学团队、文史爱好者 |
| 核心价值 | 地图探索、史料阅读、Citywalk 路线、实地打卡、收藏与足迹 |
| 核心闭环 | 探索发现 → 查看史料 → 到达点位 → 打卡/收藏 → 形成足迹 → 我的成就 |
| 内容基调 | 旧纸、朱砂、老照片、手绘插画；温暖、克制、有年代感，不做科技蓝紫渐变风 |

**新旧命名口径（重要）**

- 产品名统一为 **「埠影寻踪」**：小程序名称、分享标题、页面内品牌露出、README、代码注释一律用它。
- **「埠藏史库·街绘行图」是旧版产品名，已废弃**，不得再作为产品名、小程序名、`navigationBarTitleText` 或页面标题使用。
- 「埠藏史库」「街绘行图」仅作为 slogan（「埠藏史库，街绘行图」）及其书法排版素材保留：探索页头部两列竖排书法、史料页书法标题分别按第 7 章规格出现，属文案元素而非产品名。

## 2. 技术栈与工程硬约束

| 项 | 硬约束 |
|---|---|
| 框架 | 微信小程序原生（WXML + WXSS + JavaScript ES6），不引入 uni-app / Taro / React |
| 渲染 | WebView 渲染（默认），**禁止开启 Skyline**，避免 `map` 原生组件层级问题 |
| 基础库 | `>= 3.0.0`；`app.json` 开启 `"lazyCodeLoading": "requiredComponents"` |
| 状态管理 | 不引入 MobX / Redux 等状态库；用 `app.globalData` + `wx.setStorageSync` 管理登录态、字体缩放、偏好，页面内用 `setData` |
| 数据层 | 先本地 Mock，所有请求走 `utils/api.js` 统一封装（Promise + 300—600ms 模拟延迟 + 统一 `{ code, data, msg }`）；保留 `USE_MOCK` 开关，可无缝切云开发/后端 |
| 样式与依赖 | WXSS + CSS 变量，不使用第三方 UI 库；弹窗、选择器手写（或 Vant 并覆写为设计风格）；零 npm 运行时依赖 |
| TabBar | 必须自定义 TabBar（`"custom": true` + `custom-tab-bar/index`），设计为非标准高度、米杏底色、手绘彩色图标 |
| 分包 | 主包只放 4 个 Tab 页 + 登录、注册；详情、路线、用户二级页放 `subpackages/` |
| 图片 | 全部本地 `assets/`，`mode="aspectFill"`，`lazy-load`；无素材时「渐变底色 + 建筑名文字」占位，并保留统一替换清单 |
| 适配 | 以 750rpx 设计宽度为基准；状态栏用 `wx.getWindowInfo().statusBarHeight`，底部安全区 `env(safe-area-inset-bottom)` |
| 主题 | 不支持深色模式，**强制浅色**，页面底色恒为米纸白 `#FCF7EE` |

**目录结构（必须遵守，逐字照搬）**

```
miniprogram/
├─ app.js / app.json / app.wxss
├─ custom-tab-bar/
├─ pages/
│  ├─ explore/          探索（Tab）
│  ├─ archive/          史料（Tab）
│  ├─ walk/             走街（Tab）
│  ├─ profile/          我的（Tab）
│  └─ login/  register/
├─ subpackages/
│  ├─ detail/pages/site-detail/  topic/  ai-restore/
│  ├─ route/pages/route-detail/  walking/
│  └─ user/pages/checkins/ favorites/ preferences/ font/ privacy/ messages/ profile-edit/ settings/ search/
├─ components/
│  ├─ nav-bar/  tab-icon/  site-card/  route-card/  filter-chips/
│  ├─ section-title/  empty-state/  skeleton/  compare-slider/  checkin-sheet/
├─ utils/  api.js  auth.js  location.js  format.js  storage.js
├─ mock/   sites.js  routes.js  user.js
└─ assets/ images/ icons/ tabbar/ markers/ illustrations/
```

- 页面文件沿用 `pages/<pageName>/index.{js,wxml,wxss,json}`，分包同构；`cloudfunctions/` 目前为空，01–05 不实现云函数，仅保留配置项。

## 3. 必守的既有工程事实（`project.config.json`）

| 键 | 值 | 说明 |
|---|---|---|
| `appid` | `wx14264fd3b18c547f` | **不得修改**，沿用既有小程序 |
| `miniprogramRoot` | `miniprogram/` | 源码根目录 |
| `cloudfunctionRoot` | `cloudfunctions/` | 云函数根目录（当前为空目录） |
| `libVersion` | `3.17.0` | 满足「基础库 ≥3.0.0」 |
| `projectname` | `WaimaRoad` | 不得改回任何模板名 |

- 新增 `project.private.config.json` 时同样不得改 `appid` 与 `libVersion`。
- `sitemapLocation` 指向 `sitemap.json`，重建时保留；`project.config.json` 中模板遗留的编译条件（如 `pages/databaseGuide/databaseGuide`）必须清除。

## 4. 全局设计规范

### 4.1 画布与栅格

- 设计基准 750rpx；左右页面边距 **48rpx**，卡片间距 **24rpx**，区块间距 **40rpx**；最小间距单位 8rpx。
- 自定义导航栏总高 = 状态栏高度 + **88rpx**；Tab 页内容底部预留 **112rpx + 安全区**，防 TabBar 遮挡。

### 4.2 色彩 Token（18 个，必须定义为 CSS 变量）

| Token | 色值 | 用途 |
|---|---|---|
| `--bg` | `#FCF7EE` | 全局米纸白底色 |
| `--bg-warm` | `#FBF6EC` | 次级底色、输入区 |
| `--apricot` | `#FFE8C7` | 浅杏卡片、我的菜单、提示条 |
| `--tan` | `#F0E0C7` | 自定义 TabBar 背景、地图外框 |
| `--terracotta` | `#D98C75` | 史料卡背景、主强调 |
| `--terracotta-deep` | `#B65A44` | 书法标题渐变深端 |
| `--coral` | `#F2AB9E` | 打卡点图标、暖色点缀 |
| `--amber` | `#F0AD45` | 数字、搜索按钮、进度 |
| `--teal` | `#00BAAD` | 仅备用，不用于主方案 |
| `--blue` | `#1A91FA` | 登录按钮、选中态、链接 |
| `--ink` | `#333333` | 主文字、Tab 标签 |
| `--ink-2` | `#666666` | 说明文字 |
| `--ink-3` | `#999999` | 占位符、箭头 |
| `--line` | `#E8DDCB` | 分割线 |
| `--chip` | `#CCCCCC` | 未选中分类胶囊 |
| `--tag` | `#F7B878` | 图片左上角分类角标 |
| `--white` | `#FFFFFF` | 统计卡、浮层 |
| `--danger` | `#E05B4A` | 删除、错误 |

- 统一取舍：页底色 `#FCF7EE`；卡片用浅杏 `#FFE8C7` 或陶土 `#D98C75`；数字强调琥珀 `#F0AD45`；登录按钮主蓝 `#1A91FA`；不混用青绿版统计数字。

### 4.3 字体层级

| 层级 | 字号 / 行高 | 字重 | 用法 |
|---|---|---|---|
| 书法主标题 | 64rpx / 1.15 | — | 「埠藏史库」「街绘行图」，优先用图片切图；无切图时 `STKaiti, KaiTi, serif` + 陶土渐变 |
| 页面大标题 | 44rpx / 1.3 | 700 | 详情页标题、登录「欢迎」 |
| 卡片标题 | 34rpx / 1.4 | 600 | 史料名、路线名 |
| 正文 | 28rpx / 1.7 | 400 | 段落、介绍 |
| 辅助 | 24rpx / 1.5 | 400 | 副标题、标签、说明 |
| 数字 | 56rpx / 1.1 | 700 | 打卡数等，字体 `DIN Alternate, Bebas Neue, sans-serif` |
| Tab 标签 | 22rpx / 1 | 500 | 探索/史料/走街/我的 |

- 中文正文统一 `PingFang SC, Helvetica Neue, sans-serif`；书法标题渐变 `linear-gradient(180deg, #C9705A 0%, #B65A44 100%)` + `-webkit-background-clip: text; color: transparent;`，另加 1rpx 暖色投影模拟墨迹。
- 字体缩放：`--fs` 作用于全局，范围 **0.9—1.3**，**步进 0.05、保留两位小数**（三档快捷值 `1.00 / 1.15 / 1.30`），切换后当前页立即生效、重进仍保留。

### 4.4 圆角、阴影、描边

- 圆角：小标签 8rpx；输入框/按钮 44rpx（胶囊）；普通卡片 24rpx；底部抽屉 40rpx；我的页内容层顶部 48rpx；探索入口卡 20rpx；分类胶囊 32rpx。
- 阴影：卡片 `0 8rpx 24rpx rgba(120, 90, 60, 0.08)`；浮层 `0 12rpx 40rpx rgba(80, 55, 35, 0.16)`；史料卡 `0 8rpx 24rpx rgba(120,90,60,.10)`。
- 描边：地图外框 4rpx 实线 `#F5D9A8`；史料卡无描边。

### 4.5 图像与插画风格

- 照片统一暖调、低饱和、轻微泛黄，可叠 `rgba(214, 170, 120, 0.08)`；手绘元素：旧书与羽毛笔（史料页）、路牌与地图定位（走街页）、水彩小公园亭与骑楼（我的页封面）、彩色手绘 Tab 图标。
- 图标风格：粗描边 + 局部填色，颜色取自珊瑚、琥珀、草绿、天蓝；禁止线性单色图标。
- Tab 图标 4 个：指南针（探索，蓝）、三本立书（史料，蓝/青）、小公园亭（走街，紫）、红顶小屋（我的，蓝身红顶）。

### 4.6 动效

- 统一时长 **180—240ms**，缓动 `cubic-bezier(.2,.8,.2,1)`。
- 页面进入：淡入 + 上移 12rpx；卡片按压 `scale(0.98)`；收藏/打卡：`wx.vibrateShort({type:'light'})` + 图标弹跳。
- 打卡成功：全屏半透明遮罩 + 中央成就卡上浮 + 细碎纸屑（纯 CSS，不引入 Lottie）。
- 地图 marker 点击：选中放大 1.2 倍并滑出底部卡片；统计数字滚动 600ms（0 → 目标值）。

### 4.7 自定义 TabBar

- 固定底部，高度 `112rpx + env(safe-area-inset-bottom)`，背景 `#F0E0C7`，无圆角、无阴影、无上边框。
- 4 等分，图标 52rpx，标签 22rpx `#333`；选中项图标放大 1.06、标签 `font-weight: 600`；未选中透明度 0.9。
- 切换用 `wx.switchTab`，通过 `getTabBar().setData({selected})` 同步高亮；页面滚动时 TabBar 不隐藏、不变透明、不做吸顶变化。

### 4.8 通用状态与点击区

- 每个列表页必须有：骨架屏（3 张卡）、空状态（手绘插画 + 一句引导 + 按钮）、加载失败（重试按钮）、上拉加载更多（「没有更多了 / 已经到底啦」）；所有可点击元素点击区 **不小于 88rpx**。

## 5. 路由与信息架构（20 个页面）

| # | 路径 | 页面 | 类型 | 需登录 |
|---|---|---|---|---|
| 1 | `pages/explore/index` | 探索 | Tab 1 | 否 |
| 2 | `pages/archive/index` | 史料 | Tab 2 | 否 |
| 3 | `pages/walk/index` | 走街 | Tab 3 | 否 |
| 4 | `pages/profile/index` | 我的 | Tab 4 | 否（数据需登录） |
| 5 | `pages/login/index` | 登录 | 普通（主包） | — |
| 6 | `pages/register/index` | 注册 | 普通（主包） | — |
| 7 | `subpackages/detail/pages/site-detail/index` | 史料详情 | 普通（detail） | 否 |
| 8 | `subpackages/detail/pages/topic/index` | 专题聚合 | 普通（detail） | 否 |
| 9 | `subpackages/detail/pages/ai-restore/index` | AI 复原影像 | 普通（detail） | 否 |
| 10 | `subpackages/route/pages/route-detail/index` | 路线详情 | 普通（route） | 否 |
| 11 | `subpackages/route/pages/walking/index` | 走街进行中 | 普通（route） | 是 |
| 12 | `subpackages/user/pages/checkins/index` | 我的打卡点 | 普通（user） | 是 |
| 13 | `subpackages/user/pages/favorites/index` | 我的收藏 | 普通（user） | 是 |
| 14 | `subpackages/user/pages/preferences/index` | 喜好设置 | 普通（user） | 是 |
| 15 | `subpackages/user/pages/font/index` | 字体设置 | 普通（user） | 否 |
| 16 | `subpackages/user/pages/privacy/index` | 隐私设置 | 普通（user） | 是 |
| 17 | `subpackages/user/pages/messages/index` | 消息 | 普通（user） | 是 |
| 18 | `subpackages/user/pages/profile-edit/index` | 编辑资料 | 普通（user） | 是 |
| 19 | `subpackages/user/pages/settings/index` | 设置 | 普通（user） | 是 |
| 20 | `subpackages/user/pages/search/index` | 搜索 | 普通（user） | 否 |

**分包归属**

- 主包：4 个 Tab + `login` + `register`。
- `subpackages/detail`：`site-detail`、`topic`、`ai-restore`。
- `subpackages/route`：`route-detail`、`walking`。
- `subpackages/user`：`checkins`、`favorites`、`preferences`、`font`、`privacy`、`messages`、`profile-edit`、`settings`、`search`。

**启动与登录拦截**

- 默认进入「探索」，允许游客浏览；首次启动是否强制先登录可配置，**默认否**。需登录的动作：打卡、收藏、走街开始、查看「我的」数据；浏览与搜索不需要登录。
- 未登录触发上述动作时：先存 `redirect`（目标页路径 + 参数），跳登录页；登录成功后按 `redirect` 原路回跳，无 `redirect` 时回「我的」。登录页自身不写死回跳目标。
- 返回统一 `wx.navigateBack()`；Tab 间切换统一 `wx.switchTab`。

## 6. 公共组件（`components/`）

| 组件 | 入参（props，语义固定，命名在阶段 01 定） | 事件 | 用途 |
|---|---|---|---|
| `nav-bar` | 透明/米色底开关、返回开关、标题、右侧插槽 | 返回点击（文档未给事件名，阶段 01 定） | 自定义导航，自动处理状态栏与胶囊高度 |
| `tab-icon` | `name`、`active` | —（文档未定义） | 输出 52rpx 图标 + 22rpx 标签 |
| `site-card` | `variant`（`terracotta` / `plain`）、收藏态、统计数据 | 整卡点击、收藏点击（阶段 02 定） | 史料卡，数字格式化 |
| `route-card` | 序号、进度、主题色、路线数据 | 整卡点击（阶段 03 定） | 走街路线卡 |
| `filter-chips` | 选项列表、受控 `selected`、是否吸顶 | 选中变化 | 横向滚动分类胶囊 |
| `section-title` | 标题、是否书法字、右侧「更多」文案 | 「更多」点击 | 左标题 + 右「更多」 |
| `empty-state` | 插画、主文案、副文案、按钮文案 | 按钮点击 | 空状态 |
| `skeleton` | 类型：`card` / `list` / `detail` | — | 三种骨架 + 呼吸动画 |
| `compare-slider` | 今昔两图、初始百分比 | 拖动百分比变化（`touchmove` 计算） | 今昔对比滑块，支持无障碍按钮微调 |
| `checkin-sheet` | 点位名、累计数、印章样式 | 分享点击 | 打卡成功半屏卡 |
| `map-poi-sheet` | 点位数据（缩略图/标题/分类/距离） | 详情/打卡/收藏三个文字按钮 | 地图点位底部卡 |

- 全部组件用 `externalClasses` 或 CSS 变量适配主题，不写死颜色；阶段 01 只实现 `nav-bar`、`tab-icon`、`section-title`、`empty-state`、`skeleton`，其余随对应页面阶段落地。

## 7. 数据模型索引（详细字段与 Mock 数据在阶段 05）

### 7.1 Site（史料点位）

| 字段 | 类型 | 要点 |
|---|---|---|
| `id` | String | 形如 `site_001` |
| `name` / `alias` | String | 点位名 / 别称（如「汕头海关关史陈列馆」） |
| `category` | String | 枚举 `kaibu \| qiaoxiang \| wenjiao \| hongse` |
| `categoryName` | String | 开埠外交 / 侨乡商贸 / 文教宗教 / 红色革命 |
| `cover` / `images` | String / Array | 本地 `assets` 路径，封面 750×450 |
| `summary` / `description` | String | 简介一行 / 长文本 3—5 段 |
| `address` | String | 如「汕头市金平区外马路 2 号」 |
| `location` | `{lat, lng}` | 示例 `23.3520 / 116.6785` |
| `era` / `structure` / `originalUse` / `currentStatus` | String | 年代 / 结构 / 原用途 / 现存或已消失 |
| `openTime` | String | 如「周二至周日 09:00—17:00」 |
| `viewCount` / `favoriteCount` / `checkinCount` | Number | 展示值，前端做 k 格式化 |
| `oldPhotos` | Array<{url, year, source}> | 今昔对比用老照片 |
| `aiRestored` | String | AI 复原图路径；页面须标注「AI 生成 / 仅供想象」 |
| `audio` | `{url, duration}` | 语音导览，`url` 可为空 |
| `tags` | Array\<String\> | 如 `["海关","开埠","洋行"]` |

### 7.2 Route（路线）

| 字段 | 类型 | 要点 |
|---|---|---|
| `id` | String | 形如 `route_01` |
| `name` / `intro` | String | 路线名 / 一句话简介 |
| `theme` / `themeName` | String | 主题枚举同 Site / 中文名 |
| `distance` / `duration` | Number | km / min |
| `stops` | Array\<String\> | 点位 id 序列（示例 4 个点） |
| `polyline` | Array<{latitude, longitude}> | 地图折线 |
| `order` | Number | 排序 |

### 7.3 其他模型

| 模型 | 字段要点 |
|---|---|
| User | `{ id, nickname, avatar, phone, bio, createdAt }` |
| Checkin | `{ id, siteId, siteName, cover, time, lat, lng, distance, count }` |
| Favorite | `{ id, type: 'site' \| 'route', targetId, createdAt }` |
| Preference | `{ themes: [], recommendBias: 3, notify: {checkin, route, system}, showLost: true, mapLayer: 'sites' }` |
| Message | `{ id, type: 'system' \| 'interact', title, summary, time, read, link }` |

### 7.4 Mock 文件与规模

- 文件划分：`mock/sites.js`（史料点位）、`mock/routes.js`（路线 + 点位序列）、`mock/user.js`（用户、收藏、打卡、偏好、消息）。
- 规模：点位 **12 条**（即史料首批 12 条），分类 4 类；路线条数按第 7 章走街页「4 条路线」实现。
- 点位清单（地址为示意，坐标接入时用腾讯地图拾取器校准）：

| 名称 | 分类 | 地址 |
|---|---|---|
| 潮海关旧址 | 开埠外交 | 外马路 2 号 |
| 汕头开埠邮局陈列馆 | 开埠外交 | 外马路 25 号 |
| 汕头海关关史陈列馆 | 开埠外交 | 外马路 20 号 |
| 汕头开埠文化陈列馆 | 开埠外交 | 永平路 1 号 |
| 侨批文物馆 | 侨乡商贸 | 外马路 18 号 |
| 永平酒楼 | 侨乡商贸 | 永平路 11 号 |
| 老妈宫与戏台 | 文教宗教 | 升平路 6 号 |
| 存心善堂 | 文教宗教 | 外马路 87 号 |
| 中山纪念亭 | 文教宗教 | 小公园片区 |
| 大埔会馆 | 红色革命 | 民权路 95 号 |
| 东征军革命史迹陈列馆 | 红色革命 | 外马路 207 号 |
| 桂园 | 红色革命 | 公园路 23 号 |

- 「潮海关旧址」基准文案：简介「汕头开埠的重要见证，现为汕头海关关史陈列馆所在地」；浏览 `2.6k`、收藏 `2.1k`。

### 7.5 API 约定

- 统一响应 `{ code: 0, data, msg }`，`code !== 0` 时 Toast `msg`；Mock 延迟 **300—600ms**。
- `utils/api.js` 内 `USE_MOCK` 为唯一开关；页面只调 `api`，不直接读写 `mock/`。
- 接口清单：

```
POST /auth/login          { account, password }
POST /auth/register       { nickname, phone, code, password }
POST /auth/wechat         { code }
GET  /sites?category=&keyword=&page=&pageSize=
GET  /sites/:id
POST /sites/:id/view
POST /sites/:id/favorite   /  DELETE
POST /checkins            { siteId, lat, lng }
GET  /routes
GET  /routes/:id
GET  /me
PATCH /me
GET  /me/checkins
GET  /me/favorites
GET  /messages
POST /ai/restore          { siteId }
```

- 分页：列表每页 10 条；`utils/format.js` 负责时间与数字（≥1000 → `2.6k`，≥10000 → `1.2w`）；Storage key 统一前缀 **`byxz_`**，集中管理（`utils/storage.js`），页面禁止硬编码：

| key | 类型 | 内容 / 写入者 |
|---|---|---|
| `byxz_token` | String | 登录 token（`auth.login`） |
| `byxz_user` | Object | 当前用户 `{ id, nickname, avatar, phone, bio, createdAt }` |
| `byxz_redirect` | String | 登录后回跳的完整路径（含参数），登录成功即清除 |
| `byxz_font_scale` | Number | 字体缩放 0.9—1.3，默认 1 |
| `byxz_font_follow_system` | Boolean | 跟随系统字号，默认 false |
| `byxz_preferences` | Object | 喜好设置（分类、推荐强度、通知、`showLost`、`mapLayer`） |
| `byxz_privacy` | Object | 隐私设置 `{ footprintVisible, displayMode }` |
| `byxz_search_history` | Array | 搜索历史，≤10 条 |
| `byxz_favorites` | Array | `Favorite[]`（`{ id, type, targetId, createdAt }`，`type` 为 `site` / `route`） |
| `byxz_checkins` | Array | `Checkin[]`（同日同 `siteId` 只计 1 次，`count` 为累计次数） |
| `byxz_view_log` | Object | `{ [siteId]: 'YYYY-MM-DD' }` 浏览去重 |
| `byxz_walk_progress` | Object | `{ [routeId]: { startAt, doneStops: [] } }` |
| `byxz_subscribe` | Object | `{ checkin, route, system }` 订阅状态 |
| `byxz_locationTip` | Boolean | 「开启定位」提示条是否已展示过（探索页，避免每次进入都打扰） |

## 8. 关键业务规则（逐条保留）

1. **打卡半径**：≤ 200m 可打卡；≤ 50m 自动提示；定位精度 > 100m 提示「信号较弱，请稍后重试」。
2. **打卡计数**：同一点位每天最多计 1 次；「打卡数」为累计次数，「足迹数」为去重点位数。
3. **收藏**：乐观更新，失败回滚；收藏数展示做 k 格式化。
4. **浏览数**：同设备同一天同一点位只上报一次。
5. **登录拦截**：打卡、收藏、走街开始、我的数据必须登录；浏览与搜索不需要。
6. **字体缩放**：`--fs` 作用于全局，范围 0.9—1.3，步进 0.05、保留两位小数；切换后当前页立即生效，重进仍保留。
7. **定位**：只在探索页、详情页、走街页按需请求；不在后台持续定位。
8. **AI 复原**：必须标注「AI 生成 / 仅供想象」，不得暗示历史真实性；不做人脸。
9. **分享**：史料、路线、打卡海报均可分享；分享标题带「埠影寻踪」。
10. **内容合规**：用户昵称、简介做敏感词过滤；无公开 UGC 评论区，降低审核风险。

## 9. 平台能力与权限

- `app.json` 声明 `permission.scope.userLocation.desc = "用于展示附近史迹并验证到点打卡"`，以及 `requiredPrivateInfos: ["getLocation","chooseLocation","startLocationUpdate"]`。
- 定位：首次前用自定义半屏说明「为什么需要位置」，再调 `wx.getLocation`；拒绝后给「去设置」并调 `wx.openSetting`。
- 隐私：`wx.requirePrivacyAuthorize` + `app.json` 的 `__usePrivacyCheck__`，并接入《用户隐私保护指引》。
- 登录：`wx.login` 换 code；头像昵称用 `chooseAvatar` 与 `<input type="nickname">`，**不再使用 `getUserProfile`**。
- 地图：`<map>` 走同层渲染；marker `iconPath` 用本地 PNG；`bindmarkertap` 取 `e.detail.markerId`。
- 分享：`onShareAppMessage` / `onShareTimeline`；探索页分享标题「埠影寻踪｜在汕头老城，边走边读百年」。
- 震动与订阅：收藏、打卡成功用 `wx.vibrateShort({type:'light'})`；订阅消息按偏好/消息场景预留模板位，未配置模板 ID 时只写本地状态并提示，不调用 `wx.requestSubscribeMessage`。
- 版本：基础库低于 2.32.3 时提示升级（与「≥3.0.0」并存，实现取较高线）。

## 10. 性能与可维护性

- 首屏图片总大小 < 800KB；列表图 750px 宽、质量 80 的 WebP/JPG；长列表分页 10 条，图片 `lazy-load`，骨架屏避免白屏。
- `map` 页避免频繁 `setData` 大对象：marker 一次性设置，选中态单独更新。
- 时间、数字格式化统一在 `utils/format.js`；Storage key 统一 `byxz_` 前缀并集中管理。
- 组件样式只用 `rpx` + CSS 变量，禁止行内写死主题色；注释中文、关键函数写 JSDoc；不引入未使用依赖，`package.json` 只保留必要脚本。
- 素材占位：暖灰或陶土渐变底 + 居中白色建筑名 + 右下角「图片待替换」，不出现外链；交付时附统一替换清单。
- 素材接入（把设计稿细节图与实拍照片一一换上）见 `07-assets-swap.md`：目录、命名、尺寸、接线方式、体积红线与验收清单都在那里，本表只定尺寸。

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `assets/tabbar/*.png`（4 个） / `assets/markers/*.png`（4 个） | 104×104 / 112×144 | Tab 图标（另备 `-active`） / 地图分类 Marker |
| `assets/illustrations/header-map.png` | 1240×760 | 探索页老地图拼贴 |
| `assets/illustrations/profile-cover.png` | 1500×1120 | 我的页水彩封面 |
| `assets/illustrations/book.png` / `signpost.png` / `pin-map.png` | 400×360 / 400×320 / 360×320 | 史料页旧书羽毛笔 / 走街页路牌 / 走街页地图定位 |
| `assets/illustrations/empty-*.png` | 480×360 | 各空状态 |
| `assets/images/login-bg.jpg` | 1125×2436 | 登录页中山纪念亭 |
| `assets/images/sites/*.jpg` / `compare/*.jpg` | 750×450 / 750×500 | 12 个点位封面 / 今昔对比老照片与复原图 |

## 11. 验收总览

| 维度 | 摘要（详细清单在各阶段） |
|---|---|
| 导航与框架 | 4 Tab + 登录、注册可切换，自定义 TabBar 高亮正确 |
| 探索页与地图 | 头部拼贴、竖排书法、搜索按钮、地图、2×2 卡片位置与设计稿一致；marker 分 4 色，点击出 POI 卡，可进详情/打卡/收藏 |
| 史料页 | 5 个分类可筛选，陶土卡、角标、浏览/收藏数、箭头齐全 |
| 详情页 | 图集、今昔对比滑块、AI 复原、打卡、收藏、导航、分享 |
| 走街 | 4 条路线数据正确，进度条与已打卡数联动；路线详情有折线与序号 marker、时间轴联动；走街模式可定位、到点打卡、完成页生成海报 |
| 我的与用户中心 | 封面、头像、三项统计、5 项菜单与设计稿一致；打卡点/收藏/喜好/字体/隐私/消息/资料页可用，空状态完整；字体缩放全局生效并持久化 |
| 异常与适配 | 定位拒绝、登录过期、接口失败均有兜底；iPhone 14 Pro 与安卓中端机无横向滚动、无 TabBar 遮挡 |
| 质量与交付 | 控制台无报错、无未定义变量、无重复 setData；README 含运行步骤、Mock 账号、素材替换清单 |

## 12. 命名与口径禁忌

- **不得出现旧版页面路径**：`pages/heritage*`、`pages/street*`、`pages/mine*`，以及任何以 `heritage`、`street`、`mine` 命名的页面目录/路由/组件/字段。新路径只能是本文件第 5 节的 20 条。
- **不得出现模板遗留命名**：`quickstart`、`quickstart-wx-cloud`、`quickstartFunctions`、`pages/index/index`、`pages/example/index`、`pages/databaseGuide`、`components/cloudTipModal`、`goods`、`examples`、`business`、`usercenter`、`install_tip`、`cloud-tip-modal`、`sales` 集合。
- **不得把「埠藏史库」当产品名**：它只允许作为 slogan「埠藏史库，街绘行图」的一部分、或作为书法排版文案出现；小程序名、分享标题、README、代码注释一律用「埠影寻踪」。
- **不得出现济南地名**：济南老火车站、解放阁、洪家楼天主教堂、泉城路等一律清除；点位地名只用第 7.4 节清单与外马路/小公园/永平路/升平路/民权路/公园路。
- 分类标识固定 `kaibu` / `qiaoxiang` / `wenjiao` / `hongse`（Site、Route 共用，中文名见 7.1）；不得新增 `diplomacy` / `commerce` / `culture` / `red` / `ai` 旧枚举，也不得使用 `building` / `religion` / `folk`。
- 集合/模型命名固定 `Site`、`Route`、`Checkin`、`Favorite`、`Preference`、`Message`、`User`；Storage key 固定 `byxz_` 前缀；文案用中文品牌语汇（埠影、史库、街绘、走街、史料、点位、打卡、收藏），不用英文模板词。

## 13. 阶段索引

| 阶段 | 文件 | 范围 | 读取范围 |
|---|---|---|---|
| 00（可选） | `06-web-prototype-buildwebapps.md` | 用 Codex `build-web-apps` 插件生成浏览器视觉原型（`prototype/index.html`），冻结视觉后进入 01；不产出小程序代码 | 本文件 §4 + `docs/ui_design.html` + `docs/prd.md` §4/§7 |
| 01 | `01-scaffold-theme.md` | 工程骨架与设计系统：`app.js` / `app.json` / `app.wxss` / `sitemap.json`、自定义 TabBar 4 项、Token/字体/圆角/阴影、`utils/api.js` 骨架与 `USE_MOCK`、基础公共组件 | 本文件 + 01 |
| 02 | `02-explore-archive.md` | 探索页（拼贴头部、竖排书法、地图 + marker + POI 卡 + 2×2 入口卡、搜索）与史料页（分类胶囊、陶土卡、骨架/空态/加载更多） | 本文件 + 02 |
| 03 | `03-detail-walk.md` | 史料详情、专题聚合、AI 复原（含对比滑块）、走街页、路线详情、走街进行中（定位打卡 + 完成海报） | 本文件 + 03 |
| 04 | `04-auth-profile-user.md` | 登录、注册、我的页、用户中心二级页（打卡点/收藏/喜好/字体/隐私/消息/资料/设置/搜索） | 本文件 + 04 |
| 05 | `05-data-platform-acceptance.md` | 数据层收口：`mock/*`、`utils/api.js` 全量接口、数据模型字段、业务规则、平台能力落地、性能与验收走查 | 本文件 + 05 |
| 07（收尾） | `07-assets-swap.md` | 素材接入：把设计稿细节图与实拍照片按命名/尺寸接进 `assets/`，替换占位图；只改图片路径与 `mock` 字段，不动版式与 Token | 本文件 §10 + 07 |

- 会话行为约定见 `docs/codex-prompts/AGENTS.md`（复制到仓库根目录后由 Codex 自动加载）。
- 每阶段先复述「本段要实现什么」再写代码；实现顺序遵循「全局样式 → 公共组件 → 4 个 Tab → 登录/注册 → 详情与二级页」；阶段间不得修改本文件的路径、字段、色值、Token 名，确需变更先改本文件并同步下游。
