# 数据层与云开发迁移说明

> 本文对应《埠影寻踪》的**数据事实**：本地 Mock 结构、`utils/api.js` 契约、Storage key、以及未来切云开发（或自有后端）时的迁移路径。
> 字段与模型以 `docs/codex-prompts/00-baseline.md` §7、§8 为准；本文是它的工程化展开。

---

## 1. 数据层总览

```
页面（pages / subpackages）
   │  只调用业务方法，不碰 wx.getStorageSync、不 require mock/
   ▼
utils/api.js   ← USE_MOCK 唯一开关，统一 { code, data, msg }，300—600ms 模拟延迟
   │
   ├─ USE_MOCK = true  → mock/sites.js / mock/routes.js / mock/user.js + utils/storage.js
   └─ USE_MOCK = false → wx.request → 云开发 HTTP 网关 / 自有后端
```

**纪律（硬约束）**

1. 页面只能 `const api = require('../../utils/api')` 后调 `api.xxx()`，**禁止**直接读写 `mock/*`、`wx.cloud.database()`、`wx.getStorageSync('byxz_checkins')`。
2. 所有响应统一 `{ code, data, msg }`：`code === 0` 成功；`401` 未登录（清 token 走登录拦截）；`404` 不存在；`422` 参数错误；`500` Mock 内部异常。
3. 写操作（打卡、收藏、浏览上报）在 Mock 下也必须走 `api.js`，保证切后端时页面零改动。
4. 时间字段统一 **ISO 字符串**（`new Date().toISOString()`），由 `utils/format.js` 负责展示；禁止在页面里各写一套格式化。

---

## 2. Mock 文件划分

| 文件 | 内容 | 规模 |
| --- | --- | --- |
| `mock/sites.js` | `Site[]` 史料点位 | 12 条，覆盖 4 个分类 |
| `mock/routes.js` | `Route[]` 路线 + `stops` 点位序列 + `polyline` | 4 条 |
| `mock/user.js` | 用户种子、收藏、打卡、偏好、消息、订阅状态 | 1 用户 + 若干条 |

- 坐标除 `site_001` 外均为示意值，接入真机前用**腾讯地图坐标拾取器**校准。
- 图片字段一律指向本地 `assets/`；缺图时置空字符串，由页面 `.media-placeholder` 分支渲染「暖色渐变 + 建筑名」占位，**不得**引用外链。

---

## 3. Storage Key（唯一清单，前缀 `byxz_`）

> 由 `utils/storage.js` 的 `KEYS` 集中导出，页面与组件**不得**出现裸字符串 key。命名一律 `byxz_` + 小写下划线，与阶段 03/04/05 完全一致。

| Key | 类型 | 内容 | 写入方 |
| --- | --- | --- | --- |
| `byxz_token` | String | 登录 token | `auth.login` / 登录页 |
| `byxz_user` | Object | `{ id, nickname, avatar, phone, bio, createdAt }` | `auth.login` / `auth.updateUser` |
| `byxz_redirect` | String | 登录后回跳路径（含参数，`encodeURIComponent` 编码），登录成功即清除 | `auth.requireLogin` |
| `byxz_font_scale` | Number | 字号缩放 0.9—1.3，默认 `1`，保留两位小数 | 字体设置页 / `app.setFontScale` |
| `byxz_font_follow_system` | Boolean | 跟随系统字号，默认 `false` | 字体设置页 |
| `byxz_preferences` | Object | `{ themes[], recommendBias, notify{checkin,route,system}, showLost, mapLayer }` | 喜好设置页 |
| `byxz_privacy` | Object | `{ footprintVisible: false, displayMode: 'nickname' }` | 隐私设置页 |
| `byxz_search_history` | Array\<String\> | 搜索历史，≤10 条，最新在前 | 搜索页 |
| `byxz_favorites` | Array | `Favorite[]`：`{ id, type: 'site'\|'route', targetId, createdAt }` | `api.addFavorite` / `api.removeFavorite` |
| `byxz_checkins` | Array | `Checkin[]`：同日同 `siteId` 只新增 1 条，`count` 为累计次数 | `api.createCheckin` |
| `byxz_view_log` | Object | `{ [siteId]: 'YYYY-MM-DD' }` 浏览去重 | `api.reportSiteView` |
| `byxz_walk_progress` | Object | `{ [routeId]: { startAt, doneStops: [] } }` | 走街进行中 |
| `byxz_subscribe` | Object | `{ checkin, route, system }` 订阅授权状态 | 隐私设置 / 订阅调用回调 |
| `byxz_locationTip` | Boolean | 是否已展示过「开启定位」提示条，避免每次进入都打扰 | 探索页 |

**读写约定**

- 统一经 `storage.get(key, default)` / `storage.set(key, value)` / `storage.remove(key)`，内部 `try/catch` 并 `console.warn`，失败返回默认值而不是抛错。
- 「清除缓存」只删除上表中除 `byxz_token`、`byxz_user` 外的 key；「退出登录」只清 `byxz_token`、`byxz_user` 与 `globalData`，保留字体、偏好、历史。

---

## 4. 云端集合设计（切云开发时照建）

Mock 与云端**同名同结构**，切换只改 `utils/api.js` 内部实现。

### 4.1 `sites`（史料点位，只读）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `_id` / `id` | String | `_id` 为云端主键；`id` 保留业务 id（`site_001`），前端一律用 `id` |
| `name` / `alias` | String | 点位名 / 别称 |
| `category` | String | `kaibu` / `qiaoxiang` / `wenjiao` / `hongse` |
| `categoryName` | String | 中文分类名 |
| `cover` / `images` | String / Array | 封面与图集 |
| `summary` / `description` | String | 一行简介 / 3—5 段长文 |
| `address` / `location` | String / Object | 地址 / `{ lat, lng }` |
| `era` / `structure` / `originalUse` / `currentStatus` | String | 建筑小档案 4 项 |
| `openTime` | String | 开放时间 |
| `viewCount` / `favoriteCount` / `checkinCount` | Number | 展示数，前端 k 格式化 |
| `oldPhotos` | Array | `[{ url, year, source }]` 今昔对比老照片 |
| `aiRestored` | String | AI 复原图路径（须标注「AI 生成」） |
| `audio` | Object | `{ url, duration }` |
| `tags` | Array | 关键词 |

- 索引：`category`（普通）、`location`（地理索引，用于附近排序）。
- 权限：所有用户可读，仅管理员可写。

### 4.2 `routes`（路线，只读）

`id`、`name`、`theme`、`themeName`、`distance`(km)、`duration`(min)、`intro`、`stops`（`site.id` 数组，决定点位数）、`polyline`、`order`。

- 索引：`order`；`theme`。
- **点位数一律由 `stops.length` 得出**，不存冗余 `pointCount`。

### 4.3 `users`（仅创建者可读写）

`_openid`、`id`、`nickname`、`avatar`、`phone`、`bio`、`createdAt`、`preferences`、`privacy`、`fontScale`、`subscribe`。

- 昵称、简介入库前做**敏感词过滤**（无公开 UGC 区，但仍需过滤）。
- 手机号存脱敏展示值 + 密文两列时，前端只取脱敏值。

### 4.4 `checkins`（仅创建者可读写）

`_openid`、`id`、`siteId`、`siteName`、`cover`、`time`(ISO)、`lat`、`lng`、`distance`、`count`。

- 唯一性：`(_openid, siteId, 日期)`；由 `api.createCheckin` 先在本地比对，服务端再做一次幂等。
- 统计：`打卡数` = 记录总数（含同日重复累计的 `count` 语义见基线 §8）；`足迹数` = `distinct siteId`。

### 4.5 `favorites`（仅创建者可读写）

`_openid`、`id`、`type`、`targetId`、`createdAt`；唯一性 `(_openid, type, targetId)`。

### 4.6 `messages`（只读 / 定向投递）

`id`、`type`(`system`|`interact`)、`title`、`summary`、`time`、`read`、`link`。

> 云开发权限速记：`sites`、`routes`、`messages` —— 所有人可读、仅管理端可写；`users`、`checkins`、`favorites` —— 仅创建者可读写。**不得**给任何集合开「所有人可写」。

---

## 5. `utils/api.js` 接口清单

保持方法签名稳定是迁移的前提；页面调用方不需要知道底层是 Mock 还是云端。

```
POST /auth/login          auth.login({ account, password })
POST /auth/register       auth.register({ nickname, phone, code, password })
POST /auth/wechat         auth.wechatLogin({ code })
GET  /sites               getSites({ category, keyword, page, pageSize })
GET  /sites/:id           getSiteDetail(id)
POST /sites/:id/view      reportSiteView(id)
POST /sites/:id/favorite  addFavorite({ type: 'site', targetId }) / removeFavorite(...)
POST /checkins            createCheckin({ siteId, lat, lng })
GET  /routes              getRoutes()
GET  /routes/:id          getRouteDetail(id)
GET  /me                  getMe()
PATCH /me                 updateMe(patch)
GET  /me/checkins         getMyCheckins()
GET  /me/favorites        getMyFavorites()
GET  /messages            getMessages()
POST /ai/restore          aiRestore({ siteId })
```

- 分页：列表每页 **10** 条，返回 `{ list, total, hasMore }`。
- `request()` 统一注入 `byxz_token`；`401` 时清 token 并 `auth.requireLogin(当前页路径)`。

---

## 6. 切云开发的步骤（页面零改动）

1. 开发者工具里开通云开发，记录环境 ID；在 `app.js` 的 `onLaunch` 中 `wx.cloud.init({ env, traceUser: true })`（Mock 阶段**不调用**）。
2. 云端建 6 个集合：`sites`、`routes`、`users`、`checkins`、`favorites`、`messages`，按第 4 节配权限与索引。
3. 把 `mock/sites.js`、`mock/routes.js` 通过控制台 JSON 导入 `sites`、`routes`（保留业务 `id` 字段）。
4. 改 `utils/api.js`：`USE_MOCK = false`，按方法逐个替换为 `db.collection(...)` 调用，**保持返回结构 `{ code, data, msg }` 不变**。
5. 需要服务端校验的动作（打卡到点判定、AI 复原任务）再引入云函数；其余读写走数据库权限即可。
6. 回归阶段 05 §10 的联调走查清单，确认页面无改动、无新增报错。

**可选云函数**（当前版本不实现，仅预留）

| 云函数 | 职责 |
| --- | --- |
| `checkin` | 服务端复核 200m 半径、幂等去重、累加 `checkinCount` |
| `aiRestore` | 记录生成任务、返回占位图、写入审计日志 |
| `sendSubscribeMessage` | 新史料上线 / 走街提醒 / 成就通知（模板 ID 未配置时不调用） |

---

## 7. 容量与合规

- 12 条点位 × 5 张图、4 条路线：本地 Mock 阶段无体积压力；云端首版建议单文档 < 16KB（`description` 过长时拆 `site_contents`）。
- 不存密码明文；`account/password` 仅用于 Mock 演示登录，切真实后端后改为 `wx.login` + 服务端换取会话。
- 定位坐标只用于距离计算与打卡判定，不做轨迹留痕、不在后台持续定位。
- AI 复原图必须带「AI 生成 / 仅供想象」说明，禁止作为史实图片分发。

---

## 8. 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 切云端后列表空白 | 云端文档缺业务 `id`，页面按 `id` 取值 | 导入时保留 `id`，或用 `_id` 映射一层 |
| 打卡数翻倍 | 页面直接写了 Storage，`api` 又写一次 | 业务写操作只允许 `api.js` 一处 |
| 收藏状态不同步 | 用 `favoriteCount` 反推「我是否收藏」 | 收藏态查 `byxz_favorites`，计数只做展示 |
| 字体设置重启失效 | 页面写了 `--fs` 但没读 `byxz_font_scale` | `app.js` 启动回填 + 页面根节点注入 `getPageStyle()` |
| 关键词 key 拼错 | 页面手写 `byxz_` 字符串 | 一律 `storage.KEYS.xxx` |
