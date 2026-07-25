# 外马路微信云开发接入说明

项目已在 `miniprogram/app.js` 中配置云环境，并且页面会优先读取云数据库；集合为空或网络不可用时会自动使用本地演示数据，避免白屏。

## 在微信开发者工具中部署

1. 打开 `D:\WaimaRoad`，确认云开发环境 ID 与项目实际环境一致。
2. 在云开发控制台创建以下集合：`heritages`、`routes`、`points`、`favorites`、`checkins`、`users`。
3. 将 `miniprogram/utils/data.js` 中的 `heritages`、`routes`、`points` 分别导入前 3 个集合。每一条史料需要保留数字字段 `id`；点位保留 `routeId`、`lat`、`lng` 与 `heritageId`。
4. 在开发者工具中上传并部署现有云函数；首次使用无需调用云函数，客户端会直接读取数据库。

## 最小权限建议

- `heritages`、`routes`、`points`：所有用户可读，仅管理员可写。
- `favorites`、`checkins`、`users`：仅创建者可读写。

不要把管理写权限开放给所有用户。正式上线前，应在云开发控制台按实际运营账号配置管理员写入权限。

## 数据字段

### heritages

`id`、`title`、`category`、`categoryName`、`categoryEmoji`、`emoji`、`imgStyle`、`location`、`era`、`summary`、`detail`、`tags`、`views`、`favorites`、`isAiRestored`

### routes

`id`、`name`、`theme`、`themeColor`、`pointCount`、`duration`、`distance`、`points`、`description`

### points

`id`、`routeId`、`name`、`lat`、`lng`、`summary`、`heritageId`、`status`

AI 生成的历史场景图必须保留“AI辅助复原”说明，不应作为未经核验的史实发布。
