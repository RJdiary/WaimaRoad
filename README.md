# 埠影寻踪 — Codex 提示词重建工程

汕头小公园开埠区·外马路历史文化街区的探索类微信小程序（原生小程序，本地 Mock 数据）。本仓库当前**不包含实现代码**，只保留需求文档、视觉依据与分阶段重建提示词，用于在 Codex 等 AI 编程工具上按提示词从零重建。

## 当前状态

| 项 | 状态 |
| --- | --- |
| `miniprogram/` | 已清空（需按提示词重建） |
| `cloudfunctions/` | 已清空（新方案不使用云函数，数据层为本地 Mock + `utils/api.js`） |
| 需求文档 | `docs/prd.md`（V2.0，已按《埠影寻踪》规格重写） |
| 视觉依据 | `docs/ui_design.html`（设计 Token + 6 屏原型，已重写） |
| 数据层 | `docs/cloud-database.md`（Mock / Storage / 云开发迁移，已重写） |
| 重建提示词 | `docs/codex-prompts/`（00 基线 + 01—05 阶段 + 06 可选原型） |
| 原始设计稿 | `.design-pdf/`（14 个矢量 PDF，仅供设计比对，已加入 `.gitignore`） |

## 目录说明

```
docs/
  codex-prompts/
    CODEX-RUNBOOK.md          在 Codex 里一步步怎么操作（先看这个）
    AGENTS.md                 Codex 工作约定（复制到仓库根目录后生效）
    README.md                 提示词包说明与执行路径
    00-baseline.md            共享事实源：产品定义、设计 Token、路由表、组件约定、数据模型、规则、命名禁忌
    01-scaffold-theme.md      阶段 1：工程骨架、设计系统、自定义 TabBar、基础组件
    02-explore-archive.md     阶段 2：探索页 + 史料页
    03-detail-walk.md         阶段 3：史料详情、专题、AI 复原、走街、路线详情、走街进行中
    04-auth-profile-user.md   阶段 4：登录注册、我的页、用户中心二级页
    05-data-platform-acceptance.md 阶段 5：数据层、Mock、API、业务规则、平台能力与验收
    06-web-prototype-buildwebapps.md 可选的浏览器原型阶段（build-web-apps 插件）
    07-assets-swap.md         收尾阶段：素材接入（设计稿细节图 / 实拍照片替换占位）
  prd.md                      产品需求文档 V2.0（做什么、验收口径）
  ui_design.html              视觉规范与 6 屏原型（浏览器直接打开）
  cloud-database.md           数据层、Storage key、云开发迁移
project.config.json           appid 与 miniprogramRoot / cloudfunctionRoot（appid 保留）
project.private.config.json   开发者工具本地配置
```

## 环境要求

- 微信开发者工具，基础库 `3.17.0`（新方案要求 ≥ 3.0.0）
- AppID `wx14264fd3b18c547f`（已在 `project.config.json` 中保留）
- 无 npm 依赖、无构建步骤、不使用云开发

## 重建步骤

1. 把 `docs/codex-prompts/AGENTS.md` 复制到仓库根目录，Codex 会自动读取。
2. 在 Codex 中打开本仓库，先让它读 `docs/codex-prompts/README.md` 与 `docs/codex-prompts/00-baseline.md`。
3. 按顺序逐个提交阶段提示词：`01` → `02` → `03` → `04` → `05`。
   - 需要先看视觉原型时，先执行 `06`（Codex `build-web-apps` 插件），冻结视觉后再进入 `01`。
4. 每个阶段完成后，对照该文件末尾「验收标准」逐条勾选，并在微信开发者工具中确认编译通过、页面可访问。
5. 阶段 `05` 完成后，按其中「整体联调走查清单」跑通主链路：探索→史料→详情→收藏；走街→路线详情→开始走街→打卡；登录/注册→我的→我的打卡点/收藏/设置；搜索→详情。
6. 素材到齐后执行 `07`（素材接入）：按 `docs/codex-prompts/07-assets-swap.md` 的命名与尺寸把图放进 `miniprogram/assets/`，再让 Codex 只改图片路径，不碰版式。

## 重建验收要点

- 4 个 Tab（探索 / 史料 / 走街 / 我的，自定义 TabBar）+ 登录、注册，以及 `subpackages/` 下的详情、路线、我的二级页共 20 个页面全部可用
- 视觉与《埠影寻踪》设计稿一致（米纸白 `#FCF7EE`、浅杏 `#FFE8C7`、陶土 `#D98C75`、琥珀 `#F0AD45`、登录主蓝 `#1A91FA`），色值取自 `00-baseline.md` 的设计 Token
- 页面数据统一走 `utils/api.js`（`USE_MOCK` 模式），不直连后端、不残留旧版命名
- 未登录拦截与 `redirect` 回跳、字体缩放全局生效、空/骨架/失败状态齐备
- 主包体积控制在 2MB 以内（详情与二级页已分包）

## 关于 Codex 插件与 `.trae` 资产

- `build-web-apps` 插件面向浏览器 React/Next 应用，**不能**直接生成本项目的小程序代码；只用于 `06` 阶段的视觉原型，结论与依据见 `docs/codex-prompts/README.md` §7.1。
- `.trae/skills/` 三个 skill 当前**都不需要启用**；其中 `wechat-subscription-guide` 等真正接入订阅消息时再上。`.trae/specs/` 是上一轮 Trae 的旧规格，与现行基线冲突，建议删除。详见 `docs/codex-prompts/README.md` §7.2。

## 旧实现恢复方式

删除前的旧版实现（产品名“埠藏史库·街绘行图”，含云开发数据层，与当前新规格不同）已提交为快照：

- 分支：`codex/ui`
- 快照提交：`cf621a5`（`chore: snapshot miniprogram before codex rebuild reset`）

常用命令：

```bash
git show cf621a5:miniprogram/pages/explore/index.js   # 查看单个文件
git ls-tree -r --name-only cf621a5 -- miniprogram       # 列出旧实现全部文件
git checkout cf621a5 -- miniprogram                    # 恢复到工作区（仅查证用）
```

快照仅供查证，不是新产品的重建产物，不要直接把旧代码当作实现基础。
