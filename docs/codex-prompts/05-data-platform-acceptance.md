# 阶段 5 · 数据层、Mock、API、业务规则、平台能力与整体验收

> 执行者只读：本文件 + `docs/codex-prompts/00-baseline.md`。不搜索旧代码、不读其他阶段文件、不参考任何历史实现。旧版的云开发、`utils/db.js`、`utils/data.js`、云函数口径整体作废。

## 1. 目标

1. 把 `01—04` 各页面的数据来源全部收口到 `miniprogram/utils/api.js`，页面不再直接读写 `mock/` 或内联常量。
2. 建立完整 Mock：`mock/sites.js`（12 条点位）、`mock/routes.js`（4 条路线）、`mock/user.js`（用户、收藏、打卡、偏好、消息种子）。
3. 把上传文档第 10 章业务规则逐条落成可验证的代码规则。
4. 落地第 11 章平台能力（登录、定位、隐私、订阅消息、分享、震动、版本检查），并完成整体联调与第 13 章验收。

## 2. 前置状态

- `01—04` 已完成：4 个 Tab（探索 / 史料 / 走街 / 我的）、登录与注册、我的页、全部二级页（`subpackages/detail`、`route`、`user` 共 14 页）界面可跑通，路由与设计令牌已落地。
- 页面此时可能仍在用内联常量、早期临时 Mock 或直接 `wx.getStorageSync`；本阶段只做**数据与规则收口**，不重画页面、不改布局、色值、文案与路由表。
- `utils/api.js` 已有骨架与 `USE_MOCK` 开关，但接口不完整；`utils/storage.js`、`utils/auth.js`、`utils/location.js`、`utils/format.js` 可能已由前序阶段建立。
- 页面数量固定 20 条（`00-baseline` 第 5 节），本阶段**不得新增或删除页面**。

## 3. 文件清单

| 路径 | 职责 | 动作 | 完成度 |
|---|---|---|---|
| `miniprogram/utils/api.js` | 唯一数据出口：`USE_MOCK` 开关、统一响应、延迟、全量接口、登录拦截封装 | 收敛为最终版 | 完整 |
| `miniprogram/utils/storage.js` | 全部 Storage key 集中定义与读写，统一 `byxz_` 前缀 | 收敛 | 完整 |
| `miniprogram/utils/auth.js` | `isLogin` / `requireLogin` / `redirect` 存取 / 登录态过期清理 | 04 已建则只做收敛修改 | 完整 |
| `miniprogram/utils/location.js` | 定位授权说明、`wx.getLocation`、精度校验、到点距离计算 | 按第 6 节规则补齐 | 完整 |
| `miniprogram/utils/format.js` | 时间（今天 14:32 / 昨天 / 2026.10.01）与数字（`2.6k` / `1.2w`）格式化 | 已有则核对，不新增其他函数 | 完整 |
| `miniprogram/mock/sites.js` | 12 条 Site 全字段数据 | 新建 | 完整 |
| `miniprogram/mock/routes.js` | 4 条 Route + 点位序列 | 新建 | 完整 |
| `miniprogram/mock/user.js` | User、Checkin、Favorite、Preference、Message 种子 | 新建 | 完整 |
| 各页面 `index.js` | 改为只调 `api.*`，删除内联 Mock 与写死统计数字 | 就地修改 | 修改 |

- 不创建 `cloudfunctions/` 任何内容，不新增 npm 依赖，不新增 `utils/db.js`。
- 允许的修改范围仅限上表；不得顺手重写页面模板与样式。

## 4. 数据模型

### 4.1 Site（史料点位）

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `id` | String | 点位主键 | `site_001` |
| `name` | String | 点位名 | `潮海关旧址` |
| `alias` | String | 别称 / 现挂牌名 | `汕头海关关史陈列馆` |
| `category` | String | 分类枚举 `kaibu \| qiaoxiang \| wenjiao \| hongse` | `kaibu` |
| `categoryName` | String | 分类中文名 | `开埠外交` |
| `cover` | String | 本地封面路径，750×450 | `/assets/images/sites/customs.jpg` |
| `images` | Array\<String\> | 详情图集，固定 5 张，首张与 `cover` 相同 | `['/assets/images/sites/customs.jpg', ...]` |
| `summary` | String | 一行简介 | `汕头开埠的重要见证，现为汕头海关关史陈列馆所在地。` |
| `description` | String | 长文本 3—5 段 | `长文本，3—5 段……` |
| `address` | String | 地址 | `汕头市金平区外马路 2 号` |
| `location` | Object | `{ lat, lng }` | `{ lat: 23.3520, lng: 116.6785 }` |
| `era` | String | 年代 | `1921 年` |
| `structure` | String | 结构 | `钢筋混凝土` |
| `originalUse` | String | 原用途 | `海关办公` |
| `currentStatus` | String | 现存状态：`现存` / `已消失` | `现存` |
| `openTime` | String | 开放时间 | `周二至周日 09:00—17:00` |
| `viewCount` | Number | 浏览数（展示用，前端格式化） | `2600` |
| `favoriteCount` | Number | 收藏数 | `2100` |
| `checkinCount` | Number | 打卡数 | `860` |
| `oldPhotos` | Array\<{url, year, source}\> | 今昔对比老照片，≥2 条 | `[{ url: '/assets/images/compare/customs-1923.jpg', year: '1923', source: '汕头市档案馆' }]` |
| `aiRestored` | String | AI 复原图路径，页面必须标注「AI 生成 / 仅供想象」 | `/assets/images/sites/customs-ai.jpg` |
| `audio` | Object | `{ url, duration }`，`url` 允许空串 | `{ url: '', duration: 95 }` |
| `tags` | Array\<String\> | 标签 | `['海关', '开埠', '洋行']` |

### 4.2 Route（路线）

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `id` | String | 路线主键 | `route_01` |
| `name` | String | 路线名 | `开埠外交线` |
| `theme` | String | 主题枚举，与 Site 共用 | `kaibu` |
| `themeName` | String | 主题中文名 | `开埠外交` |
| `cover` | String | 路线封面，750×450 | `/assets/images/sites/customs.jpg` |
| `distance` | Number | 距离（km） | `1.2` |
| `duration` | Number | 时长（min） | `40` |
| `intro` | String | 一句话简介 | `从海关到洋行，读懂汕头开埠的第一课。` |
| `stops` | Array\<String\> | 点位 id 序列，UI 点位数一律取 `stops.length` | `['site_001', 'site_005', 'site_006', 'site_003']` |
| `polyline` | Array\<{latitude, longitude}\> | 地图折线，按 `stops` 顺序取点位坐标 | `[{ latitude: 23.3520, longitude: 116.6785 }, ...]` |
| `order` | Number | 排序 | `1` |

### 4.3 User

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `id` | String | 用户主键 | `user_001` |
| `nickname` | String | 昵称（敏感词过滤后落库） | `阿埠` |
| `avatar` | String | 头像本地路径或临时路径 | `/assets/images/avatar-default.png` |
| `phone` | String | 手机号 | `13900000000` |
| `bio` | String | 个人简介（敏感词过滤） | `沿着外马路，把老城读一遍` |
| `createdAt` | String | 注册时间 | `2026-10-01 10:20` |

### 4.4 Checkin

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `id` | String | 打卡记录主键 | `checkin_001` |
| `siteId` | String | 点位 id | `site_001` |
| `siteName` | String | 点位名快照 | `潮海关旧址` |
| `cover` | String | 封面快照 | `/assets/images/sites/customs.jpg` |
| `time` | String | 打卡时间 | `2026-10-01 15:32` |
| `lat` | Number | 打卡纬度 | `23.3521` |
| `lng` | Number | 打卡经度 | `116.6786` |
| `distance` | Number | 距点位距离（米） | `38` |
| `count` | Number | 该点位累计打卡次数（含本次） | `3` |

### 4.5 Favorite

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `id` | String | 收藏主键 | `fav_001` |
| `type` | String | `site` / `route` | `site` |
| `targetId` | String | 被收藏对象 id | `site_001` |
| `createdAt` | String | 收藏时间 | `2026-10-01 15:40` |

### 4.6 Preference

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `themes` | Array\<String\> | 兴趣主题，取值同分类枚举 | `['kaibu', 'qiaoxiang']` |
| `recommendBias` | Number | 推荐偏向 1—5 | `3` |
| `notify` | Object | 订阅开关 `{ checkin, route, system }` | `{ checkin: true, route: true, system: true }` |
| `showLost` | Boolean | 是否显示已消失点位 | `true` |
| `mapLayer` | String | 默认地图图层 `sites` / `route` / `footprint` | `sites` |

### 4.7 Message

| 字段 | 类型 | 含义 | 示例值 |
|---|---|---|---|
| `id` | String | 消息主键 | `msg_001` |
| `type` | String | `system` / `interact` | `system` |
| `title` | String | 标题 | `「红色革命线」已上线` |
| `summary` | String | 摘要 | `新增 4 个红色旧址点位，可在地图查看。` |
| `time` | String | 时间 | `2026-10-01 09:00` |
| `read` | Boolean | 是否已读 | `false` |
| `link` | String | 跳转路径（可空） | `/subpackages/route/pages/route-detail/index?routeId=route_04` |

## 5. Mock 数据

### 5.1 12 条点位（坐标除 `site_001` 外均为示意，接入时用腾讯地图拾取器校准）

| id | 名称 | 分类 | 地址 | 坐标（lat, lng） | 封面 |
|---|---|---|---|---|---|
| `site_001` | 潮海关旧址 | 开埠外交 | 外马路 2 号 | 23.3520, 116.6785 | `/assets/images/sites/customs.jpg` |
| `site_002` | 汕头开埠邮局陈列馆 | 开埠外交 | 外马路 25 号 | 23.3512, 116.6798 | `/assets/images/sites/post-office.jpg` |
| `site_003` | 汕头海关关史陈列馆 | 开埠外交 | 外马路 20 号 | 23.3518, 116.6789 | `/assets/images/sites/customs-museum.jpg` |
| `site_004` | 汕头开埠文化陈列馆 | 开埠外交 | 永平路 1 号 | 23.3535, 116.6812 | `/assets/images/sites/kaibu-museum.jpg` |
| `site_005` | 侨批文物馆 | 侨乡商贸 | 外马路 18 号 | 23.3526, 116.6790 | `/assets/images/sites/qiaopi.jpg` |
| `site_006` | 永平酒楼 | 侨乡商贸 | 永平路 11 号 | 23.3541, 116.6818 | `/assets/images/sites/yongping-restaurant.jpg` |
| `site_007` | 老妈宫与戏台 | 文教宗教 | 升平路 6 号 | 23.3552, 116.6826 | `/assets/images/sites/magong.jpg` |
| `site_008` | 存心善堂 | 文教宗教 | 外马路 87 号 | 23.3504, 116.6802 | `/assets/images/sites/cunxin.jpg` |
| `site_009` | 中山纪念亭 | 文教宗教 | 小公园片区 | 23.3546, 116.6816 | `/assets/images/sites/pavilion.jpg` |
| `site_010` | 大埔会馆 | 红色革命 | 民权路 95 号 | 23.3560, 116.6840 | `/assets/images/sites/dapu-hall.jpg` |
| `site_011` | 东征军革命史迹陈列馆 | 红色革命 | 外马路 207 号 | 23.3488, 116.6815 | `/assets/images/sites/dongzheng.jpg` |
| `site_012` | 桂园 | 红色革命 | 公园路 23 号 | 23.3572, 116.6795 | `/assets/images/sites/guiyuan.jpg` |

- 每条必须全字段非空（`audio.url` 可为 `''`），`description` 写 3—5 段中文，`oldPhotos` ≥2 条，`aiRestored` 有值；`viewCount` / `favoriteCount` / `checkinCount` 给不同量级（数百至数千），便于验证 `2.6k` / `1.2w` 格式化。
- 基准文案逐字照抄：`site_001` 的 `summary` 为「汕头开埠的重要见证，现为汕头海关关史陈列馆所在地。」，浏览 `2600`、收藏 `2100`。
- 分类分布固定：开埠外交 4 条、侨乡商贸 2 条、文教宗教 3 条、红色革命 3 条，不得新增第 5 类。

### 5.2 4 条路线（点位数以 `stops.length` 为准，UI 不写死 5）

| id | 路线 | 主题（themeName） | 距离 | 时长 | `stops` | 点位数 | order |
|---|---|---|---|---|---|---|---|
| `route_01` | 开埠外交线 | 开埠外交 | 1.2km | 40 分钟 | `['site_001','site_005','site_006','site_003']` | 4 | 1 |
| `route_02` | 侨乡商贸线 | 侨乡商贸 | 1.5km | 50 分钟 | `['site_005','site_006','site_004','site_001','site_009']` | 5 | 2 |
| `route_03` | 文教宗教线 | 文教宗教 | 1.0km | 35 分钟 | `['site_007','site_008','site_009','site_004']` | 4 | 3 |
| `route_04` | 红色革命线 | 红色革命 | 1.8km | 60 分钟 | `['site_010','site_011','site_012','site_009']` | 4 | 4 |

- `route_01` 的 `stops` 与 `intro` 逐字照抄上传文档 9.2（简介「从海关到洋行，读懂汕头开埠的第一课。」）。
- `polyline` 由 `stops` 对应点位 `location` 顺序拼接，不加额外控制点；路线详情页用它画 4rpx 主题色折线。

### 5.3 用户与种子数据

| 数据 | 内容 |
|---|---|
| Mock 登录账号 | 账号 `13900000000`，密码 `123456`；注册验证码固定 `1234` |
| Mock 用户 | `{ id: 'user_001', nickname: '阿埠', avatar: '/assets/images/avatar-default.png', phone: '13900000000', bio: '沿着外马路，把老城读一遍', createdAt: '2026-10-01 10:20' }` |
| 收藏种子 4 条 | `site_001`（2026-10-01 15:40）、`site_005`（2026-10-02 10:05）、`route_01`（2026-10-03 09:12）、`site_009`（2026-10-04 16:20） |
| 打卡种子 2 条 | `site_009`（2026-10-02 11:08，距离 42m，count 2）、`site_001`（2026-10-03 14:32，距离 38m，count 1） |
| 偏好种子 | `{ themes: ['kaibu','qiaoxiang'], recommendBias: 3, notify: { checkin: true, route: true, system: true }, showLost: true, mapLayer: 'sites' }` |
| 消息种子 3 条 | 系统「埠影寻踪上线」、互动「你的打卡已生成足迹」、系统「红色革命线已上线」；至少 1 条 `read: false` 用于红点 |

### 5.4 图片占位与素材替换清单

| 目录 / 文件 | 尺寸 | 数量 | 用途 |
|---|---|---|---|
| `assets/images/sites/*.jpg` | 750×450 | 12 | 12 个点位封面 |
| `assets/images/compare/*.jpg` | 750×500 | 36（12×3：`-old-1` / `-old-2` / `-now`） | 今昔对比老照片与现状图（AI 复原图另放 `assets/images/ai/`） |
| `assets/tabbar/*.png`（4 个 + `-active`） | 104×104 | 8 | Tab 图标 |
| `assets/markers/*.png`（4 个分类） | 112×144 | 4 | 地图分类 Marker |
| `assets/illustrations/header-map.png` | 1240×760 | 1 | 探索页老地图拼贴 |
| `assets/illustrations/profile-cover.png` | 1500×1120 | 1 | 我的页水彩封面 |
| `assets/illustrations/book.png` / `signpost.png` / `pin-map.png` | 400×360 / 400×320 / 360×320 | 3 | 史料页 / 走街页插画 |
| `assets/illustrations/empty-*.png` | 480×360 | 按空状态数 | 各空状态 |
| `assets/images/login-bg.jpg` | 1125×2436 | 1 | 登录页中山纪念亭 |
| `assets/images/avatar-default.png` | 200×200 | 1 | 默认头像 |

- 无真实素材时按「暖灰或陶土渐变底 + 居中白色建筑名 + 右下角「图片待替换」」渲染，不出现任何外链；替换时保持同文件名与同尺寸。
- 不得把占位改成远程 URL；不得使用网络图片 `<image src="http...">`。
- 真正的替换动作在收尾阶段执行：见 `07-assets-swap.md`（命名清单、导出规格、接线方式、体积红线、验收清单）。

## 6. API 约定

### 6.1 响应结构与错误码

- 所有接口返回 `{ code, data, msg }`：`code === 0` 成功，`code !== 0` 由 `api.js` 统一 `wx.showToast({ title: msg, icon: 'none' })` 并 `reject`。
- 错误码固定：`0` 成功、`401` 未登录或登录过期（清 `byxz_token` 后走登录拦截）、`404` 资源不存在、`422` 参数校验失败、`500` Mock 内部异常。
- Mock 延迟 **300—600ms** 随机（`300 + Math.floor(Math.random() * 300)`），在每个接口入口 await 一次，不得在页面里再叠加 `setTimeout`。

### 6.2 开关与调用纪律

- `utils/api.js` 顶部只保留一个开关：`const USE_MOCK = true;`；切真实后端时改为 `false` 并把 `BASE_URL` 换成接口域名，页面代码零改动。
- 页面**只调 `api.*`**，禁止 `import` 任何 `mock/` 文件、禁止页面内 `wx.request`、禁止写死统计数字或种子数组。
- 登录态：`api.js` 内置 `request()` 统一注入 `byxz_token`；`401` 时调 `auth.requireLogin(redirectPath)`。

### 6.3 接口清单（`utils/api.js` 导出，按上传文档 9.5）

| 方法 | 对应接口 | 入参 | 返回 `data` | 用途 |
|---|---|---|---|---|
| `login` | `POST /auth/login` | `{ account, password }` | `{ token, user }` | 账号密码登录 |
| `register` | `POST /auth/register` | `{ nickname, phone, code, password }` | `{ token, user }` | 注册并自动登录 |
| `wechatLogin` | `POST /auth/wechat` | `{ code }` | `{ token, user }` | 微信登录（`wx.login` 换 code） |
| `getSites` | `GET /sites?category=&keyword=&page=&pageSize=` | `{ category, keyword, page = 1, pageSize = 10 }` | `{ list, total, hasMore }` | 史料列表、分类筛选、关键词搜索 |
| `getSiteDetail` | `GET /sites/:id` | `id` | `Site` | 史料详情 |
| `reportSiteView` | `POST /sites/:id/view` | `id` | `{ viewCount }` | 浏览数上报（同日同点去重） |
| `addFavorite` | `POST /sites/:id/favorite` | `id, type = 'site'` | `{ favorited: true, favoriteCount }` | 收藏 |
| `removeFavorite` | `DELETE /sites/:id/favorite` | `id, type` | `{ favorited: false, favoriteCount }` | 取消收藏 |
| `createCheckin` | `POST /checkins` | `{ siteId, lat, lng }` | `{ checkin, count, distance, isNew }` | 到点打卡 |
| `getRoutes` | `GET /routes` | `{ theme?, keyword? }` | `Route[]` | 走街列表、路线筛选 |
| `getRouteDetail` | `GET /routes/:id` | `id` | `{ route, sites }` | 路线详情（含点位详情） |
| `getMe` | `GET /me` | — | `User` | 我的页资料 |
| `updateMe` | `PATCH /me` | `{ nickname?, avatar?, bio? }` | `User` | 编辑资料 |
| `getMyCheckins` | `GET /me/checkins` | `{ page, pageSize }` | `{ list, total, hasMore }` | 我的打卡点 |
| `getMyFavorites` | `GET /me/favorites` | `{ type?, page, pageSize }` | `{ list, total, hasMore }` | 我的收藏 |
| `getMessages` | `GET /messages` | — | `Message[]` | 消息列表 |
| `aiRestore` | `POST /ai/restore` | `{ siteId }` | `{ url, notice: 'AI 生成 / 仅供想象' }` | AI 复原影像 |
| `getPreferences` ※ | `GET /me/preferences` | — | `Preference` | 喜好设置读取（9.5 未列，按模型补充） |
| `savePreferences` ※ | `PUT /me/preferences` | `Preference 部分字段` | `Preference` | 喜好设置保存（9.5 未列，按模型补充） |
| `markMessageRead` ※ | `PATCH /messages/:id/read` | `{ id }` | `{ id, read: true }` | 消息已读（9.5 未列，按模型补充） |

- 标 ※ 的三条是 9.5 未列出、但 `Preference` / `Message` 模型必需的最小补充接口，只能访问本地 Mock 与 Storage，不得扩展成其他接口。
- 搜索聚合不新增接口：综合搜索 = `getSites({ keyword })` + `getRoutes({ keyword })` 在 `search` 页合并分组（史料 / 点位 / 路线）。
- 收藏/取消收藏传 `type` 时，`route` 收藏只落本地 `byxz_favorites` + `mock/user.js`，不改 `Site.favoriteCount`。

### 6.4 分页、格式化与 Storage key

- 列表分页固定每页 10 条；`hasMore` 由 `total` 与 `page * pageSize` 比较得出，不得由页面自行推算。
- 数字格式化：≥1000 显示 `2.6k`，≥10000 显示 `1.2w`；时间格式：今天 `14:32`、昨天、更早 `2026.10.01`，统一走 `utils/format.js`。
- Storage key 前缀固定 `byxz_`，全部在 `utils/storage.js` 中定义，禁止页面硬编码字符串：

| key | 类型 | 内容 |
|---|---|---|
| `byxz_token` | String | 登录 token |
| `byxz_user` | Object | 当前用户 |
| `byxz_redirect` | String | 登录后回跳路径（登录成功即清除） |
| `byxz_font_scale` | Number | 字体缩放 0.9—1.3 |
| `byxz_font_follow_system` | Boolean | 跟随系统字号，默认 false |
| `byxz_preferences` | Object | `Preference` |
| `byxz_privacy` | Object | `{ footprintVisible, displayMode }` |
| `byxz_search_history` | Array | 搜索历史，≤10 条 |
| `byxz_checkins` | Array | `Checkin[]` |
| `byxz_favorites` | Array | `Favorite[]` |
| `byxz_view_log` | Object | `{ [siteId]: 'YYYY-MM-DD' }` 浏览去重 |
| `byxz_walk_progress` | Object | `{ [routeId]: { startAt, doneStops: [] } }` |
| `byxz_subscribe` | Object | `{ checkin, route, system }` 订阅状态 |

## 7. 业务规则（第 10 章逐条落成）

| # | 规则 | 实现要点 | 验证方式 |
|---|---|---|---|
| 1 | 打卡半径 ≤200m 可打卡；≤50m 自动提示；精度 >100m 提示「信号较弱，请稍后重试」 | `utils/location.js` 用 Haversine 计算 `distance`；`distance <= 200` 才允许提交；`<= 50` 调 `wx.showToast('已到达点位附近')`；`accuracy > 100` 直接拒绝并提示原文 | 改模拟定位：210m 置灰、199m 可点、精度 120m 报错 |
| 2 | 同一点位每天最多计 1 次；「打卡数」为累计次数，「足迹数」为去重点位数 | `createCheckin` 内比对 `byxz_checkins` 同日同 `siteId`；已打过返回 `isNew: false` 且 `count` 不变；统计卡分别用 `checkinTotal` 与 `new Set(siteId).size` | 同点连续打 3 次：累计 +1、足迹不变 |
| 3 | 收藏乐观更新，失败回滚；收藏数 k 格式化 | 页面先 `setData` 切换图标，再 await `addFavorite/removeFavorite`；catch 中恢复原状态并 Toast；数字走 `formatCount` | 断网模拟：图标先变后回滚，Toast 出现 |
| 4 | 同设备同一天同一点位只上报一次浏览数 | `reportSiteView` 前查 `byxz_view_log[siteId] === 今天`，命中则直接 resolve 不上报；写入当天日期 | 反复进出详情：`viewCount` 只 +1 |
| 5 | 打卡、收藏、走街开始、我的数据必须登录；浏览与搜索不需要 | 统一用 `auth.requireLogin(pathWithQuery)`：未登录先写 `byxz_redirect` 再 `navigateTo` 登录页；登录成功读 `redirect` 回跳，无则 `switchTab` 回探索/我的 | 游客点收藏 → 登录 → 回到原详情 |
| 6 | 字体缩放 `--fs` 全局生效，0.9—1.3，切换立即生效且持久化 | `app.globalData.fontScale` + `byxz_font_scale`；设置页改后调 `app.applyFontScale()` 并刷新当前页；`app.wxss` 的 `page` 使用 `font-size: calc(28rpx * var(--fs))` 基准 | 设为 1.3：当前页变大，杀进程重进仍为 1.3 |
| 7 | 只在探索、详情、走街按需定位，不后台持续定位 | `wx.getLocation` 仅由用户点击或页面 `onShow` 单次触发；走街 `startLocationUpdate` 在 `onHide`/`onUnload` 调 `stopLocationUpdate` | 切后台 5 分钟：无持续定位回调 |
| 8 | AI 复原必须标注「AI 生成 / 仅供想象」，不暗示真实性，不做人脸 | `ai-restore` 页与详情页 AI 入口固定角标文案；`aiRestore` 返回带 `notice`，页面必须渲染 | 截图检查角标文案逐字出现 |
| 9 | 史料、路线、打卡海报均可分享；分享标题带「埠影寻踪」 | 各页 `onShareAppMessage` 返回 `{ title: '${name}｜埠影寻踪', path, imageUrl }`；完成页 Canvas 2D 海报含路线名、日期、徽章、二维码占位 | 模拟分享面板：每条标题含「埠影寻踪」 |
| 10 | 昵称、简介做敏感词过滤；无公开 UGC 评论区 | `utils/format.js` 或 `api.js` 内置敏感词表（≥30 词）对 `nickname` / `bio` 校验，命中返回 `422` 与中文提示；全站无评论、无公开留言入口 | 输入敏感词：保存被拒并提示 |

## 8. 平台能力（第 11 章）

### 8.1 `app.json` 声明

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "用于展示附近史迹并验证到点打卡"
    }
  },
  "requiredPrivateInfos": ["getLocation", "chooseLocation", "startLocationUpdate"],
  "__usePrivacyCheck__": true
}
```

### 8.2 定位流程

1. 首次定位前弹自定义半屏说明（标题「为什么需要位置」+ 一句用途 + 「暂不开启 / 允许」）。
2. 用户确认后调 `wx.getLocation({ type: 'gcj02' })`；拿到 `accuracy` 后按第 7 节规则 1 校验。
3. 拒绝授权：页面展示「去设置」按钮，点击调 `wx.openSetting`；返回后重新读取 `wx.getSetting` 并重试。
4. 定位不可用（模拟器无定位）时给兜底文案「暂未获取到位置，请到室外重试」，不得白屏。

### 8.3 隐私协议

- 用 `wx.requirePrivacyAuthorize` 包裹首次定位、头像选择与手机号相关操作；用户不同意时只降级功能（不阻塞浏览）。
- 隐私设置页必须能重新唤起隐私授权，并跳转《用户隐私保护指引》。

### 8.4 订阅消息（3 类模板）

| 场景 | 常量 | 模板 ID（占位） | 字段（key：类型 含义） | 触发时机 |
|---|---|---|---|---|
| 打卡提醒 | `TMPL_CHECKIN` | `TMPL_CHECKIN_XXXXXXXX` | `thing1` 点位名称、`time2` 打卡时间、`thing3` 提示语「已记录本次到访」 | 打卡成功后，且 `Preference.notify.checkin` 为 true |
| 路线推荐 | `TMPL_ROUTE` | `TMPL_ROUTE_XXXXXXXX` | `thing1` 路线名称、`number2` 点位数、`phrase3` 推荐理由 | 进入走街页且 `Preference.notify.route` 为 true |
| 系统公告 | `TMPL_SYSTEM` | `TMPL_SYSTEM_XXXXXXXX` | `thing1` 公告标题、`time2` 发布时间、`thing3` 摘要 | 进入消息页且 `Preference.notify.system` 为 true |

- 模板 ID 未配置（空串或仍为占位）时，**只写本地 `byxz_subscribe` 与 `Preference.notify`，不调用 `wx.requestSubscribeMessage`**，并 Toast「订阅模板尚未配置」。配置真实 ID 后才走下方调用：

```js
const ids = [TMPL_CHECKIN, TMPL_ROUTE, TMPL_SYSTEM].filter(Boolean);
if (ids.length) {
  wx.requestSubscribeMessage({
    tmplIds: ids,
    success: (res) => storage.saveSubscribeState(res),
    fail: () => wx.showToast({ title: '订阅未完成', icon: 'none' })
  });
}
```

- 订阅结果必须回写 `byxz_subscribe`，并与喜好设置页三个 Switch 双向同步；拒绝订阅不得阻断主流程。

### 8.5 分享

- 史料、路线、打卡海报均可分享；`onShareAppMessage` 与 `onShareTimeline` 同时实现，`path` 带对应 `id`。
- 探索页分享标题固定「埠影寻踪｜在汕头老城，边走边读百年」；详情/路线标题格式「${名称}｜埠影寻踪」。
- 完成页海报用 Canvas 2D 绘制：路线名、日期、点位印章、二维码占位，导出临时图供分享。

### 8.6 震动与版本

- 收藏成功、打卡成功调 `wx.vibrateShort({ type: 'light' })`，并配图标弹跳；失败不震动。
- 版本检查：`wx.getAppBaseInfo().SDKVersion` 与「2.32.3」「3.0.0」比较，取较高线（实际门槛 3.0.0）；低于门槛弹 `wx.showModal` 提示升级，不阻塞页面渲染。
- 登录能力：`wx.login` 取 code → `api.wechatLogin`；头像用 `<button open-type="chooseAvatar">`，昵称用 `<input type="nickname">`；**禁止使用 `getUserProfile`**。

## 9. 性能与可维护性（第 12 章）

| 项 | 要求 |
|---|---|
| 主包 | 4 Tab + 登录、注册 + 公共组件 + `utils` + 首批封面；目标 ≤1.5MB，硬上限 2MB |
| `subpackages/detail` | `site-detail` / `topic` / `ai-restore`，目标 ≤0.8MB |
| `subpackages/route` | `route-detail` / `walking`，目标 ≤0.6MB |
| `subpackages/user` | 9 个二级页，目标 ≤1.0MB |
| 首屏图片 | 总大小 < 800KB；列表图 750px 宽、质量 80 的 WebP/JPG |
| 列表渲染 | 分页 10 条；`image` 全部 `lazy-load`；骨架屏 3 张卡避免白屏 |
| 地图性能 | marker 一次性 `setData`，选中态单独更新；禁止在 `onLocationChange` 里整体重设 marker |
| 代码规范 | 注释中文；关键函数写 JSDoc；组件样式只用 `rpx` + CSS 变量，禁止行内写死主题色 |
| 依赖 | 零 npm 运行时依赖；`package.json` 只保留必要脚本；不引入 Lottie、UI 库 |
| 可维护 | 时间/数字格式化只在 `utils/format.js`；Storage key 只在 `utils/storage.js`；`api.js` 单点切换后端 |

## 10. 整体联调走查清单

**A. 探索 → 史料 → 详情 → 收藏**

- [ ] 探索页地图 marker 分 4 色，点击出 POI 卡，卡上「详情 / 打卡 / 收藏」三个按钮均有响应。
- [ ] 探索页 2×2 卡片：两张主题卡进专题聚合，「Citywalk路线」切走街 Tab，「AI复原影像」进 AI 复原页。
- [ ] 史料页 5 个胶囊（全部 + 4 分类）筛选正确，切换时先骨架后渲染，空结果文案「这个分类还没有史料」。
- [ ] 卡片角标、浏览数、收藏数、箭头齐全，数字为 `2.6k` 形式。
- [ ] 详情页图集 5 张可滑，今昔对比滑块可拖，AI 图有「AI 生成 / 仅供想象」。
- [ ] 详情页收藏：图标即时变化、Toast、`wx.vibrateShort`；失败可回滚。
- [ ] 详情页浏览数同日只 +1；隔日模拟可再 +1。

**B. 走街 → 路线详情 → 开始走街 → 打卡 → 成就**

- [ ] 走街页 4 条路线，数据行「1.2km · 40分钟 · N个点位」中 N 取自 `stops.length`。
- [ ] 总览条「已解锁 x / 4 条路线」与进度条随打卡变化。
- [ ] 路线卡片进度条与「x/N 已打卡」正确，N 不是写死的 5。
- [ ] 路线详情折线经过全部 `stops`，序号 marker 与时间轴联动。
- [ ] 未登录点「开始走街」跳登录，登录后原路回到走街页。
- [ ] 走街模式可定位跟随、到点 200m 内可打卡、超范围按钮置灰并显示距离。
- [ ] 完成全部点位后弹出完成页，显示用时 / 里程 / 打卡数，可生成海报并分享。

**C. 登录 / 注册 → 我的 → 打卡点 / 收藏 / 设置**

- [ ] 账号密码登录成功 Toast「欢迎回来」，写入 `byxz_token` 与 `byxz_user`。
- [ ] 注册校验（昵称、手机号、验证码 `1234`、密码）逐项报错定位到下划线。
- [ ] 我的页封面、头像、三项统计（打卡数 / 足迹数 / 收藏数）与种子数据一致。
- [ ] 我的打卡点两种视图（列表 / 地图）可切换，按分类筛选可用。
- [ ] 我的收藏三个 Tab（全部 / 史料 / 路线 / 点位）切换正确，空状态完整。
- [ ] 喜好设置三个 Switch 与 `byxz_subscribe` 同步；字体设置 0.9—1.3 立即生效。
- [ ] 编辑资料用 `chooseAvatar` 与 `input type="nickname"`，敏感词被拒。
- [ ] 消息页已读状态更新，未读红点数量正确。

**D. 搜索 → 详情**

- [ ] 搜索输入 300ms 防抖，分组「史料 / 路线 / 点位」联想，关键词高亮。
- [ ] 结果页 Tab「综合 / 史料 / 点位 / 路线」切换正确，点击结果进对应详情。
- [ ] 空结果文案「没有找到相关内容」+ 推荐词。

**E. 全局与异常**

- [ ] 字体缩放 1.3 时 4 个 Tab 与二级页无文字截断、无横向滚动。
- [ ] 未登录拦截：收藏、打卡、走街开始、我的数据四处均拦截；`redirect` 回跳参数不丢失。
- [ ] 断网/接口失败：列表页显示失败态与「重试」，重试后恢复。
- [ ] 空数据：史料空、收藏空、打卡空、消息空均有插画 + 引导 + 按钮。
- [ ] iPhone 14 Pro 与安卓中端机：无 TabBar 遮挡、无横向滚动、安全区正确。
- [ ] 控制台无红色报错、无 `undefined` 字段、无重复 `setData`。

## 11. 验收标准（第 13 章全量 + 本阶段专项）

- [ ] 4 个 Tab 页与登录、注册页可正常切换，自定义 TabBar 高亮正确。
- [ ] 探索页头部拼贴、竖排书法、搜索按钮、地图、2×2 卡片的位置与设计稿一致。
- [ ] 地图 marker 分 4 色，点击出现 POI 卡，可进详情/打卡/收藏。
- [ ] 史料页 5 个分类可筛选，陶土卡片、角标、浏览/收藏数、箭头齐全。
- [ ] 史料详情含图集、今昔对比滑块、AI 复原、打卡、收藏、导航、分享。
- [ ] 走街页 4 条路线数据正确，进度条与「x/N 已打卡」联动（原文「x/5」，分母按 `Route.stops` 实际条数，见第 13 节）。
- [ ] 路线详情地图有折线与序号 marker，点位时间轴可联动。
- [ ] 走街模式可定位、到点打卡、完成页生成海报。
- [ ] 我的页封面、头像、三项统计、5 项菜单与设计稿一致。
- [ ] 打卡点/收藏/喜好/字体/隐私/消息/资料页均可用，空状态完整。
- [ ] 字体缩放全局生效并持久化。
- [ ] 定位拒绝、登录过期、接口失败均有兜底。
- [ ] iPhone 14 Pro 与安卓中端机无横向滚动、无 TabBar 遮挡。
- [ ] 控制台无报错，无未定义变量，无重复 setData。
- [ ] README 含运行步骤、Mock 账号、素材替换清单。
- [ ] `mock/sites.js` 12 条全字段可渲染，分类分布 4/2/3/3。
- [ ] `mock/routes.js` 4 条路线 `stops` 指向存在的 `siteId`，无悬空引用。
- [ ] `api.js` 覆盖第 6.3 节全部接口，`USE_MOCK` 为唯一开关。
- [ ] 全仓库无页面直接引用 `mock/`、无 `wx.request`、无 `wx.cloud.database()`。
- [ ] Storage key 全部 `byxz_` 前缀且只在 `utils/storage.js` 出现字面量。
- [ ] 打卡半径、精度、每日一次三条规则可复现。
- [ ] 收藏乐观更新与失败回滚可复现。
- [ ] 订阅模板未配置时不调用 `wx.requestSubscribeMessage` 且给出中文提示。
- [ ] 全站无旧版命名与旧页面路径。

## 12. 约束与禁止

1. **不引入后端依赖**：不建云函数、不调 `wx.cloud.database()`、不引 npm 包、不请求外部域名；数据只来自 `mock/` + `wx.setStorageSync`。
2. **不残留旧版命名**：禁止 `pages/heritage*`、`pages/street*`、`pages/mine*`、`utils/db.js`、`utils/data.js`、`quickstart`、`goods/examples/business/usercenter`；产品名只用「埠影寻踪」，「埠藏史库」仅可作为 slogan 与书法文案。
3. **所有页面必须走 `api.js`**：页面不得出现写死的 `2.6k`、`860`、种子数组或 `wx.getStorageSync('byxz_checkins')` 直接读取业务数据。
4. **不改契约**：不得改 20 条路由、7 个模型字段名、`kaibu|qiaoxiang|wenjiao|hongse` 枚举、18 个色值 Token 与 `byxz_` 前缀。
5. **不写空壳**：不得用 `TODO` 占位核心逻辑，不得返回空数组让页面「看起来能跑」；Mock 必须完整可渲染。
6. **不做范围外功能**：不加评论、私信、排行榜、支付、真实 UGC；不加除第 6.3 节以外的接口。
7. 本阶段结束后，`01—04` 的页面必须回归一次，确认改为 `api.*` 后没有出现空数据或字段 `undefined`。

## 13. 上传文档口径冲突处理

| # | 冲突 | 处理 |
|---|---|---|
| 1 | 第 7 章路线表写「5 / 5 / 4 / 4 个点位」，第 13 章验收写「x/5 已打卡」，但 9.2 的 `route_01` 只给 4 个 `stops` | **一律按 `Route.stops` 实际条数渲染**：点位数、进度分母都用 `stops.length`，文案模板「x/{{stops.length}} 已打卡」「{{stops.length}}个点位」；`route_01` 采用 9.2 原文 4 个点，不人为凑 5 |
| 2 | 第 13 章称「史料页 5 个分类」，第 7 章胶囊为「全部 / 开埠外交 / 侨乡商贸 / 文教宗教 / 红色革命」，第 9 章只有 4 个分类枚举 | 「5 个」指**胶囊 5 项含「全部」**；数据枚举固定 4 个（`kaibu` / `qiaoxiang` / `wenjiao` / `hongse`）。AI 复原**不是分类**，只是探索页入口卡与 `ai-restore` 页面，不得新增 `ai` 枚举 |
| 3 | 上传文档个别页面标注的书法标题字号与共享基线字体表不完全一致 | 书法主标题统一取 `00-baseline` §4.3 的 **64rpx / 1.15**，渐变 `linear-gradient(180deg, #C9705A 0%, #B65A44 100%)`；页面段落若写其他字号，以基线为准 |
| 4 | 文档要求「保留 `USE_MOCK` 开关、可无缝切云开发/后端」，但未给任何模板 ID、AppID 之外的后端信息；基线又要求 01—05 不实现云函数 | 只做**接口抽象与开关**：`USE_MOCK = true` 时全走本地 Mock，`false` 时请求 `BASE_URL`；不写云函数、不配环境 ID、不引 `wx.cloud` |
| 5 | 第 4 章写「主包只放 4 个 Tab + 登录」，但第 6 章路由把注册页列为主包普通页 | 注册页随登录页同放主包（`pages/register/index`），Tab 与主包归属按 `00-baseline` 第 5 节执行，不改路由表 |

- 以上 5 条之外的一切冲突，以 `docs/codex-prompts/00-baseline.md` 为准；确需变更契约时先改基线，再同步本文件。
