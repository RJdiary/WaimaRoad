# 埠影寻踪 · Codex 重建提示词包使用说明

## 1. 这是什么

- `d:\WaimaRoad` 是一个**只剩需求与提示词**的仓库：`miniprogram/` 与 `cloudfunctions/` 已清空，代码全部由 Codex 按本目录的提示词从零写出。
- 提示词描述的是**重建后的目标实现**，不是对旧代码的逐行复制；旧实现只在需要查证时用快照恢复（见第 8 节）。
- 技术事实：微信原生小程序（JS + WXML + WXSS）、**零 npm 依赖**、WebView 渲染（禁止 Skyline）、基础库 `3.17.0`、appid `wx14264fd3b18c547f`、主包 4 Tab + 登录、注册。

## 2. 文件清单

| 文件 | 职责 | 产出物 |
| --- | --- | --- |
| `CODEX-RUNBOOK.md` | **人看的手册**：在 Codex 里怎么一步步操作（新开会话、发什么、怎么验收、怎么回滚） | 无代码 |
| `AGENTS.md` | Codex 工作约定（**复制到仓库根目录**后生效）：读取顺序、硬约束、阶段协议、DoD | 无代码 |
| `00-baseline.md` | 01–05 共享事实源：产品定义、设计 Token、路由表、组件约定、数据模型索引、业务规则、命名禁忌 | 无代码，每次任务必读 |
| `01-scaffold-theme.md` | 工程骨架与设计系统 | `app.js` / `app.json` / `app.wxss` / `sitemap.json`、`project.config.json` 清理、`custom-tab-bar/`、20 条路由空壳、`utils/*` 骨架、5 个基础组件 |
| `02-explore-archive.md` | 探索页与史料页 | `pages/explore/*`（拼贴头部、竖排书法、地图 + marker + POI 卡、2×2 入口卡、搜索入口）、`pages/archive/*`（分类胶囊、陶土卡、骨架/空态/加载更多）、`site-card` / `filter-chips` |
| `03-detail-walk.md` | 详情、专题、AI 复原与走街 | `subpackages/detail/pages/{site-detail,topic,ai-restore}`、`subpackages/route/pages/{route-detail,walking}`、`route-card` / `map-poi-sheet` / `compare-slider` / `checkin-sheet` |
| `04-auth-profile-user.md` | 登录注册、我的与用户中心 | `pages/{login,register}`、`pages/profile`、`subpackages/user/pages/` 下 9 页 |
| `05-data-platform-acceptance.md` | 数据层、Mock、API、业务规则、平台能力与整体验收 | `utils/api.js` 最终版、`utils/storage.js`、`mock/{sites,routes,user}.js`、联调走查与验收勾选 |
| `06-web-prototype-buildwebapps.md` | **可选前置阶段**：用 Codex `build-web-apps` 插件做浏览器视觉原型 | `prototype/index.html`（参考物，非交付物） |
| `07-assets-swap.md` | **收尾阶段**：把设计稿细节图 / 实拍照片一一接进 `assets/`，替换占位图（只换文件与路径，不改版式） | 最终 `assets/`、`mock/sites.js` 图片字段、`assets/README.md` 台账 |

同级需求文档：`docs/prd.md`（PRD，做什么/验收）、`docs/ui_design.html`（视觉规范 + 6 屏原型）、`docs/cloud-database.md`（数据层与云开发迁移）。

## 3. 两条执行路径

**路径 A（默认，最快）**：直接 01 → 05。

```
00-baseline.md（必读，不是可执行阶段）
        │
        ▼
01 工程骨架与设计系统 → 02 探索/史料 → 03 详情/走街 → 04 登录/我的/用户中心 → 05 数据层与验收
```

**路径 B（视觉要求高时）**：先出浏览器原型，冻结视觉，再走 A。

```
00-baseline.md → 06 原型（build-web-apps）→ 视觉冻结 → 01 → 02 → 03 → 04 → 05
```

- 必须从 `01` 开始实现：`02` 依赖 `app.wxss` 的 Token、`app.json` 路由与自定义 TabBar；`03` 依赖 `02` 的卡片与跳转约定；`04` 依赖前三阶段的 4 个 Tab 与详情页；`05` 最后收口并回归 `01–04`。
- **分包与组件时序**：`01` 只建 `subpackages/` 空壳路由与 5 个基础组件，不得一次性实现 20 页；`02` 落地 `site-card` / `filter-chips`；`03` 落地 `route-card` / `map-poi-sheet` / `compare-slider` / `checkin-sheet`；`04` 复用既有组件，不新造重复组件。
- 任何阶段都不得顺手重写别的阶段文件；跨文件只允许按该阶段列出的清单新增/修改。阶段间不得改 `00-baseline` 的路径、字段、色值、Token 名。

## 4. 每阶段完成后怎么验收

1. 打开该阶段文件，逐条勾选文末「验收标准」；未勾满不得进入下一阶段；`05` 另需勾完「整体联调走查清单」。
2. 微信开发者工具打开 `d:\WaimaRoad` 编译：无红色报错、无 npm 构建提示、无「页面不存在」、无 Skyline 提示。
3. 主链路走查（模拟器 + 真机各一遍）：探索 → 史料 → 详情 → 收藏；走街 → 路线详情 → 开始走街 → 打卡 → 成就；登录/注册 → 我的 → 打卡点/收藏/设置；搜索 → 详情。
4. 抽查命名：不得出现 `pages/heritage*`、`pages/street*`、`pages/mine*`、`quickstart`、`goods/examples/business/usercenter`、济南地名；产品名只用「埠影寻踪」。
5. 抽查数据：页面数据必须来自 `utils/api.js`，不得写死统计数字、不得直接引用 `mock/` 或 `wx.cloud.database()`。

## 5. 单阶段失败如何回退

- **先重跑该阶段**：把该阶段文件原文 + `00-baseline.md` 重新交给 Codex，并附失败现象（控制台日志、报错截图、未通过的勾选项），不要只描述「报错了」。
- **只回滚该阶段文件**：用 `git status` 定位改动，按文件 `git checkout -- <该阶段文件>`；未跟踪的新文件直接删除。禁止 `git reset --hard`。
- **以 `00-baseline.md` 重述需求**：若实现与基线冲突（改名、改色值、改字段、加依赖、加页面），删除该实现并按基线重写。
- 反复失败时缩小任务：拆成「只建页面与样式」与「只接 `api.js` 数据」两次会话，仍以该阶段验收章节为准。
- 回退后必须重新完整编译，并重跑上一阶段已通过的验收项。

## 6. 与上传《埠影寻踪》提示词文档的对应关系

| 上传文档章节 | 落到哪里 |
|---|---|
| 第 0 章 投喂顺序 | 本 README 第 3 节；每阶段先复述再写代码 |
| 第 1—3 章 角色、项目背景、设计稿解读 | `00-baseline.md` §1；`docs/prd.md` §1—§2 |
| 第 4—5 章 技术栈、全局设计规范 | `00-baseline.md` §2—§4；`01` 落地为 `app.wxss` 与 `app.json`；视觉样张见 `docs/ui_design.html` |
| 第 6 章 路由与信息架构（20 页） | `00-baseline.md` §5；`docs/prd.md` §3；`01` 建空壳 |
| 第 7 章 页面逐个规格 | `docs/prd.md` §4；登录/注册与用户中心 → `04`；探索/史料 → `02`；详情/专题/AI 复原/路线/走街 → `03` |
| 第 8 章 公共组件 | `00-baseline.md` §6 |
| 第 9—10 章 数据模型与业务规则 | `05` §4—§7；`docs/cloud-database.md` |
| 第 11—12 章 平台能力与性能 | `05` §8—§9；`docs/prd.md` §8—§9 |
| 第 13—14 章 验收与输出要求 | `05` §10—§11；`docs/prd.md` §11 |

## 7. 与 Codex 的两件工具事实

### 7.1 `build-web-apps` 插件只做原型

- 该插件（`openai/plugins` 的 `build-web-apps`）打包的是 `frontend-app-builder` / `frontend-testing-debugging` / `react-best-practices` / `shadcn-best-practices` / `stripe-best-practices` / `supabase-best-practices`，目标产物是**浏览器里的 React/Next 应用**。
- 本项目交付物是**微信原生小程序 + 零 npm**，两者技术栈不重叠：插件不能生成 WXML/WXSS，也不能替代微信开发者工具验收。
- 正确用法：只把它用于 `06` 阶段的视觉原型，冻结后按 01—05 手写。详见 `06-web-prototype-buildwebapps.md`。

### 7.2 `.trae/` 里的资产要不要用

| 资产 | 结论 | 原因 |
| --- | --- | --- |
| `.trae/skills/wechat-subscription-guide` | **暂不使用，留作备用** | 只在真正接入订阅消息（模板 ID、`requestSubscribeMessage`、一次性订阅授权）时才需要。当前 `05` 的口径是「模板 ID 未配置时只写本地状态、不调 API」，此时加载它只会诱导 Codex 提前写调用。等模板 ID 到位，再把该 skill 复制到 Codex 的 skills 目录（或把要点并进 `05` §8.4）。 |
| `.trae/skills/frontend-design` | **不使用** | 它是「让 AI 大胆选风格、避免通用 AI 审美」的创作型指令，与本项目「按设计稿 1:1 还原、色值不得新增」直接冲突；且与 `build-web-apps` 自带的 `frontend-app-builder` 职责重叠。 |
| `.trae/skills/prd-writer` | **不使用** | 它用于从零写 PRD；本仓库 PRD 已定稿（`docs/prd.md`），让 Codex 重写只会产生第二套事实。 |
| `.trae/specs/reset-for-codex-rebuild/` | **已删除（2026-11-01）** | 上一轮 Trae 的规格：文件清单指向已不存在的 `02-explore-heritage.md` / `05-cloud-data-integration.md`，设计 Token 写的是旧版 `--primary-brown #CC795B`，与 `00-baseline.md` 冲突。已归档到 `.design-pdf/_archive/trae-specs-2026-11-01.zip` 后移除。 |
| `.trae/specs/city-heritage-miniprogram/` | **已删除（2026-11-01）** | 旧产品「埠藏史库」的规格，同样与现行基线冲突；可从 git 历史恢复（删除前已跟踪）。 |

> 一句话：**`.trae` 下的 skill 一个都不用现在就装**。唯一有长期价值的是 `wechat-subscription-guide`，等订阅消息真要接时再上；两份过期 specs 已于 2026-11-01 清除，避免 Codex 读到两套事实。

## 8. 旧实现如何恢复

- 重建前快照提交：`cf621a5`（`chore: snapshot miniprogram before codex rebuild reset`），所在分支 `codex/ui`。
- 该快照是**旧版「埠藏史库」实现**（旧页面路径 `pages/heritage*` / `pages/street*` / `pages/mine*`、旧云开发数据层，并含模板遗留），**仅供查证，不是新产品的重建产物**。
- 查看单个旧文件：

```bash
git show cf621a5:miniprogram/pages/explore/index.js
git ls-tree -r --name-only cf621a5 -- miniprogram cloudfunctions
```

- 整体恢复（会覆盖工作区，先提交当前改动）：`git checkout cf621a5 -- miniprogram cloudfunctions`。
- 查证完毕用 `git checkout HEAD -- <文件>` 还原，避免旧命名回流。

## 9. 文档优先级与作废清单

| 优先级 | 文档 | 说明 |
| --- | --- | --- |
| 1 | `00-baseline.md` | 路径、Token、字段、规则的唯一准绳 |
| 2 | `01`—`05` 阶段文件 | 各阶段实现细则 |
| 3 | `docs/prd.md` | 业务口径与验收 |
| 4 | `docs/ui_design.html` | 视觉细节与版式 |
| 5 | `docs/cloud-database.md` | 数据层与迁移（实现以 `05` 为准） |

**已作废，不要读**：`.trae/specs/*`、任何旧版「埠藏史库·街绘行图」命名、旧「城市历史文化探索」PRD 内容（已被 V2.0 PRD 覆盖）。
