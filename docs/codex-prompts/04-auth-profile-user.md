# 阶段 4：登录、注册、我的页与用户中心二级页

> 执行者只读：本文件 + `docs/codex-prompts/00-baseline.md`。先复述「本阶段要实现什么」，再写代码。所有路径、色值、文案、字段、Storage key 均已给定，照抄执行，禁止改名改值。旧的阶段 4 提示词已整体作废（与基线冲突），不得参照、不得复用其中任何名称。

## 1. 目标

1. 补全主包 3 页：`pages/login/index`（账号密码 + 微信/QQ 第三方入口）、`pages/register/index`（创建账号）、`pages/profile/index`（我的 Tab 页）。
2. 在 `subpackages/user/pages/` 下创建 9 个二级页：`checkins`、`favorites`、`preferences`、`font`、`privacy`、`messages`、`profile-edit`、`settings`、`search`。
3. 建立 `mock/user.js`（用户 / Mock 账号 / 打卡 / 收藏 / 偏好 / 消息），页面只调 `utils/api.js`，不直接 import `mock/`。
4. 收口登录态：`utils/auth.js` 提供 token 存取、用户读写、登录拦截、`redirect` 回跳；只拦「打卡、收藏、走街开始、我的数据」，浏览与搜索放行。
5. 落地字体缩放（`--fs` + `fontScale`）、偏好、隐私、搜索历史的本地持久化，全部使用 `byxz_` 前缀 key。

## 2. 前置状态

- 阶段 01–03 已完成：`app.js` / `app.json` / `app.wxss`、自定义 TabBar、`nav-bar` / `tab-icon` / `section-title` / `empty-state` / `skeleton` / `site-card` / `filter-chips` / `route-card` 组件、`utils/api.js`（`USE_MOCK` 开关 + 统一 `{ code, data, msg }` + 300—600ms 延迟）、`utils/format.js`、`utils/storage.js`、`pages/explore`、`pages/archive`、`pages/walk`、`subpackages/detail/*`、`subpackages/route/*`。
- `utils/auth.js` 已有登录态存储接口雏形（`getToken` / `isLoggedIn` / `getUser`），本阶段按第 5.1 节补齐签名，**不得新建第二个 auth 模块**。
- `app.json` 已按基线第 5 节注册 20 条路由；缺 `pages/register/index` 与 9 个 user 分包页时补注册，不改动既有条目与顺序。
- `app.js` 的 `globalData` 需含 `token`、`userInfo`、`fontScale`；启动时从 `byxz_token` / `byxz_user` / `byxz_font_scale` 回填；提供 `getFontScale()` / `setFontScale(v)`（若阶段 01 遗留 `getFontSize/setFontSize`，本阶段统一改名，不留双套）。
- `utils/api.js` 已实现接口：`POST /auth/login`、`POST /auth/register`、`POST /auth/wechat`、`GET /sites`、`GET /me`、`PATCH /me`、`GET /me/checkins`、`GET /me/favorites`、`GET /messages`；缺口按第 4.13 节补。
- 依赖资源：`assets/images/login-bg.jpg`（1125×2436）、`assets/illustrations/profile-cover.png`（1500×1120）、`assets/illustrations/empty-*.png`（480×360）。缺图按基线占位规则（暖灰或陶土渐变 + 居中白色文案 + 右下「图片待替换」），禁止外链。

## 3. 需创建的文件清单

共 49 个文件：主包 3 页 ×4 = 12，分包 9 页 ×4 = 36，Mock 1。

| # | 页面 / 文件 | 路径 | 职责 |
|---|---|---|---|
| 1 | `pages/login/*` | `miniprogram/pages/login/` | 全屏照片背景、欢迎标题、账号/密码下划线表单、掩码切换、主蓝登录按钮、忘记密码、注册入口、微信/QQ 图标、`redirect` 回跳 |
| 2 | `pages/register/*` | `miniprogram/pages/register/` | 遮罩背景 + 白色表单卡、白色返回箭头、昵称/手机号/验证码/密码/确认密码、协议勾选、注册并登录 |
| 3 | `pages/profile/*` | `miniprogram/pages/profile/` | 手绘封面、头像昵称两态、三列统计、浅杏菜单卡 5 项、设置与消息入口、下拉刷新统计 |
| 4 | `subpackages/user/pages/checkins/*` | 分包 `user` | 列表/地图双视图、统计条、分类筛选、空状态、点击进详情 |
| 5 | `subpackages/user/pages/favorites/*` | 分包 `user` | 四 Tab、复用史料卡、取消收藏、编辑态批量取消、左滑删除、分页、空状态 |
| 6 | `subpackages/user/pages/preferences/*` | 分包 `user` | 主题 2×2 大卡、推荐偏好 5 档滑块、3 个通知 Switch、内容显示 2 项、保存 |
| 7 | `subpackages/user/pages/font/*` | 分包 `user` | 三级文字预览、三档位、0.9—1.3 滑块、跟随系统 Switch、恢复默认 |
| 8 | `subpackages/user/pages/privacy/*` | 分包 `user` | 定位授权、足迹可见性、展示方式、缓存清理、数据导出、注销、协议与版本 |
| 9 | `subpackages/user/pages/messages/*` | 分包 `user` | 系统/互动两 Tab、未读红点、全部已读、点击跳转、空状态 |
| 10 | `subpackages/user/pages/profile-edit/*` | 分包 `user` | `chooseAvatar` 头像、`type="nickname"` 昵称、脱敏手机号更换、50 字简介计数、保存 |
| 11 | `subpackages/user/pages/settings/*` | 分包 `user` | 账号与安全、清除缓存、关于我们、隐私政策、用户协议、退出登录 |
| 12 | `subpackages/user/pages/search/*` | 分包 `user` | 搜索框、历史（≤10）、热门词、300ms 防抖、分组结果、关键词高亮、空结果 |
| 13 | `mock/user.js` | `miniprogram/mock/` | 导出 `mockUser` / `mockAccount` / `mockCheckins` / `mockFavorites` / `mockPreferences` / `mockMessages` |

- 每页固定 4 文件 `index.js` / `index.wxml` / `index.wxss` / `index.json`；分包引用组件路径为 `../../../../components/<name>/index`（checkins→pages→user→subpackages→miniprogram 四级），主包为 `../../components/<name>/index`。
- `index.json`：`login`、`register` 仅 `{"navigationStyle":"custom"}`；`profile` 为 `{"navigationStyle":"custom","navigationBarTitleText":"我的","enablePullDownRefresh":true}`；其余 9 页 `navigationStyle: "custom"` + 标题「我的打卡点」「我的收藏」「喜好设置」「字体设置」「隐私设置」「消息」「编辑资料」「设置」「搜索」，并按需注册 `nav-bar` / `empty-state` / `section-title` / `site-card` / `skeleton`。
- 不创建任何新页面、新组件、新工具文件；协议与隐私政策用半屏弹层承载本地文案（基线路由表只有 20 条，禁止新增路由）。

## 4. 各页面详细要求

### 4.1 登录页 `pages/login/index`

**布局（自上而下，逐值照抄）**

| 区域 | 要求 |
|---|---|
| 背景 | `<image>` 铺满 `inset:0`、`mode="aspectFill"`，`assets/images/login-bg.jpg`（汕头小公园中山纪念亭仰拍）；顶部叠 `linear-gradient(180deg, rgba(255,255,255,.35), transparent 30%)`，底部叠 `rgba(0,0,0,.18)`；无导航栏，状态栏透明黑图标 |
| 标题区 | 左边距 `56rpx`，距顶约 `300rpx`；「欢迎」「请登录账号」各占一行，`44rpx` / `700` / `#111` / `line-height:1.5` / `letter-spacing:2rpx` |
| 表单区 | 距顶约 `46%`；「标签在上、输入在下划线之上」；标签 `24rpx`、白色 85% 透明 |
| 账号输入 | 高 `88rpx`，文字 `30rpx` `#111`，占位「请输入账号 / 手机号」，占位色 `rgba(255,255,255,.7)`；下划线 `1rpx` `rgba(255,255,255,.85)`，宽约 `600rpx` |
| 密码输入 | 同上；右侧 `44rpx` 眼睛图标切换明文/密文，密文用 `•`；两字段间距 `48rpx` |
| 主按钮 | `600rpx × 88rpx`、圆角 `44rpx`、背景 `#1A91FA`、文字「登录」`32rpx` / 白 / `600` 居中，距密码下划线 `96rpx`；`:active` 亮度 `0.95` |
| 辅助行 | 宽 `600rpx`、两端对齐；左「忘记密码?」右「注册」，`24rpx`、白色 90% |
| 第三方 | 距底部安全区 `80rpx`，居中排列微信、QQ 图标各 `48rpx`、间距 `120rpx`；图标为本地 `assets/icons/wechat.png` / `qq.png`（缺失时用同尺寸圆形占位块 + 文字），图标下方 `24rpx` 协议文案「登录即代表同意《用户协议》《隐私政策》」 |

**交互与功能**

- 校验：账号 ≥ 4 位、密码 ≥ 6 位，`bindblur` 即校验；失败时下划线变 `#E05B4A` 并显示 `22rpx` 错误文案。
- 登录中：按钮文字变「登录中…」并禁用重复点击，左侧 `32rpx` Loading。
- 登录成功：`auth.login({ token, userInfo })` 写 `byxz_token` / `byxz_user` 与 `globalData`；`wx.showToast({ title: '欢迎回来' })`；随后按第 5.3 节执行 `redirect` 回跳。
- 登录失败：`wx.showToast({ title: '账号或密码不正确', icon: 'none' })`，表单左右抖动 `300ms`（`animation`）。
- 已登录进入本页：直接 `wx.navigateBack()`，无上一页则 `wx.switchTab({ url: '/pages/profile/index' })`。
- 「忘记密码」：本页半屏弹窗输入手机号 + 验证码（Mock 固定 `123456`）→ 重置密码（仅 Toast「密码已重置」，不写后端字段）。
- 「注册」：`wx.navigateTo({ url: '/pages/register/index' })`。
- 微信登录：先 `wx.requirePrivacyAuthorize`，成功后 `wx.login` 取 `code` → `api.post('/auth/wechat', { code })` → Mock 返回 `{ token, userInfo }`，首次自动建号；失败 Toast「微信登录失败，请稍后重试」。
- QQ 图标：`wx.showToast({ title: '请使用微信登录', icon: 'none' })`，不做任何授权请求。
- Mock 账号：`baibianwaimatu` / `123456`（必须在本文与 README 中一致）。

### 4.2 注册页 `pages/register/index`

| 区域 | 要求 |
|---|---|
| 背景 | 同登录页照片 + `rgba(0,0,0,.35)` 遮罩，突出白色表单卡 |
| 顶部 | 返回箭头（白色 `44rpx`，点击区 ≥ `88rpx`）+ 标题「创建账号」`36rpx` 白色 |
| 表单卡 | 白色、圆角 `32rpx`、左右 `48rpx`、内边距 `40rpx`；下划线输入，标签在上 |
| 字段 | 昵称 / 手机号 / 验证码（右侧「获取验证码」，`60s` 倒计时） / 密码 / 确认密码 |
| 协议行 | `16rpx` 圆角复选框 + 「我已阅读并同意《用户协议》《隐私政策》」，点击协议名弹出半屏富文本弹层（本地文案，不新增路由） |
| 按钮 | 「注册并登录」主蓝胶囊（同登录按钮规格）；未勾选协议时 `opacity:.5`，点击 Toast「请先阅读并同意用户协议」 |

- 校验规则：昵称 2—12 字、手机号 11 位、验证码 6 位、密码 ≥ 6 位、两次密码一致；逐字段失焦校验，错误文案 `22rpx` `#E05B4A`。
- 提交：`api.post('/auth/register', { nickname, phone, code, password })`；成功即 `auth.login(...)` 并 Toast「注册成功」，再按第 5.3 节回跳（有 `redirect` 回跳，无 `redirect` 切「我的」；上传文档写作「跳探索」，以基线第 5 节「无 redirect 时回我的」为准）。
- 手机号已注册：Toast「该手机号已注册，请直接登录」并停留本页，提供「去登录」文字按钮。
- 验证码按钮：点击后倒计时 `60s`，期间禁用并显示 `{{countdown}}s`；倒计时结束恢复「获取验证码」；本阶段不真实发短信，Toast「验证码已发送（Mock：123456）」。

### 4.3 我的页 `pages/profile/index`

**布局**

| 区域 | 要求 |
|---|---|
| 封面 | 高 `560rpx` 全幅水彩插画（`profile-cover.png`，右侧小公园亭、左侧骑楼街景、整体泛黄）；顶部叠 `40rpx` 白色渐隐 |
| 右上角 | 齿轮（设置）、消息气泡两个 `44rpx` 白色图标，各带 `64rpx` 半透明黑底圆，距右 `40rpx`、距顶 `88rpx`、间距 `24rpx`；消息带红点（有未读时显示） |
| 用户信息 | 头像 `128rpx` 圆形、白 `4rpx` 描边、距左 `48rpx`，垂直位置压在封面下沿上方 `40rpx`；右侧昵称 `40rpx` 白色 `700`，下方手机号/ID `26rpx` 白色 85%，脱敏 `138****1234` |
| 未登录态 | 灰色默认头像，昵称「点击登录」，副文案「登录后记录你的足迹」 |
| 内容层 | 从 `560rpx` 起、向上压 `48rpx`、背景 `#FCF7EE`、顶部圆角 `48rpx`、内边距 `48rpx` |
| 统计卡 | `#FFFFFF`、圆角 `24rpx`、高 `176rpx`、三等分垂直居中；数字 `56rpx` `#F0AD45` `700`（`DIN Alternate, Bebas Neue, sans-serif`），标签 `24rpx` `#666`、间距 `8rpx` |
| 菜单卡 | `#FFE8C7`、圆角 `24rpx`、上边距 `32rpx`、`overflow:hidden`；5 行每行高 `112rpx`，左图标 `44rpx` + 文字 `30rpx` `#333`，右箭头 `32rpx` `#B9A98F`；行间 `1rpx rgba(0,0,0,.08)`，末行无分割线 |

**三列统计的真实数据来源**

- 登录后并行请求 `api.getMyCheckins()` 与 `api.getMyFavorites()`，本地聚合：打卡数 = 打卡记录条数（累计次数）、收藏数 = 收藏列表长度、足迹数 = 打卡记录中 `siteId` 去重后的数量。
- 未登录、接口失败或超时：三项一律显示 `0`，**禁止写死任何数字**；`onShow`、登录成功后、`onPullDownRefresh` 各刷新一次。
- 数字滚动动画：`0 → 目标值` 共 `600ms`（`requestAnimationFrame` 或 `setInterval` 分帧 `setData`，避免逐帧重建整页）。
- 整卡可点：打卡数 → `checkins`、收藏数 → `favorites`、足迹数 → `checkins?view=map`。

**菜单（顺序与图标固定）**

| # | 标题 | 图标 | 跳转 |
|---|---|---|---|
| 1 | 我的打卡点 | 珊瑚色定位 pin `#F2AB9E` | `/subpackages/user/pages/checkins/index` |
| 2 | 我的收藏 | 薄荷绿书签加号 | `/subpackages/user/pages/favorites/index` |
| 3 | 喜好设置 | 红色爱心 `#E05B4A` | `/subpackages/user/pages/preferences/index` |
| 4 | 字体设置 | 黑色「T」字形 | `/subpackages/user/pages/font/index` |
| 5 | 隐私设置 | 深灰齿轮 `#666666` | `/subpackages/user/pages/privacy/index` |

- 图标为粗描边 + 局部填色的本地 PNG（`assets/icons/`）；缺图时用同尺寸圆形底 + 单字/emoji 占位，并登记替换清单，禁止线性单色图标与外链。
- 点击头像/昵称：已登录 → `profile-edit`；未登录 → `login`。
- 齿轮 → `settings`；消息气泡 → `messages`。
- 菜单项 1—5 与统计卡点击均属「我的数据」：未登录时统一走 `auth.requireLogin({ redirect })`（第 5.3 节），**不得**先跳页再判断。
- 分享：`onShareAppMessage` 标题带品牌「埠影寻踪」，路径回本页；「我的老城足迹」海报为可选项，本阶段不做 Canvas。

### 4.4 我的打卡点 `subpackages/user/pages/checkins/index`

- 自定义导航（`nav-bar`）：返回 + 标题「我的打卡点」+ 右侧「地图」文字按钮（列表态）/「列表」文字按钮（地图态）。
- 顶部统计条：浅杏 `#FFE8C7` 卡片，三项「打卡总数 / 去重点位 / 连续打卡天数」，数字 `40rpx` `#F0AD45` `700`，标签 `24rpx` `#666`；连续天数按打卡日期去重后计算连续段。
- 列表视图：按 `time` 倒序；每张卡左 `160rpx` 方形封面（`aspectFill`，缺图走占位），右侧点位名 `32rpx` `#333` `600`、分类标签（`8rpx` 圆角、`22rpx`）、打卡时间、「第 N 次打卡」`24rpx` `#999`。
- 时间格式：今天 `14:32` 显示「今天 14:32」，前一天显示「昨天」，更早显示 `2026.10.01`；统一由 `utils/format.js` 的 `formatCheckinTime` 输出。
- 地图视图：全屏 `<map>`，中心点取已打卡点位集合的中点，仅显示已打卡点位，marker 用分类 pin + 勾选角标；点击 marker 弹底部小卡（封面对位 + 名称 + 时间 + 「查看详情」）。
- 分类筛选：`filter-chips` 复用，选项「全部 / 开埠外交 / 侨乡商贸 / 文教宗教 / 红色革命」；切换后重置列表与滚动位置。
- 点击卡片：`wx.navigateTo({ url: '/subpackages/detail/pages/site-detail/index?siteId=' + siteId })`。
- 空状态（`empty-state`）：手绘空地图插画 + 主文案「还没有打卡记录」+ 按钮「去探索」→ `wx.switchTab({ url: '/pages/explore/index' })`。
- 列表态加载：首次进页先渲染 `skeleton`（`type="list"`，3 张卡），`300ms` 后替换真实数据；分页每页 10 条，`onReachBottom` 追加，末页显示「已经到底啦」。
- 进入时 `auth.requireLogin()` 守卫；`options.view === 'map'` 时初始为地图视图。

### 4.5 我的收藏 `subpackages/user/pages/favorites/index`

- 导航：返回 + 标题「我的收藏」+ 右侧「编辑」（编辑态变「完成」）。
- 顶部 Tab：全部 / 史料 / 路线 / 点位，下划线指示器 `#D98C75`，选中文字 `#333` `600`、未选中 `#999`；「史料」与「点位」共用 `type === 'site'` 数据集（「史料」渲染完整卡片，「点位」渲染名称/分类/地址的紧凑行，两者不重复计数），「路线」取 `type === 'route'`。
- 列表：复用 `site-card`（`variant="terracotta"`）样式，卡片右下角改为文字按钮「取消收藏」；点击卡片进详情：`type === 'site'` → `site-detail?siteId=`，`type === 'route'` → `route-detail?routeId=`。
- 取消收藏：先本地移除并 Toast「已取消收藏」，再 `api.delete('/sites/:id/favorite')`（site）或 `api.delete('/routes/:id/favorite')`（route）；失败回滚并 Toast「操作失败，请重试」。路线侧接口【新增·阶段 05 登记】。
- 编辑态：每张卡左侧出现 `40rpx` 圆形复选框，底部浮动按钮「取消收藏（{{selectedCount}}）」，未选中时置灰禁用；确认后批量取消并退出编辑态。
- 左滑删除：`movable-area` + `movable-view` 实现单卡左滑露出 `#E05B4A` 删除区；松手超过 `120rpx` 触发删除，Toast「已删除」+ 2.4s 内「撤销」可回滚。
- 空状态：`empty-state`，主文案「收藏夹还是空的」，按钮「去逛史料」→ `wx.switchTab({ url: '/pages/archive/index' })`。
- 分页每页 10 条；数据源 `api.getMyFavorites()`；进入时 `auth.requireLogin()` 守卫。
- 收藏数据字段：`{ id, type: 'site' | 'route', targetId, createdAt }`，展示名与封面按 `targetId` 反查 Mock 点位/路线，查不到用「内容已下架」占位。

### 4.6 喜好设置 `subpackages/user/pages/preferences/index`

| 区块 | 要求 |
|---|---|
| 导航 | `nav-bar`：返回 + 「喜好设置」+ 右上「保存」文字按钮 |
| 一 · 感兴趣的主题 | 4 张主题大卡（开埠外交 / 侨乡商贸 / 文教宗教 / 红色革命），2×2 网格，间距 `24rpx`；选中加 `4rpx` 陶土 `#D98C75` 描边 + 右上勾；key 固定 `kaibu` / `qiaoxiang` / `wenjiao` / `hongse`；**至少选 1 个**，全取消时保存提示「至少选择一个感兴趣的主题」 |
| 二 · 推荐偏好 | 滑块「更偏经典史料 ←→ 更偏小众点位」，5 档，值 `1—5`，默认 `3`；两端文字 `22rpx` `#999` |
| 三 · 消息通知 | 三个 Switch：打卡提醒 / 路线推荐 / 系统公告，对应 `notify.checkin` / `notify.route` / `notify.system`，默认全开 |
| 四 · 内容显示 | Switch「显示已消失点位」（`showLost`，默认开）+ 分段选择「默认地图图层：史料点 / 路线」（`mapLayer` 取值 `sites` 或 `routes`，默认 `sites`） |

- 存储对象形状固定为 `Preference { themes: [], recommendBias: 3, notify: { checkin, route, system }, showLost: true, mapLayer: 'sites' }`。
- 读取：`onLoad` 读 `byxz_preferences`，无值时用上表默认。
- 保存：写 `byxz_preferences` + `getApp().globalData.preferences`，并 `api.patch('/me', { preferences })`（失败只 `console.log`）；Toast「已保存」，`800ms` 后 `wx.navigateBack()`。
- 未保存返回：`onUnload` 无效，改为监听导航返回（`nav-bar` 的返回事件）判断 `dirty` 为真时 `wx.showModal({ title: '提示', content: '有未保存的修改，确定离开吗？' })`。
- Switch 统一 `color="#D98C75"`；点击区 ≥ `88rpx`。

### 4.7 字体设置 `subpackages/user/pages/font/index`

| 档位 | `fontScale` | 显示百分比 |
|---|---|---|
| 标准 | `1.00` | `100%` |
| 大 | `1.15` | `115%` |
| 特大 | `1.30` | `130%` |

- 导航：`nav-bar`：返回 + 「字体设置」。
- 预览卡：浅杏 `#FFE8C7` 底、圆角 `24rpx`、内边距 `32rpx`，三级文字实时随 `fontScale` 变化：标题「潮海关旧址」`calc(34rpx * var(--fs))`、正文「汕头开埠的重要见证，现为汕头海关关史陈列馆所在地。」`calc(28rpx * var(--fs))`、注释「1921 年 · 钢筋混凝土 · 现存」`calc(24rpx * var(--fs))`。
- 档位按钮：三个分段胶囊，选中陶土底白字，未选中白底 `#666`；点击即写 `fontScale`。
- 滑块：`<slider min="0.9" max="1.3" step="0.05" value="{{fontScale}}">`，`activeColor="#D98C75"`、`backgroundColor="#F0E0C7"`、`block-size="28"`；右侧显示 `{{fontScalePercent}}%`（按 `Math.round(fontScale * 100)` 计算）。
- 「跟随系统字体大小」Switch：开启时滑块与档位按钮禁用（`opacity:.5` + 不响应点击）；状态写 `byxz_font_follow_system`。
- 说明文字：「字体大小会影响所有页面，随时可以改回来。」`24rpx` `#999`。
- 底部「恢复默认」文字按钮：恢复 `fontScale = 1`、关闭跟随系统，即时生效。
- 全局生效方式：每个页面 WXML 首行 `<page-meta page-style="--fs:{{fontScale}}"></page-meta>`；关键字号用 `calc(28rpx * var(--fs))`；`fontScale` 在 `onShow` 从 `getApp().getFontScale()` 读入 `setData`，切换即预览、无需保存；基础库不支持 `page-meta` 时降级为根节点 `fs-large` 类（`fs-large` 定义在 `app.wxss`，`--fs: 1.15`）。
- 同步范围：本阶段 12 个页面必须全部补上；阶段 01–03 的页面若尚未加 `page-meta`，只在字体设置页说明中列出待补页面清单，不擅自改动其业务逻辑。
- 写入：`getApp().setFontScale(v)` 同步 `globalData.fontScale` 与 `byxz_font_scale`（保留两位小数，`Number(v.toFixed(2))`）。

### 4.8 隐私设置 `subpackages/user/pages/privacy/index`

| 分组 | 行内容 | 行为 |
|---|---|---|
| 一 · 位置信息 | 定位权限状态（已授权 / 未授权）+「去系统设置」 | `wx.getSetting` 读 `authSetting['scope.userLocation']`；点击 `wx.openSetting({ success: 重新读取 })`；说明「仅用于附近点位与到点打卡，不会后台持续定位」 |
| 二 · 足迹可见性 | Switch「允许他人看到我的打卡足迹」（默认关闭）；「打卡展示方式」：公开昵称 / 匿名 | 写 `byxz_privacy` 的 `footprintVisible` 与 `displayMode`（取值 `nickname` 或 `anonymous`），变更即时 Toast「已保存」 |
| 三 · 数据与账号 | 清除本地缓存（显示大小，确认后清除，保留登录态）；下载我的数据；注销账号（红色 `#E05B4A`，二次确认 + 输入「注销」） | 见下 |
| 四 · 关于 | 隐私政策、用户协议、版本号 `1.0.0`、联系我们 | 协议用半屏弹层本地文案；联系我们 `wx.showModal({ title: '联系我们', content: '可在小程序意见反馈中留言', showCancel: false })` |

- 通知权限：同一分组内展示「通知权限 已开启 / 未开启」，状态读 `wx.getSetting` 的 `authSetting['scope.subscribeMessage']`，点击「去系统设置」调 `wx.openSetting`；拒绝时不改 `byxz_preferences.notify`。
- 缓存：`wx.getStorageInfoSync().currentSize` 显示 `{{size}}KB`；清除时删除 `byxz_` 前缀下除 `byxz_token`、`byxz_user` 外的全部 key，Toast「缓存已清除」。
- 下载数据：组装 `{ user, checkins, favorites, preferences }` JSON，`wx.setClipboardData({ data })` 后 Toast「数据已复制到剪贴板」。
- 注销：`wx.showModal` 二次确认 → 再弹半屏输入「注销」，完全匹配后清空全部 `byxz_` key、`auth.logout()`、`wx.reLaunch({ url: '/pages/login/index' })`。
- 订阅消息：读取 `byxz_preferences.notify` 的三项作为开关初值（与喜好设置共享同一对象，不建第二份状态）；开启且模板 ID 非空时调用

  ```js
  wx.requestSubscribeMessage({
    tmplIds: [TEMPLATE_IDS[key]],
    success(res) { /* res[tmplId] === 'accept' 写 true，否则写 false 并 Toast「您拒绝了订阅」 */ },
    fail(err) { /* console.error('订阅失败', err); 写 false */ }
  })
  ```

  模板 ID 占位常量（全部留空，便于后台替换）：

  ```js
  const TEMPLATE_IDS = { checkin: '', route: '', system: '' };
  ```

  模板 ID 为空时**不调用** `wx.requestSubscribeMessage`，仅写本地状态并 Toast「订阅已开启（模板待配置）」。
- 页面统一 `auth.requireLogin()` 守卫；所有 Switch 变更即时写入 + Toast「已保存」。

### 4.9 搜索页 `subpackages/user/pages/search/index`

- 顶部：返回箭头（点击区 ≥ `88rpx`）+ 搜索框（高 `72rpx`、圆角 `36rpx`、白底、左侧放大镜、占位「搜建筑、路线、关键词」）+ 「搜索」文字按钮（`#1A91FA`）。
- 空查询态：搜索历史（最多 10 条，胶囊可点，右侧垃圾桶清空，清空需确认）+ 热门搜索「海关」「侨批」「老妈宫」「红色交通站」。
- 输入态：`300ms` 防抖，调 `api.getSites({ keyword })` 与路线匹配，分组显示「史料 / 路线 / 点位」，命中关键词以琥珀 `#F0AD45` 半透明底高亮（模板按 `segments: [{ text, hit }]` 渲染，禁止用 `rich-text`）。
- 结果态：顶部 Tab「综合 / 史料 / 点位 / 路线」；综合为三个分组列表（每组最多 3 条 + 「查看全部」）；空结果显示「没有找到相关内容」+ 推荐词（回填热门词）。
- 数据来源：史料与点位均取 `mock/sites.js` 的 12 条（史料展示卡片摘要、点位展示名称 + 地址 + 分类）；路线取 `mock/routes.js`；点击史料/点位 → `subpackages/detail/pages/site-detail/index?siteId=`，路线 → `subpackages/route/pages/route-detail/index?routeId=`。
- 历史写入：提交搜索时把关键词插入 `byxz_search_history` 头部、去重、截断为 10 条。
- 搜索无需登录（不调用 `auth.requireLogin`）；空关键词提交 Toast「请输入搜索内容」。
- 从探索页搜索按钮进入：`wx.navigateTo({ url: '/subpackages/user/pages/search/index' })`，支持 `?keyword=` 预填并直接搜索。

### 4.10 消息页 `subpackages/user/pages/messages/index`

- 导航：`nav-bar` 返回 + 「消息」+ 右侧「全部已读」。
- Tab：系统通知 / 互动消息（`type: 'system' | 'interact'`），下划线指示器陶土色，未读数量以角标显示。
- 列表每项：`48rpx` 圆形图标（系统用 `#F0AD45` 底、互动用 `#F2AB9E` 底）+ 标题 `30rpx`（未读时 `600`）+ 摘要 `24rpx` `#666` 单行省略 + 时间 `22rpx` `#999`；未读项左侧 `12rpx` 红点。
- 点击：标记已读（`api.patch('/messages/:id', { read: true })` Mock 本地更新），随后按 `link` 跳转；`link` 为空时只标记已读。
- 「全部已读」：确认后批量置读，红点与加粗全部消失，右上角未读角标清零。
- 空状态：`empty-state`，主文案「暂时没有新消息」，按钮「返回」→ `wx.navigateBack()`。
- 数据源 `api.getMessages()`，按 `time` 倒序；进入时 `auth.requireLogin()` 守卫。

### 4.11 编辑资料 `subpackages/user/pages/profile-edit/index`

- 导航：`nav-bar` 返回 + 「编辑资料」+ 右侧「保存」。
- 头像：`128rpx` 圆形，外层 `<button open-type="chooseAvatar" bindchooseavatar="onChooseAvatar">`，选中后写入 `tempAvatar` 并即时预览；裁剪可省略。
- 昵称：`<input type="nickname" maxlength="12" value="{{nickname}}" bindinput="onNicknameInput">`，`300ms` 防抖做敏感词过滤占位（命中时 Toast「昵称包含敏感词」）。
- 手机号：脱敏显示 `138****1234` + 右侧「更换」，点击弹半屏输入新手机号与验证码（Mock `123456`），校验通过后更新。
- 个人简介：`<textarea auto-height maxlength="50">`，限 50 字，右下角计数 `{{bio.length}}/50`。
- 保存：昵称、简介非空校验（昵称 2—12 字）→ `api.patch('/me', { nickname, bio, avatar, phone })` → `auth.updateUser(patch)` 写 `byxz_user` 与 `globalData` → Toast「已保存」→ `wx.navigateBack()`；返回后我的页 `onShow` 重新读 `auth.getUser()` 即刷新。
- 未登录进入本页：`auth.requireLogin()` 守卫；头像/昵称使用基线第 9 节口径（`chooseAvatar` + `input type="nickname"`，**禁止** `getUserProfile`）。

### 4.12 设置页 `subpackages/user/pages/settings/index`

- 列表：账号与安全（手机号、密码）→ 点击弹半屏说明，手机号入口复用编辑资料的更换流程；密码入口 Toast「请通过忘记密码重置」。
- 清除缓存：显示 `wx.getStorageInfoSync().currentSize` 的 `KB` 值，确认后删除 `byxz_` 前缀下除 `byxz_token`、`byxz_user` 外的全部 key（与隐私设置同口径），Toast「缓存已清除」。
- 关于我们 / 隐私政策 / 用户协议：隐私政策、用户协议用半屏弹层本地文案；关于我们弹层展示小程序名「埠影寻踪」与版本号「版本 1.0.0」。
- 退出登录：红色 `#E05B4A`，二次确认「确定要退出登录吗？」→ `auth.logout()`（清 `byxz_token` / `byxz_user` 与 `globalData.userInfo`，保留字体、偏好等本地设置）→ `wx.switchTab({ url: '/pages/explore/index' })`，我的页回到未登录态。
- 进入时 `auth.requireLogin()` 守卫。

### 4.13 `mock/user.js` 与 Mock 数据

| 导出 | 形状与规模 |
|---|---|
| `mockAccount` | `{ account: 'baibianwaimatu', password: '123456' }` |
| `mockUser` | `{ id: 'u_001', nickname: '埠影行者', avatar: '', phone: '13800001234', bio: '沿外马路慢慢走，边看边记。', createdAt: '2026-09-01' }`（`avatar` 为空串时我的页用默认头像占位）；`mockWechatUser` 首登建号 `{ id: 'u_wx_001', nickname: '埠影新客', avatar: '', bio: '', phone: '', createdAt: 当日 }` |
| `mockCheckins` | 6 条，字段 `{ id, siteId, siteName, cover, time, lat, lng, distance, count }`；`siteId` 取基线 12 点位 id（`site_001` 出现 2 次，`site_005` / `site_007` / `site_010` / `site_012` 各 1 次），`count` 为该点位第 N 次，`time` 覆盖今天/昨天/上月的三种展示分支 |
| `mockFavorites` | 6 条，字段 `{ id, type, targetId, createdAt }`；`site` 4 条（`site_001`、`site_005`、`site_007`、`site_010`）、`route` 2 条（`route_01`、`route_04`） |
| `mockPreferences` | `{ themes: ['kaibu', 'qiaoxiang'], recommendBias: 3, notify: { checkin: true, route: true, system: true }, showLost: true, mapLayer: 'sites' }` |
| `mockMessages` | 6 条，字段 `{ id, type, title, summary, time, read, link }`，`type` 取 `system` 或 `interact`；3 条 system、3 条 interact，其中 2 条 `read: false`；`link` 为 `/subpackages/user/pages/favorites/index`、`/subpackages/detail/pages/site-detail/index?siteId=site_001` 之类真实路径 |

- 统计不写进 Mock：打卡数、收藏数、足迹数由页面按记录聚合（见 4.3）。
- `utils/api.js` 的 Mock 分支按 `USE_MOCK` 读取上述导出；新增 `DELETE /sites/:id/favorite`、`DELETE /routes/:id/favorite`、`PATCH /messages/:id` 三个 Mock 分支，返回 `{ code: 0, data: true, msg: 'ok' }`。
- 页面统一 `try/catch` + `code !== 0` 时 Toast `msg`；列表页失败态给 `empty-state` + 「重试」按钮。

## 5. 登录与数据写入规则

### 5.1 `utils/auth.js` 接口清单

| 方法 | 签名 | 行为 |
|---|---|---|
| `getToken()` | `() => String` | 读 `byxz_token`，空串即未登录 |
| `getUser()` | `() => Object \| null` | 读 `byxz_user`，并与 `getApp().globalData.userInfo` 对齐 |
| `isLoggedIn()` | `() => Boolean` | `!!getToken() && !!getUser()` |
| `login(session)` | `({ token, userInfo }) => void` | 写 `byxz_token` / `byxz_user`，同步 `globalData.token` / `globalData.userInfo` |
| `updateUser(patch)` | `(Object) => Object` | 合并旧用户写入 `byxz_user` 与 `globalData.userInfo`，返回新用户 |
| `logout()` | `() => void` | 移除 `byxz_token` / `byxz_user`，置空 `globalData`，**保留**字体/偏好/历史等本地设置 |
| `buildRedirect()` | `() => String` | 取当前栈顶页 `route` + `options`，拼成 `/<route>?...` 并 `encodeURIComponent` 后写 `byxz_redirect` |
| `requireLogin(options)` | `({ redirect }) => Boolean` | 已登录返回 `true`；未登录写 `byxz_redirect`（默认取 `buildRedirect()`）并 `wx.navigateTo({ url: '/pages/login/index' })`，返回 `false` |
| `consumeRedirect()` | `() => String \| null` | 读取并立即清除 `byxz_redirect`，无值返回 `null` |
| `redirectAfterLogin()` | `() => void` | 见 5.3 |

- `auth.js` 只依赖 `utils/storage.js` 的 key 常量与 `wx` API，不发起网络请求；所有读写包 `try/catch`，失败只 `console.error`，不阻断 UI。
- `utils/storage.js` 导出 `KEYS` 常量对象，任何页面禁止手写字符串 key。

### 5.2 Storage key（前缀统一 `byxz_`，逐项固定）

| key | 类型 | 写入位置 | 读取位置 |
|---|---|---|---|
| `byxz_token` | String | `auth.login`（登录/注册/微信） | `auth`、所有守卫 |
| `byxz_user` | Object `{ id, nickname, avatar, phone, bio, createdAt }` | `auth.login` / `auth.updateUser`（编辑资料） | 我的页、编辑资料、设置页 |
| `byxz_redirect` | String（编码后的页面路径） | `auth.requireLogin` / `auth.buildRedirect` | 登录页、注册页 |
| `byxz_font_scale` | Number `0.9—1.3`，默认 `1` | 字体设置页 `setFontScale` | `app.js` 启动、全部页面 `--fs` |
| `byxz_font_follow_system` | Boolean，默认 `false` | 字体设置页 Switch | 字体设置页 |
| `byxz_preferences` | Preference 对象 | 喜好设置保存、隐私设置 Switch | 喜好页、隐私页、探索页地图图层 |
| `byxz_privacy` | Object `{ footprintVisible: false, displayMode: 'nickname' }` | 隐私设置 | 隐私设置 |
| `byxz_search_history` | `Array<String>`（≤10） | 搜索页提交/清空 | 搜索页 |
| `byxz_checkins` | `Checkin[]`（同日同 `siteId` 只计 1 次，`count` 累计） | 阶段 03 打卡写入 | 详情页、打卡页、我的统计 |

### 5.3 未登录拦截与 `redirect`

- 需登录：打卡、收藏、走街开始、我的数据（我的页统计、打卡点、收藏、喜好、隐私、消息、编辑资料、设置）。无需登录：浏览、史料/点位详情、搜索、字体设置。
- 拦截流程：动作入口先调 `auth.requireLogin({ redirect })`；未登录时把目标页路径写入 `byxz_redirect`，再 `wx.navigateTo('/pages/login/index')`，动作本身**不执行**。
- 登录成功回跳：`const target = auth.consumeRedirect()`；`target` 为空 → `wx.switchTab({ url: '/pages/profile/index' })`（基线口径，无 redirect 回「我的」）；`target` 存在且当前页上一页 `route` 与其页面路径一致 → `wx.navigateBack()`；否则 `wx.reLaunch({ url: target })`（`reLaunch` 同时兼容 Tab 页，禁止用 `navigateTo` 跳 Tab 页）。
- 已登录用户进入登录/注册页：直接返回，不渲染表单（避免重复登录）。
- 页面级守卫：7 个需登录的 user 二级页（checkins / favorites / preferences / privacy / messages / profile-edit / settings）在 `onLoad` 首行调用 `auth.requireLogin()`，返回 `false` 时立即 `return`，不再 `setData`、不再发请求；`font` 与 `search` 不加守卫。

## 6. 验收标准

- [ ] 49 个文件全部创建，`app.json` 中 `pages/register/index` 与 9 个 user 分包路径均存在且可编译；控制台无「页面不存在」「组件未找到」。
- [ ] 登录页背景铺满、顶部白色渐隐、底部黑色叠色正确；标题为「欢迎」「请登录账号」两行 `44rpx` `#111`；账号占位「请输入账号 / 手机号」；密码可切换明文/密文且密文为 `•`。
- [ ] 登录按钮为 `#1A91FA`、`600×88rpx`、圆角 `44rpx`；账号 <4 位或密码 <6 位时下划线变 `#E05B4A` 并出现 `22rpx` 错误文案，失焦即校验。
- [ ] 用 `baibianwaimatu` / `123456` 可登录，Toast「欢迎回来」；错误账号 Toast「账号或密码不正确」且表单抖动；登录中按钮显示「登录中…」不可重复点击。
- [ ] 第三方入口为微信、QQ 两个 `48rpx` 图标、间距 `120rpx`；点 QQ 仅 Toast「请使用微信登录」；点微信走 `wx.login` 后 Mock 登录成功，首次自动建号。
- [ ] 从打卡/收藏/走街/我的数据入口未登录触发时进入登录页，登录后回到原目标页；无 `redirect` 时切到「我的」。
- [ ] 注册页白色表单卡、返回箭头、「创建账号」标题齐全；昵称 2—12 字、手机号 11 位、验证码 6 位、密码 ≥6 位、两次一致全部生效；未勾选协议时按钮 `opacity:.5` 且点击有提示。
- [ ] 注册成功自动登录并回跳，老手机号提示「该手机号已注册，请直接登录」；验证码按钮 `60s` 倒计时可恢复。
- [ ] 我的页封面高 `560rpx`，头像 `128rpx` 压边 `40rpx`，内容层上压 `48rpx`、顶部圆角 `48rpx`、底色 `#FCF7EE`。
- [ ] 未登录态显示「点击登录」「登录后记录你的足迹」；已登录显示昵称与脱敏手机号 `138****1234`。
- [ ] 统计卡为白底、高 `176rpx`、三等分，数字 `56rpx` `#F0AD45`、标签「打卡数 / 收藏数 / 足迹数」；数值来自 `/me/checkins` 与 `/me/favorites` 聚合，无数据为 `0`，且有 `600ms` 滚动动画。
- [ ] 菜单卡 `#FFE8C7`、5 行各 `112rpx`、顺序与图标（定位 pin / 书签加号 / 爱心 / T / 齿轮）一致；末行无分割线；未登录点击任一菜单均先拦截再登录。
- [ ] 我的打卡点：统计条三列、列表按时间倒序且「第 N 次打卡」正确、今天/昨天/`2026.10.01` 三种时间格式正确；地图视图仅显示已打卡点位且 marker 带勾。
- [ ] 我的收藏：四 Tab 切换、下划线指示器陶土色；取消收藏乐观更新失败可回滚；编辑态复选框与「取消收藏（N）」可用；左滑删除后可撤销；空状态「收藏夹还是空的」+「去逛史料」。
- [ ] 喜好设置：4 个主题 key 为 `kaibu/qiaoxiang/wenjiao/hongse`，可多选且至少 1 个；推荐偏好 5 档；3 个通知 Switch；`showLost` 与 `mapLayer` 可切换；保存写 `byxz_preferences` 并 Toast「已保存」后返回。
- [ ] 字体设置：三档 `1.00 / 1.15 / 1.30`、滑块 `0.9—1.3` 步进 `0.05`、右侧百分比同步；切换后当前页字号即时变化，离开重进仍保留；重启小程序后 `byxz_font_scale` 生效。
- [ ] 字体页「跟随系统字体大小」开启后滑块与档位禁用；说明文案逐字为「字体大小会影响所有页面，随时可以改回来。」
- [ ] 隐私设置：定位状态与 `wx.getSetting` 一致并可跳 `wx.openSetting`；足迹可见性与展示方式可持久化；清除缓存保留 `byxz_token` 与 `byxz_user`；注销需二次确认并输入「注销」。
- [ ] 隐私设置三个订阅项在模板 ID 为空时只写本地并提示，**不调用** `wx.requestSubscribeMessage`；`TEMPLATE_IDS` 三项均为空串占位。
- [ ] 搜索页历史最多 10 条、可点击回填、可清空；热门词为「海关」「侨批」「老妈宫」「红色交通站」；输入 `300ms` 后才请求；结果分「史料 / 路线 / 点位」三组且关键词高亮；空结果「没有找到相关内容」。
- [ ] 消息页系统/互动两 Tab、未读红点与标题加粗、「全部已读」清空未读、点击按 `link` 跳转、空状态「暂时没有新消息」。
- [ ] 编辑资料支持 `chooseAvatar` 与 `input type="nickname"`，简介 50 字计数，保存后我的页昵称/头像即时刷新；全项目无 `getUserProfile`。
- [ ] 设置页含账号与安全、清除缓存、关于我们、隐私政策、用户协议、退出登录；退出后清 token、回探索 Tab、我的页变未登录态。
- [ ] 全项目 grep 不到基线第 12 节列出的旧页面路径与模板命名，也没有任何汕头以外的外地地名内容。
- [ ] 所有列表页具备骨架屏、空状态、失败重试；可点击元素点击区 ≥ `88rpx`；无横向滚动、无 TabBar 遮挡。

## 7. 约束与禁止事项

1. 只用微信原生小程序（WXML + WXSS + ES6），零 npm、零 UI 库；禁止 Taro / uni-app / TypeScript / Vant / MobX。
2. 禁止修改 `project.config.json` 的 `appid`（`wx14264fd3b18c547f`）、`libVersion`（`3.17.0`）、`projectname`（`WaimaRoad`）；禁止开启 Skyline。
3. 禁止出现基线第 12 节「命名与口径禁忌」列出的任何旧页面路径、模板命名与旧枚举（逐条比对，清单以基线为准）。
4. 禁止出现任何汕头以外的外地地名或旧城市点位内容；点位名只能取基线第 7.4 节 12 条及外马路/小公园/永平路/升平路/民权路/公园路。
5. 第三方登录只做入口与占位：微信仅 `wx.login` + Mock 换号，QQ 只 Toast「请使用微信登录」；禁止接入 QQ 开放平台、真实短信、真实鉴权后端。
6. 禁止新增页面或路由；协议、隐私政策、忘记密码、更换手机号、注销确认一律用页面内半屏弹层承载。
7. 禁止改写色值：登录按钮 `#1A91FA`、菜单卡 `#FFE8C7`、数字 `#F0AD45`、页面底 `#FCF7EE`、错误/删除 `#E05B4A`、分割线 `#E8DDCB`、菜单箭头 `#B9A98F` 均为定值；补充色不超过 `#F2AB9E`、`#D98C75`、`#F0E0C7`。
8. 禁止写死统计数字（12/8/3 之类）或伪造用户数据；无登录态时统计为 0 并显示未登录文案。
9. 禁止在页面内手写 Storage key 字符串，一律用 `utils/storage.js` 的 `KEYS`；禁止使用非 `byxz_` 前缀的 key。
10. 禁止用 `wx.navigateTo` 跳 Tab 页；跨 Tab 一律 `wx.switchTab`，登录回跳按 5.3 节。
11. 禁止在订阅消息里写真实模板 ID 或绕过模板占位直接调 `wx.requestSubscribeMessage`；模板未配置时只能写本地状态。
12. 禁止把「埠藏史库」当产品名或页面标题；品牌文案统一「埠影寻踪」，书法文案只允许「埠藏史库，街绘行图」出现在探索页与史料页（本阶段页面不出现该书法标题）。
