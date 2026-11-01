# 阶段 1：工程骨架、设计系统与公共基础组件
> 执行者只读：本文件 + `docs/codex-prompts/00-baseline.md`。不搜索、不参考任何已删除的旧代码，不读其他阶段文件。先复述「本阶段要做什么」，再写代码；路径、色值、Token、文案、字段均已给定，照抄，不要改名或换值。
## 1. 目标
1. 在 `miniprogram/` 尚不存在的空仓库中创建可编译、可启动的微信原生小程序骨架：`app.js`、`app.json`、`app.wxss`、`sitemap.json`。
2. 在 `app.json` 一次性注册全部 **20 条路由**（主包 6 页 + `detail`/`route`/`user` 三个分包）与自定义 TabBar 的 4 项。
3. 为 20 条路由建立最小空壳页（每页 4 文件），保证逐页打开不报「页面不存在」，4 个 Tab 可切换、TabBar 可见。
4. 落地设计系统：18 个色彩 Token、字体层级、书法渐变、圆角/阴影、通用类、`--fs` 字体缩放。
5. 落地 `app.js` 全局状态与启动流程、`custom-tab-bar/`、5 个基础组件、4 个 `utils/` 工具与 `utils/api.js` 骨架、`assets/` 占位目录。
6. 仅清理 `project.config.json` 的模板遗留项，保留既有 `appid`、`projectname`、`libVersion`。

## 2. 前置状态

- 仓库根 `d:\WaimaRoad` 已有 `project.config.json`、`project.private.config.json`、`docs/`、`README.md`、`uploadCloudFunction.sh`、`.gitignore`。
- `miniprogram/`、`cloudfunctions/` **都不存在**；本阶段只新建 `miniprogram/`，`cloudfunctions/` 不创建内容，仅保留 `cloudfunctionRoot` 配置。
- `project.config.json` 已有 `appid: "wx14264fd3b18c547f"`、`projectname: "WaimaRoad"`、`libVersion: "3.17.0"`、`miniprogramRoot: "miniprogram/"`、`cloudfunctionRoot: "cloudfunctions/"`、`compileType: "miniprogram"`；`condition` 各 `list` 为空；残留 `cloudfunctionTemplateRoot` 需清理。
- `docs/prd.md`、`docs/ui_design.html`、`docs/cloud-database.md` 与 `00-baseline.md` 已对齐，可互为校验；任何不一致以 `00-baseline.md` 为准。
- 仓库内**没有任何位图素材**：本阶段不绘制真实插画，只建立 `assets/` 目录与可编译占位文件，不引用外链图片。
- 本阶段不接云开发、不接后端、不写业务逻辑：`app.js` 不调用 `wx.cloud.init`，页面空壳只允许 `Page({})`。

## 3. 需创建的文件清单

| # | 路径 | 职责 | 完成度 |
| --- | --- | --- | --- |
| 1 | `miniprogram/app.js` | 全局状态、启动流程、窗口尺寸、登录态/字号/偏好读取、全局方法 | 完整实现 |
| 2 | `miniprogram/app.json` | 20 条路由、3 个分包、window、自定义 tabBar、permission | 完整实现 |
| 3 | `miniprogram/app.wxss` | 18 个 Token、字体层级、书法渐变、圆角/阴影、通用类 | 完整实现 |
| 4 | `miniprogram/sitemap.json` | 全量允许收录 | 完整实现 |
| 5 | `miniprogram/custom-tab-bar/index.{js,json,wxml,wxss}` | 4 项数据、`switchTab`、`selected` 同步、112rpx 米杏底栏 | 完整实现 |
| 6 | `miniprogram/components/{nav-bar,tab-icon,section-title,empty-state,skeleton}/index.*` | 各 4 文件：导航、图标、标题行、空状态、骨架屏 | 完整实现 |
| 7 | `miniprogram/utils/storage.js` | `byxz_` 前缀 key 集中管理与读写 | 完整实现 |
| 8 | `miniprogram/utils/auth.js` | 登录态、登录跳转、`redirect` 存取与消费 | 完整实现 |
| 9 | `miniprogram/utils/location.js` | 定位 Promise、Haversine 距离、打开设置 | 完整实现 |
| 10 | `miniprogram/utils/format.js` | 数字 `k/w`、距离、时间格式化 | 完整实现 |
| 11 | `miniprogram/utils/api.js` | `USE_MOCK`、统一 `{code,data,msg}`、300—600ms 延迟骨架 | 骨架（阶段 02 追加接口） |
| 12 | `miniprogram/assets/` | `images/ icons/ tabbar/ markers/ illustrations/` + 占位策略 | 目录 + 占位 |
| 13 | `miniprogram/pages/**`（20 条路由 × 4 文件） | 最小空壳，阶段 02—04 逐页替换 | 空壳 |
| 14 | `project.config.json` | 仅清理模板项 | 修改 |

- 每条路由固定 `index.js`、`index.wxml`、`index.wxss`、`index.json`，共 80 个页面文件；目录名只能是基线 §5 的 20 条路径。

## 4. 详细要求

### 4.1 清理 `project.config.json`
1. 保留：`appid`、`projectname: "WaimaRoad"`、`libVersion: "3.17.0"`、`compileType: "miniprogram"`、`miniprogramRoot`、`srcMiniprogramRoot`、`cloudfunctionRoot`、`setting.es6: true`、`setting.nodeModules: false`、`editorSetting.tabSize: 2`。
2. 删除 `cloudfunctionTemplateRoot`（指向不存在的 `cloudfunctionTemplate/`）；`condition.search / conversation / plugin / game / miniprogram` 的 `list` 全为 `[]`。
3. 不新增 npm 配置，不修改 `project.private.config.json`；改后自查不到 `quickstart`、`databaseGuide`、`cloudfunctionTemplate`。

### 4.2 编写 `app.json`（逐字使用）

```json
{
  "pages": ["pages/explore/index", "pages/archive/index", "pages/walk/index", "pages/profile/index", "pages/login/index", "pages/register/index"],
  "subpackages": [
    { "root": "subpackages/detail", "pages": ["pages/site-detail/index", "pages/topic/index", "pages/ai-restore/index"] },
    { "root": "subpackages/route", "pages": ["pages/route-detail/index", "pages/walking/index"] },
    { "root": "subpackages/user", "pages": ["pages/checkins/index", "pages/favorites/index", "pages/preferences/index", "pages/font/index", "pages/privacy/index", "pages/messages/index", "pages/profile-edit/index", "pages/settings/index", "pages/search/index"] }
  ],
  "window": {
    "backgroundColor": "#FCF7EE",
    "backgroundTextStyle": "dark",
    "navigationBarBackgroundColor": "#FCF7EE",
    "navigationBarTitleText": "埠影寻踪",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "custom": true,
    "color": "#333333",
    "selectedColor": "#333333",
    "backgroundColor": "#F0E0C7",
    "borderStyle": "white",
    "list": [
      { "pagePath": "pages/explore/index", "text": "探索", "iconPath": "assets/tabbar/explore.png", "selectedIconPath": "assets/tabbar/explore-active.png" },
      { "pagePath": "pages/archive/index", "text": "史料", "iconPath": "assets/tabbar/archive.png", "selectedIconPath": "assets/tabbar/archive-active.png" },
      { "pagePath": "pages/walk/index", "text": "走街", "iconPath": "assets/tabbar/walk.png", "selectedIconPath": "assets/tabbar/walk-active.png" },
      { "pagePath": "pages/profile/index", "text": "我的", "iconPath": "assets/tabbar/profile.png", "selectedIconPath": "assets/tabbar/profile-active.png" }
    ]
  },
  "permission": { "scope.userLocation": { "desc": "用于展示附近史迹并验证到点打卡" } },
  "requiredPrivateInfos": ["getLocation", "chooseLocation", "startLocationUpdate"],
  "__usePrivacyCheck__": true,
  "sitemapLocation": "sitemap.json",
  "style": "v2",
  "lazyCodeLoading": "requiredComponents"
}
```

- 路由合计必须正好 20 条：主包 6 + detail 3 + route 2 + user 9；分包 `pages` 用**相对 root** 的路径，不带 `subpackages/` 前缀。
- `"style": "v2"` 只用于新版组件样式；**不得**添加 `"renderer": "skyline"`、`"rendererOptions"` 或任何 Skyline 配置。
- 4 个 Tab 的 `pagePath` 必须同时在 `pages` 中；8 个图标文件名在本阶段固定，后续不得改名。
- `sitemap.json` 逐字为：`{ "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html", "rules": [{ "action": "allow", "page": "*" }] }`。

### 4.3 编写 `app.wxss`

**(1) 18 个色彩 Token 与派生变量，逐值写入 `page`：**

```css
page {
  --bg: #FCF7EE;         --bg-warm: #FBF6EC;
  --apricot: #FFE8C7;    --tan: #F0E0C7;
  --terracotta: #D98C75; --terracotta-deep: #B65A44;
  --coral: #F2AB9E;      --amber: #F0AD45;
  --teal: #00BAAD;       --blue: #1A91FA;
  --ink: #333333;        --ink-2: #666666;
  --ink-3: #999999;      --line: #E8DDCB;
  --chip: #CCCCCC;       --tag: #F7B878;
  --white: #FFFFFF;      --danger: #E05B4A;

  --fs: 1;
  --radius-sm: 8rpx;     --radius-card: 24rpx;
  --radius-pill: 44rpx;  --radius-sheet: 40rpx;
  --radius-entry: 20rpx; --radius-chip: 32rpx;
  --shadow-card: 0 8rpx 24rpx rgba(120, 90, 60, 0.08);
  --shadow-float: 0 12rpx 40rpx rgba(80, 55, 35, 0.16);
  --shadow-site: 0 8rpx 24rpx rgba(120, 90, 60, 0.10);

  background: var(--bg);
  color: var(--ink);
  font-family: "PingFang SC", "Helvetica Neue", sans-serif;
}
```

- 18 个 Token 名称与色值必须与基线 §4.2 一字不差；`--chip` 用于未选中胶囊、`--tag` 用于封面角标、`--tan` 用于 TabBar/地图外框。
- 圆角、阴影只能取上表变量；`--shadow-site` 仅用于史料卡，普通卡片用 `--shadow-card`。

**(2) 字体层级与书法渐变：**

| 类名 | 字号 / 行高 | 字重 | 用途 |
| --- | --- | --- | --- |
| `.text-calligraphy` | 64rpx / 1.15 | — | 书法主标题，`STKaiti, KaiTi, serif` + 陶土渐变 |
| `.t-page-title` | 44rpx / 1.3 | 700 | 详情页标题、登录「欢迎」 |
| `.t-card-title` | 34rpx / 1.4 | 600 | 史料名、路线名 |
| `.t-body` | 28rpx / 1.7 | 400 | 正文 |
| `.t-aux` | 24rpx / 1.5 | 400 | 副标题、标签、说明 |
| `.t-number` | 56rpx / 1.1 | 700 | 打卡数等，`DIN Alternate, Bebas Neue, sans-serif` |
| `.t-tab` | 22rpx / 1 | 500 | 探索/史料/走街/我的 |

```css
.text-calligraphy {
  font-family: "STKaiti", "KaiTi", serif; font-size: calc(64rpx * var(--fs)); line-height: 1.15;
  background: linear-gradient(180deg, #C9705A 0%, #B65A44 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
  filter: drop-shadow(1rpx 1rpx 0 rgba(182, 90, 68, 0.18));
}
.t-page-title { font-size: calc(44rpx * var(--fs)); line-height: 1.3; font-weight: 700; }
.t-card-title { font-size: calc(34rpx * var(--fs)); line-height: 1.4; font-weight: 600; }
.t-body { font-size: calc(28rpx * var(--fs)); line-height: 1.7; font-weight: 400; }
.t-aux { font-size: calc(24rpx * var(--fs)); line-height: 1.5; font-weight: 400; }
.t-number { font-family: "DIN Alternate", "Bebas Neue", sans-serif; font-size: calc(56rpx * var(--fs)); line-height: 1.1; font-weight: 700; }
.t-tab { font-size: calc(22rpx * var(--fs)); line-height: 1; font-weight: 500; }
```

- 字号数字必须与表格逐字一致，统一写成 `calc(基线字号 * var(--fs))`；书法标题优先切图，无切图时只能用上述渐变文字方案。

**(3) 通用类与动效：**

```css
.page {
  min-height: 100vh; box-sizing: border-box; background: var(--bg); color: var(--ink);
  font-family: "PingFang SC", "Helvetica Neue", sans-serif;
  font-size: calc(28rpx * var(--fs)); line-height: 1.7;
}
.page--tab { padding-bottom: calc(112rpx + env(safe-area-inset-bottom)); }
.safe-bottom { padding-bottom: calc(112rpx + env(safe-area-inset-bottom)); }
.safe-bottom--inner { padding-bottom: calc(40rpx + env(safe-area-inset-bottom)); }
.card { background: var(--apricot); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
.tap { min-width: 88rpx; min-height: 88rpx; }
.tap-scale { transition: transform 200ms cubic-bezier(.2, .8, .2, 1); }
.tap-scale:active { transform: scale(0.98); }
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ellipsis-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.divider { height: 1rpx; background: var(--line); }
.media-placeholder {
  display: flex; align-items: center; justify-content: center; letter-spacing: 2rpx;
  background: linear-gradient(135deg, #C9705A 0%, #B65A44 100%);
  color: var(--white); font-size: calc(30rpx * var(--fs)); font-weight: 600;
}
.fade-up { animation: fade-up 220ms cubic-bezier(.2, .8, .2, 1) both; }
button::after { border: none; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12rpx); } to { opacity: 1; transform: translateY(0); } }
@keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
```
- `.page` 只负责底色/字号/最小高度，Tab 页根节点再加 `.page--tab`；所有可点击元素点击区不小于 88rpx，小图标必须外包 `.tap`。
- 卡片按压统一 `scale(0.98)`，时长 180—240ms，缓动 `cubic-bezier(.2,.8,.2,1)`，不新增其他缓动曲线。
### 4.4 编写 `app.js`
```js
const storage = require('./utils/storage');
App({
  globalData: {
    token: '', isLogin: false, userInfo: null, fontScale: 1, preferences: null,
    statusBarHeight: 0, navBarHeight: 0, navTotalHeight: 0, safeAreaBottom: 0, windowWidth: 375, capsule: null
  },
  onLaunch() { this.initWindowMetrics(); this.restoreAuth(); this.restoreFontScale(); this.restorePreferences(); },
  initWindowMetrics() { /* 见下文规则：只算一次，Object.assign 写入 */ },
  restoreAuth() { /* 读 byxz_token / byxz_user（key 名与基线 §7.5 一致） */ },
  restoreFontScale() { /* 读 byxz_font_scale，校验 0.9—1.3 */ },
  restorePreferences() { /* 读 byxz_preferences，缺省 null */ },
  setFontScale(scale) { /* 夹取、取 1 位小数、写缓存、返回新值 */ },
  getPageStyle() { return '--fs:' + this.globalData.fontScale + ';'; },
  logout() { /* 清 token / userInfo / isLogin */ }
});
```
- `initWindowMetrics()` 用 `wx.getWindowInfo()`，不得写死状态栏：`statusBarHeight = info.statusBarHeight || 20`；`navBarHeight = Math.round(88 / 750 * windowWidth)`；`navTotalHeight = statusBarHeight + navBarHeight`；`safeAreaBottom = info.safeArea ? Math.max(0, info.screenHeight - info.safeArea.bottom) : 0`。`capsule` 用 `wx.getMenuButtonBoundingClientRect()`，包 `try/catch`，失败置 `null`；全部字段 `Object.assign` 一次性写入。
- 启动流程：`initWindowMetrics → restoreAuth → restoreFontScale → restorePreferences`；**不做**强制登录、不调用 `wx.cloud.init`、不请求定位、不发网络请求。
- 缓存 key 只能来自 `utils/storage.js` 的 `KEYS`；`setFontScale` 先 `Number` 再夹取 0.9—1.3、保留两位小数（步进 0.05，与阶段 04 字体设置页一致）、写 `byxz_font_scale` 并返回新值。
- 页面在 `onShow` 读取 `app.globalData.fontScale`，根节点写 `style="{{pageStyle}}"`，保证切换后当前页立即生效、重进仍保留；页面数据（如 `selectedCategory`）不放进 `globalData`。
### 4.5 实现 `custom-tab-bar/`
1. `index.json`：`{ "component": true, "usingComponents": { "tab-icon": "../components/tab-icon/index" } }`。
2. 4 项固定：`/pages/explore/index`→`探索`→`explore`、`/pages/archive/index`→`史料`→`archive`、`/pages/walk/index`→`走街`→`walk`、`/pages/profile/index`→`我的`→`profile`。
3. `onTap` 从 `e.currentTarget.dataset` 取 `index`、`path`，先 `this.setData({ selected: index })`，再 `wx.switchTab({ url: path })`；禁止 `navigateTo`。
4. `index.wxml`：`<view class="tabbar">` 内 `wx:for` 4 个 `tabbar__item`，每项渲染 `<tab-icon name="{{item.name}}" label="{{item.text}}" active="{{selected === index}}" />`。
5. `index.wxss`：`position: fixed; left/right/bottom: 0; z-index: 100`；`height: calc(112rpx + env(safe-area-inset-bottom))`；`padding-bottom: env(safe-area-inset-bottom)`；`background: #F0E0C7`；4 等分、无圆角/阴影/上边框，滚动时不隐藏、不变透明。
6. 图标 52rpx、标签 22rpx `#333`；选中图标 `scale(1.06)`、标签 `font-weight: 600`，未选中 `opacity: 0.9`。
7. 页面同步高亮：4 个 Tab 页 `onShow` 执行 `if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 0 }); }`（史料 1、走街 2、我的 3），不在 `app.js` 集中管理。
### 4.6 实现 5 个基础组件（每个 4 文件，`index.json` 均为 `{"component": true}`）
**nav-bar**
- props：`title`（String）、`transparent`（Boolean，默认 false）、`showBack`（Boolean，默认 true）、`fixed`（Boolean，默认 true）；事件 `back`（`triggerEvent('back')`，组件内部不自动 `navigateBack`）；`<slot name="right">` 承载分享/收藏。
- `attached` 取 `wx.getWindowInfo()` 与 `wx.getMenuButtonBoundingClientRect()`：容器 `padding-top: statusBarHeight px`，导航条高 88rpx，右侧留白 = `windowWidth - capsule.left + 8` px，保证插槽不被胶囊压住。
- 样式：默认米色底 `var(--bg)`，`transparent` 时透明；标题 34rpx/600 `var(--ink)` 绝对居中；返回钮 64rpx 圆形（透明底时 `rgba(0,0,0,.35)`）、箭头 44rpx 白色；总高 = 状态栏 + 88rpx。
**tab-icon**
- props：`name`（`explore | archive | walk | profile`）、`label`（String）、`active`（Boolean）。
- 输出 52rpx 图标 + 22rpx 标签（纵向，`gap: 4rpx`，标签 `#333333`）；本阶段图标用 CSS 占位（圆/三角/方形组合，颜色取 `--blue`、`--teal`、`--terracotta`、`--danger`，粗描边 + 局部填色）。
- 选中：图标 `scale(1.06)`、标签 `font-weight: 600`；未选中 `opacity: 0.9`；后续换 `assets/tabbar/*.png` 只改组件内部。
**section-title**
- props：`title`（String）、`calligraphy`（Boolean，默认 false）、`more`（String，空则不显示）；事件 `more`。
- 样式：左标题 36rpx/600 `var(--ink)`（`calligraphy` 用 `.text-calligraphy`）；右侧「更多」24rpx `var(--ink-3)` + 8rpx 箭头，点击区 ≥88rpx；组件不写死外边距，左右 48rpx 由父容器控制。
**empty-state**
- props：`image`（String，可为空）、`title`（String）、`desc`（String）、`actionText`（String，空则不显示按钮）；事件 `action`。
- 布局：居中；插画区 360×280rpx，`image` 为空时用米色圆角块 + 陶土线性图形占位，不出现「图片待替换」等工程字样；主文案 28rpx/600 `var(--ink)`，副文案 24rpx `var(--ink-3)` 最多两行。
- 按钮高 88rpx、胶囊 `--radius-pill`、背景 `var(--apricot)`、文字 `var(--terracotta-deep)` 28rpx/600。
**skeleton**
- props：`type`（`card | list | detail`，默认 `list`）、`count`（Number，默认 3）；无事件。`list` 固定 3 张卡，`card` 1 张，`detail` 1 张大图 + 3 行文字。
- 卡片骨架：封面块 654×390rpx（`--tan`）、标题条 60%、描述条 90%/70%、底部行 96rpx；圆角 24rpx、无阴影；占位色只用 `--tan`、`--bg-warm`、`--line`。
- 动画：`animation: breathe 1.2s ease-in-out infinite`，透明度 0.55—1，不得使用旋转/位移。

### 4.7 实现 `utils/`

| 文件 | 必须导出 | 约定 |
| --- | --- | --- |
| `storage.js` | `KEYS`、`get`、`set`、`remove` | key 全部 `byxz_` 前缀，**逐字使用基线 §7.5 的 14 个 key**：`byxz_token`、`byxz_user`、`byxz_redirect`、`byxz_font_scale`、`byxz_font_follow_system`、`byxz_preferences`、`byxz_privacy`、`byxz_search_history`、`byxz_favorites`、`byxz_checkins`、`byxz_view_log`、`byxz_walk_progress`、`byxz_subscribe`、`byxz_locationTip`；`get/set` 内 `try/catch`，失败返回默认值并 `console.warn` |
| `auth.js` | `getToken`、`isLogin`、`saveLogin`、`clearLogin`、`saveRedirect`、`takeRedirect`、`goLogin` | `saveLogin(token, userInfo)` 同时写 Storage 与 `getApp().globalData`；`goLogin(redirect)` 拼 `/pages/login/index?redirect=` + `encodeURIComponent(路径+参数)`；`takeRedirect()` 读出后立即删除 |
| `location.js` | `requestLocation`、`getDistance`、`openSetting` | `requestLocation()` 返回 Promise，内部 `wx.getLocation({ type: 'gcj02' })`，拒绝时 `reject` 不弹 Toast；`getDistance` 用 Haversine 返回米；`openSetting()` 返回 Promise |
| `format.js` | `formatCount`、`formatDistance`、`formatTime`、`padZero` | `formatCount`：<1000 原样；≥1000 一位小数 `k` 并去掉 `.0`（1500→`1.5k`、2600→`2.6k`）；≥10000 一位小数 `w`（12000→`1.2w`）；`formatDistance`：<1000→`320m`，≥1000→`1.2km`；`formatTime`→`YYYY-MM-DD HH:mm` |
| `api.js` | `USE_MOCK`、`ok`、`fail`、`mock`、`request` | `USE_MOCK = true`；`ok(data)` 返回 `{ code: 0, data, msg: 'ok' }`；`mock(build)` 在 300—600ms 随机延迟后 resolve `ok`；`request` 仅在 `USE_MOCK === false` 时走 `wx.request` |
- 本阶段 `api.js` **不得** `require('../mock/sites')`（`mock/` 阶段 02 才存在），否则编译失败；具体接口阶段 02 追加。
- 页面禁止直接 `wx.getStorageSync` 或复制 `formatCount`，一律走 `storage.js` / `format.js`。
### 4.8 建立 `assets/` 与占位策略
```
miniprogram/assets/
├─ images/sites/        # .gitkeep，12 张 750×450 点位封面
├─ images/compare/      # .gitkeep，老照片 / AI 复原图 750×500
├─ icons/               # .gitkeep，通用图标
├─ tabbar/              # 8 个 104×104 PNG：explore/archive/walk/profile 及 -active
├─ markers/             # 4 个 112×144 PNG：kaibu/qiaoxiang/wenjiao/hongse（阶段 02 生成）
└─ illustrations/       # .gitkeep：header-map.png、book.png、signpost.png、pin-map.png、empty-*.png
```

1. `app.json` 引用的 8 个 Tab PNG **必须真实存在**，否则自定义 TabBar 校验失败；用一次性脚本（Node/PowerShell 写 Base64，不新增依赖、不提交脚本）生成 1×1 透明 PNG 占位，正式图标按 104×104 替换。
2. Tab 图标的可见图形由 `tab-icon` 的 CSS 占位绘制，不依赖占位 PNG 内容。
3. 缺图禁止 `<image src="">` 或外链，统一用 `.media-placeholder` 渐变底 + 建筑名文字；12 张封面由阶段 02 把 `cover` 置空字符串触发占位分支。
4. 空目录放 `.gitkeep`；不得创建 `miniprogram_npm/`、`package.json`、`node_modules/`。

### 4.9 建立 20 个页面空壳
1. 按基线 §5 的 20 条路径逐条建目录，每个目录 4 文件。
2. `index.js` 仅 `Page({});`（Tab 页暂不写 `getTabBar` 同步）；`index.wxml` 为 `<view class="page"></view>`，4 个 Tab 页用 `<view class="page page--tab"></view>`。
3. `index.wxss` 留空；`index.json` 统一 `{ "navigationStyle": "custom", "navigationBarTitleText": "<页面中文名>" }`，探索、史料、走街追加 `"enablePullDownRefresh": true`。
4. 20 个标题依次为：探索、史料、走街、我的、登录、注册、史料详情、专题聚合、AI 复原影像、路线详情、走街进行中、我的打卡点、我的收藏、喜好设置、字体设置、隐私设置、消息、编辑资料、设置、搜索。
## 5. 数据与文案

| 项 | 值 |
| --- | --- |
| 小程序名 / 导航标题 | `埠影寻踪` |
| 副标题 / Slogan | `埠藏史库，街绘行图` |
| 4 个 Tab 文字 | `探索`、`史料`、`走街`、`我的` |
| 页面底色 | `#FCF7EE` |
| 导航栏配色 | 背景 `#FCF7EE`、文字 `black`、`backgroundTextStyle: "dark"` |
| TabBar 配色 | 背景 `#F0E0C7`、文字 `#333333`、`borderStyle: "white"` |
| 默认字体缩放 | `fontScale: 1`（0.9—1.3，步进 0.05，保留两位小数） |
| 缓存 key | 见基线 §7.5，共 14 个；本阶段至少要建 `byxz_token`、`byxz_user`、`byxz_redirect`、`byxz_font_scale`、`byxz_preferences`、`byxz_locationTip` |
| 返回 / Tab 切换 | `wx.navigateBack()` / `wx.switchTab` |
- 产品名一律「埠影寻踪」；「埠藏史库」「街绘行图」只允许作为 Slogan 与书法排版文案，不得当页面标题或小程序名。
- 本阶段不写「页面建设中」等临时文案，空壳不显示文字；可见文案在阶段 02—04 落地。
## 6. 验收标准
- [ ] `miniprogram/` 根下有 `app.js`、`app.json`、`app.wxss`、`sitemap.json`，`custom-tab-bar/`、`components/`、`utils/`、`assets/` 均已建立。
- [ ] `app.json` 可被 `JSON.parse`；`pages` 长度 6、`subpackages` 长度 3、路由合计 20 条且顺序与基线 §5 一致；不含 `heritage`、`street`、`mine`、`pages/index/index`、`pages/example/index`。
- [ ] `tabBar.custom === true`，`list` 恰 4 项，`pagePath`/`text` 与 4.2 一致，8 个图标文件均存在。
- [ ] `window` 5 个键值与 4.2 完全一致；`style` 为 `"v2"`、无 Skyline 配置；`lazyCodeLoading` 为 `"requiredComponents"`。
- [ ] `permission.scope.userLocation.desc` 为「用于展示附近史迹并验证到点打卡」；`requiredPrivateInfos` 含三个接口；`__usePrivacyCheck__` 为 `true`。
- [ ] `app.wxss` 的 `page` 含全部 18 个色彩变量，名称与色值与基线 §4.2 逐字相同。
- [ ] `app.wxss` 含 `--fs`、6 个圆角/阴影变量、7 个字体类、`.text-calligraphy` 陶土渐变、`.page`、`.page--tab`、`.safe-bottom`、`.tap`、`.card`、`.media-placeholder` 与两个关键帧。
- [ ] `app.js` 含 `token/isLogin/userInfo/fontScale/preferences/statusBarHeight/navBarHeight/navTotalHeight/safeAreaBottom/windowWidth/capsule`，`fontScale` 默认 `1`。
- [ ] `app.js` 用 `wx.getWindowInfo()` 换算 88rpx 导航高度，不写死 `20px/44px`，胶囊取值有 `try/catch`；不调用 `wx.cloud.init`、不强制登录。
- [ ] `setFontScale` 夹取 0.9—1.3、保留两位小数、写 `byxz_font_scale`；`getPageStyle()` 返回 `--fs:<值>;`。
- [ ] `custom-tab-bar` 4 项可切换、高亮同步；高度 `112rpx + env(safe-area-inset-bottom)`、背景 `#F0E0C7`、无圆角/阴影/上边框。
- [ ] 5 个组件均为 4 文件、`index.json` 含 `"component": true`；`nav-bar` 在刘海屏与胶囊下不遮挡内容。
- [ ] `utils/storage.js` 所有 key 以 `byxz_` 开头；`formatCount(2600) === '2.6k'`、`formatCount(12000) === '1.2w'`；`api.js` 有 `USE_MOCK = true` 且不 require `mock/`。
- [ ] 20 条路由均可在模拟器打开，控制台无红色报错；4 个 Tab 页底部不被 TabBar 遮挡，滚动时 TabBar 不隐藏。
- [ ] `project.config.json` 的 `appid`、`libVersion`、`projectname` 未变，`cloudfunctionTemplateRoot` 已删除。
- [ ] 全仓库 grep 不到 `quickstart`、`databaseGuide`、`goods`、`examples`、`business`、`usercenter`、`heritage`、`street`、`mine`、`cloudTipModal`、`install_tip`。

## 7. 约束与禁止事项
### 7.1 硬约束
1. 只用微信原生小程序语法（JavaScript ES6 + WXML + WXSS），禁止 Taro / uni-app / React / TypeScript / 构建工具。
2. 零 npm：不建 `package.json`、`package-lock.json`、`node_modules/`、`miniprogram_npm/`；不 require 第三方包。
3. 只使用 WebView 渲染，禁止 Skyline；`style` 保持 `"v2"`，不添加 `renderer` 字段。
4. 色值只允许两种来源：`app.wxss` 的 18 个 Token 与 `app.json` 已写死的 TabBar/window 值；组件不得写死主题色，统一用 `var(--*)`。
5. 路径、字段、Token 名、分类 key 一律以 `00-baseline.md` 为准，需要新增先改基线再改本文件。
6. 设计基准 750rpx；左右边距 48rpx、卡片间距 24rpx、区块间距 40rpx、最小间距 8rpx；不新增字号/间距体系。

### 7.2 常见错误（必须规避）

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 自定义 TabBar 只写 `custom: true` 而漏 `list` | 编译警告、Tab 无法切换 | 保留 4 项 `pagePath`/`text`/图标 |
| `app.json` 引用不存在的 Tab 图标 | 校验失败或裂图 | 先落地 8 个占位 PNG |
| 页面文件数与路由不一致 | 「页面不存在」 | 20 条路由 × 4 文件全部创建 |
| 在 `app.js` 写死 `statusBarHeight: 20` | 刘海屏/胶囊遮挡 | 用 `wx.getWindowInfo()` + 88rpx 换算 |
| 用 `navigateTo` 打开 4 个 Tab 页 | 报「can not navigateTo a tabbar page」 | 一律 `wx.switchTab` |
| 页面直接 `require('../../mock/sites')` | 绕过 `api.js`，阶段 05 无法切后端 | 页面只调 `api` |
| 把 `--fs` 写死为 1 | 字体设置无效 | 页面根节点注入 `app.getPageStyle()` |
| 引入第三方 UI 库或图标库 | 违反零依赖约束 | 手写组件与 CSS 占位 |

### 7.3 禁止事项
1. 禁止修改 `appid`、`libVersion`、`projectname`、`project.private.config.json`；禁止删除或改写 `docs/`、`README.md`、`uploadCloudFunction.sh`。
2. 禁止创建 `mock/`、`pages/explore` 以外的业务内容；本阶段只建空壳，不实现探索/史料页面。
3. 禁止旧版命名：`heritage`、`street`、`mine`、`heritageDetail`、`aiCompare`、`streetMap`，以及 `pages/index/index`。
4. 禁止济南地名（济南老火车站、解放阁、洪家楼天主教堂、泉城路等），点位只属于汕头小公园开埠区。
5. 禁止把「埠藏史库」当产品名、小程序名或页面标题，只能作为 Slogan 与书法排版文案。
6. 禁止引用外链图片、网络字体、Lottie；禁止给空壳页写真实交互、登录拦截、定位请求（属于阶段 02—04）。
