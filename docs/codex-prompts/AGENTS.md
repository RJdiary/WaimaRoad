# AGENTS.md · 埠影寻踪（Codex 工作约定）

> 把这个文件**复制到仓库根目录**（`D:\WaimaRoad\AGENTS.md`），Codex 会在每次会话自动读取。
> 本文件是「行为约定」；具体事实在 `docs/codex-prompts/`，两者不重复。

---

## 1. 这个仓库是什么

`埠影寻踪` —— 汕头小公园开埠区·外马路历史文化街区的微信原生小程序。

**当前状态：仓库里没有实现代码。** `miniprogram/` 需要由你按 `docs/codex-prompts/` 的 5 个阶段提示词从零写出来。
`cloudfunctions/` 不用（数据层是本地 Mock + `utils/api.js`）。

---

## 2. 每次会话的读取顺序

1. `docs/codex-prompts/00-baseline.md`（必读，共享事实源）
2. 本次要执行的阶段文件：`01` → `02` → `03` → `04` → `05`（**一次只做一个阶段**）
3. 需要视觉细节时看 `docs/ui_design.html`；需要业务口径时看 `docs/prd.md`

**不要读**：其他阶段的文件（会互相污染）、`.design-pdf/`（98MB 设计稿 PDF，二进制）、`.trae/specs/`（上一轮 Trae 的旧规格，已作废）。
**冲突时优先级**：`00-baseline.md` > 阶段文件 > `docs/prd.md` > `docs/ui_design.html`。

---

## 3. 硬约束（违反即返工）

1. 微信原生：`WXML + WXSS + JavaScript ES6`。禁止 Taro / uni-app / React / Vue / TypeScript / 构建工具。
2. **零 npm**：不建 `package.json`、`node_modules/`、`miniprogram_npm/`；不 require 第三方包。
3. 只走 WebView 渲染，**禁止 Skyline**（不加 `renderer` 字段，`style` 保持 `"v2"`）。
4. 设计基准 750rpx：左右 48rpx、卡间距 24rpx、区块 40rpx、最小 8rpx；字号/间距体系不得新增。
5. 色值只有两个来源：`app.wxss` 的 18 个 Token、`app.json` 的 TabBar/window 配置。禁止写死主题色。
6. 页面只能通过 `utils/api.js` 取数，禁止 `require('mock/*')`、禁止 `wx.getStorageSync('byxz_*')` 直接读写业务数据。
7. 不改 `project.config.json` 的 `appid`（`wx14264fd3b18c547f`）、`libVersion`、`projectname`、`miniprogramRoot`。
8. 命名：产品名只用「埠影寻踪」；禁止 `heritage*` / `street*` / `mine*`；禁止 `quickstart` / `goods` / `examples` / `usercenter`；禁止济南地名。

---

## 4. 每个阶段的工作协议

1. **先复述**：用 5—8 行说明本阶段要建哪些文件、验收怎么判。等我确认（或与阶段文件一致）后再动手。
2. **只改清单内文件**：阶段文件「需创建的文件清单」之外的东西一律不动；需要跨阶段改动时先停下来说明。
3. **一次一批**：按「全局样式 → 公共组件 → 页面」顺序，一批完成后先自查再继续。
4. **不要留 TODO**：核心逻辑、Mock 数据、空态/骨架/失败态都要真写，不能占位。
5. **自检后报告**：对照该阶段文末「验收标准」逐条给出「是/否 + 证据（文件路径:行号）」，再列「未做/偏离」两项。
6. **提交粒度**：一个阶段一个 commit，格式 `feat(stage-01): 工程骨架与设计系统`。

---

## 5. 交付完成定义（DoD）

- 微信开发者工具编译：无红色报错、无「页面不存在」、无 npm 构建提示、无 Skyline 提示。
- 20 条路由都能打开；4 个 Tab 可切换且自定义 TabBar 高亮正确。
- 该阶段验收清单全绿；主链路（探索→史料→详情→收藏；走街→路线详情→打卡）可走通。
- 无未定义变量、无重复 `setData`、无外链图片、无网络字体。
- 交付附带 `README.md`（运行方式、Mock 账号）与 `assets/README.md`（素材尺寸与替换清单）。

---

## 6. 失败与回退

- 单阶段失败：**只重跑该阶段**，附上控制台日志/报错原文，不要只说「报错了」。
- 实现与基线冲突（改名、改色、改字段、加依赖、加页面）：按基线重写，不接受「看起来更好」。
- 回滚只针对该阶段涉及的文件；禁止 `git reset --hard`。

---

## 7. 可选：视觉原型

需要先生成浏览器原型时，读 `docs/codex-prompts/06-web-prototype-buildwebapps.md`。
注意：该插件产出的是 Web 原型，**不是**小程序交付物；原型冻结后仍按 01—05 实现。
