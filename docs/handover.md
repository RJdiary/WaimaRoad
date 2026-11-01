# 埠影寻踪 · 文档整理交付说明（整合版）

> 本文把本轮对话的所有结论合成一份，供交接/复查使用。
> 时间：2026-11-01 ｜ 仓库：`D:\WaimaRoad` ｜ 分支：`codex/ui`

---

## 0. 一句话总结

docs/ 已从「旧产品（城市历史文化探索 / 埠藏史库）」整体换成「埠影寻踪」的口径：PRD、视觉规范、数据层、7 个阶段提示词全部对齐同一套 Token / 路由 / 字段；并明确了三件工具事实——`build-web-apps` 只做视觉原型、`.trae` 的 skill 现在一个都不用装、可切的图在即时设计源文件而不在 PDF 里。

---

## 1. 这次做了什么

| 文件 | 动作 | 结果 |
| --- | --- | --- |
| `docs/prd.md` | **重写** | 419 行 PRD V2.0：定位/用户/闭环、14 张设计稿取舍表、20 页路由、功能编号（EXP/ARC/DTL/WALK/MY/TPC/AIR/SRC）+ P0/P1/P2、10 条业务规则、数据模型与 12 点位、平台合规、NFR、5 阶段交付、验收与风险、术语与章节映射 |
| `docs/cloud-database.md` | **重写** | 193 行：Mock 架构、14 个 `byxz_` Storage key 全表、6 个云端集合（字段/权限/索引）、`api.js` 接口清单、切云开发 6 步（页面零改动）、常见坑 |
| `docs/ui_design.html` | **重写** | 963 行、零外链：18 个 Token 色板、字体层级样张、圆角/阴影/动效表、**6 屏原型**（探索/史料/详情/走街/我的/登录），750rpx→0.5px 换算，可直接浏览器打开 |
| `docs/codex-prompts/README.md` | 重写 | 双轨流程（A 直接 01–05 / B 先原型）、Codex 工具事实、`.trae` 逐项结论、文档优先级与作废清单 |
| `docs/codex-prompts/00-baseline.md` | 修补 | 字号步进写明 0.05/两位小数、补 `byxz_locationTip`、阶段索引加 00 与 07、明确「素材接入见 07」 |
| `docs/codex-prompts/01-scaffold-theme.md` | 修补 | key 名统一 snake_case、字号两位小数、前置状态改为「与你对齐，冲突以基线为准」 |
| `docs/codex-prompts/03-detail-walk.md` | 修补 | `byxz_view_log` 统一为 `{ [siteId]: 'YYYY-MM-DD' }` 映射（原写「数组」） |
| `docs/codex-prompts/05-data-platform-acceptance.md` | 修补 | 对比图数量改 36（12×3：`-old-1`/`-old-2`/`-now`）、指向 07 阶段 |
| `docs/codex-prompts/06-web-prototype-buildwebapps.md` | **新增** | 125 行：插件边界、可直接复制的原型提示词、视觉冻结与交接、反模式 |
| `docs/codex-prompts/07-assets-swap.md` | **新增** | 263 行：素材接入全流程（目录命名表、即时设计导出步骤与 5 个坑、三种接线方式、体积红线、6 批接入、Codex 提示词、12 条验收、8 个常见坑、台账模板） |
| `docs/codex-prompts/AGENTS.md` | **新增** | 73 行 Codex 行为约定（读取顺序、8 条硬约束、阶段协议、DoD、回退）——复制到仓库根目录即生效 |
| `docs/codex-prompts/CODEX-RUNBOOK.md` | **新增** | 人看的操作手册：准备、每阶段固定循环、五阶段消息模板、06/07 怎么开、出问题怎么回滚、命令速查、十条禁忌 |
| `.trae/specs/` | **删除** | 两份过期规格先归档到 `.design-pdf/_archive/trae-specs-2026-11-01.zip` 再删除；`.trae/skills/` 保留未动 |
| `README.md` | 更新 | 目录说明、重建步骤（加 06/07）、插件与 `.trae` 结论、设计稿位置 |
| `.gitignore` | 更新 | 忽略 `.design-pdf/`、`.acl-recovery/`、`.tmp/`、`prototype/` |

未改动：`02-explore-archive.md`、`04-auth-profile-user.md`（内容本就正确），`project.config.json`、`project.private.config.json`、`cloudfunctions/` 的删除状态。

---

## 2. 环境与副产物

| 事项 | 说明 |
| --- | --- |
| 沙箱权限 | 会话开始时所有终端命令都失败（无法给 `D:\WaimaRoad` 授予写权限）。经一次授权修复（只改该目录权限，不动文件内容与所有者），记录在 `.acl-recovery/`；可用其中的 `acl-backup-*.ps1` 撤销 |
| 设计稿 PDF | 已从 `埠影寻踪.zip` 解出 14 个矢量 PDF 到 `.design-pdf/`（98MB，已 gitignore） |
| `.tmp/` | 一个创建时权限异常的空目录，删不掉（沙箱的删除保护），已忽略，无影响 |
| Python 库 | 尝试装 PyMuPDF 用于渲染 PDF 失败（沙箱阻止临时目录写入），故未做 PDF 渲染；`System.Drawing` 可用，能改名/缩放/压缩图片 |

---

## 3. 四个结论（按重要程度）

### 3.1 `build-web-apps` 插件：只做原型，不做交付物

- 官方 `openai/plugins` 的 `build-web-apps` 打包 `frontend-app-builder`、`frontend-testing-debugging`、`react-best-practices`、`shadcn-best-practices`、`stripe-best-practices`、`supabase-best-practices`，目标产物是**浏览器里的 React/Next 应用**。
- 本项目是**微信原生小程序 + 零 npm + 禁 Skyline**：插件生成不了 WXML/WXSS，也替代不了微信开发者工具的真机验收（`map` / `swiper` / `movable-area` 行为在浏览器不成立）。
- 正确用法：作为**可选阶段 06**——先在浏览器把 6 屏跑通、把 `--fs` 0.9/1.0/1.15/1.3 试一遍、把拼贴头部与对比滑块的数值调到手上，回写 `docs/ui_design.html`，冻结后再进 01。

### 3.2 `.trae/` 的 skill：现在一个都不用装

| 资产 | 结论 | 理由 |
| --- | --- | --- |
| `wechat-subscription-guide` | **暂不用，留作备用** | 只在真接订阅消息（模板 ID、`requestSubscribeMessage`、一次性授权）时才需要；当前 05 的口径是「模板未配置只写本地状态」，提前加载会诱导 Codex 写调用 |
| `frontend-design` | 不用 | 「大胆选风格、避免通用 AI 审美」与「按设计稿 1:1 还原、色值不得新增」冲突；且与插件的 `frontend-app-builder` 重叠 |
| `prd-writer` | 不用 | 用于从零写 PRD；本仓库 PRD 已定稿，重写只会产生第二套事实 |
| `.trae/specs/reset-for-codex-rebuild/` | **建议删除** | 指向已不存在的 `02-explore-heritage.md`/`05-cloud-data-integration.md`，Token 是旧版 `--primary-brown #CC795B`，与基线冲突 |
| `.trae/specs/city-heritage-miniprogram/` | 建议删除或归档 | 旧「埠藏史库」规格，同样冲突 |

### 3.3 设计稿：PDF 是矢量，图在即时设计里

实测 PDF 内部几乎不含位图：

| 画板 | 体积 | 图像对象 | 内嵌 JPEG |
| --- | --- | --- | --- |
| `探索 .vector.pdf` | 27MB | 16 | 0 |
| `史料 (1).vector.pdf` | 13MB | 6 | 0 |
| `5.个人中心*.vector.pdf` | 4—5MB | 4 | 0 |
| `走街` / `6.登录注册` | 0.4—2MB | 2 | 0 |

- 截图抠图不可行（带文字、发虚）。真正的图片资源在 `https://js.design/f/6EFmjK?p=xwVagmukjl&mode=design`。
- 该链接是需登录的前端应用，抓取只返回空壳 HTML：**Codex 与助手都打不开**，必须由你在浏览器里导出成文件。

### 3.4 素材接入流程（阶段 07）

```
① 按清单定文件名与尺寸 → ② 即时设计按图层导出 @2x → ③ 覆盖同名占位，只改图片路径
```

- **名字即契约**：`explore.png`（104×104）、`kaibu.png`（112×144）、`header-map.png`（1240×760）、`profile-cover.png`（1500×1120）、`book/signpost/pin-map`（400×360 / 400×320 / 360×320）、`empty-*.png`（480×360）、`login-bg.jpg`（1125×2436）、`sites/site_001..012.jpg`（750×450）、`compare/site_XXX-old-1|old-2|now.jpg`（750×500）。
- **导出即命名**：在即时设计里先把图层改名为目标文件名，批量导 `PNG 2x`（照片用 `JPG q80`），导出文件名就对了。
- **5 个坑**：编组背景填充会带出方底；图层阴影会双份；旁边文字会被烙进切图；蒙版未应用导出的是原图；SVG 不能进小程序（tabBar 只认 PNG）。
- **接线三处**：`mock/sites.js` 的 `cover/images/oldPhotos/aiRestored`、WXML 的 `<image src>` 与 `<empty-state image=>`、`app.json` 的 tabBar 图标。
- **体积**：主包 ≤2MB；12 封面 + 36 对比图 ≈3.8MB → 对比图跟 `subpackages/detail` 走；照片优先 WebP。
- **6 批**：Tab 图标+marker → 12 封面 → 5 插画 → 登录背景+头像 → 对比图/AI（进分包）→ 空状态。每批跑真机。

---

## 4. 修掉的 5 处文档冲突（不修 Codex 一定写歪）

| # | 冲突 | 处理 |
| --- | --- | --- |
| 1 | `01` 用 `byxz_userInfo`/`byxz_fontScale`，`03/04/05` 用 `byxz_user`/`byxz_font_scale` | 统一为基线 §7.5 的 14 个 snake_case key，并补上基线漏掉的 `byxz_locationTip` |
| 2 | 字号步进：`01` 写 0.1/1 位小数，`04` 写 0.05/两位小数 | 全库统一 0.05、两位小数、三档 1.00/1.15/1.30 |
| 3 | `03` 说 `byxz_view_log` 是数组，基线/05 说是映射 | 统一为 `{ [siteId]: 'YYYY-MM-DD' }` |
| 4 | `03` 说对比图「9.3 字段」，实际字段在 `05` §4.4；数量 24 vs 目录结构 | 数量统一 36（12×3），并指明第 7 节 |
| 5 | `01` 写「prd/ui_design/cloud-database 仅作背景」 | 三份已与基线对齐，改为「可互为校验，冲突以基线为准」 |

---

## 5. 文档地图与优先级

| 优先级 | 文档 | 作用 |
| --- | --- | --- |
| 1 | `codex-prompts/00-baseline.md` | 路径、Token、字段、规则的唯一准绳 |
| 2 | `codex-prompts/01`–`05` | 各阶段实现细则 |
| 3 | `prd.md` | 业务口径与验收 |
| 4 | `ui_design.html` | 视觉细节与版式 |
| 5 | `cloud-database.md` | 数据层与迁移（实现以 05 为准） |
| — | `codex-prompts/06`（可选前置）、`07`（收尾） | 原型、素材接入 |
| — | `codex-prompts/AGENTS.md` | 复制到根目录后生效的行为约定 |

**已作废，不要读**：`.trae/specs/*`、旧「埠藏史库·街绘行图」命名、旧「城市历史文化探索」PRD。

---

## 6. 从零到提审的执行顺序

1. 把 `docs/codex-prompts/AGENTS.md` 复制到仓库根目录。
2. （可选）阶段 06：用 `build-web-apps` 出浏览器原型 → 冻结视觉。
3. 阶段 01 → 02 → 03 → 04 → 05，每阶段先复述再写代码，逐条勾验收。
4. 素材到位后阶段 07：按清单导出 → 覆盖占位 → 只改图片路径。
5. 全链路走查（模拟器 + 真机）→ 主包 ≤2MB → 提审。

---

## 7. 未完成 / 待决定

- [x] ~~删除 `.trae/specs/`~~ 已于 2026-11-01 删除（两份规格先归档到 `.design-pdf/_archive/trae-specs-2026-11-01.zip`）。
- [x] ~~Codex 操作步骤文档~~ 已新增 `docs/codex-prompts/CODEX-RUNBOOK.md`。
- [ ] 是否写 `tools/prepare-assets.ps1`：把即时设计导出的 zip 自动改名、缩放到目标像素、压缩、生成 assets 树与台账。
- [ ] 本轮所有改动尚未提交（`docs/codex-prompts/` 仍是未跟踪目录）；需要时可以按阶段拆 commit。
- [ ] 真实照片（史料、老照片、登录背景）的来源与授权，需要你确认后再上线。

---

## 8. 速查

| 项 | 值 |
| --- | --- |
| 设计源文件 | `https://js.design/f/6EFmjK?p=xwVagmukjl&mode=design` |
| 设计稿 PDF | `.design-pdf/`（14 个，gitignore） |
| 过期规格归档 | `.design-pdf/_archive/trae-specs-2026-11-01.zip`（`.trae/specs/` 已于 2026-11-01 删除） |
| 权限修复记录 | `.acl-recovery/acl-report-*.jsonl` |
| 旧实现快照 | commit `cf621a5`，分支 `codex/ui` |
| appid / 基础库 | `wx14264fd3b18c547f` / `3.17.0` |
| Mock 登录 | `baibianwaimatu` / `123456`；验证码 `123456` |
