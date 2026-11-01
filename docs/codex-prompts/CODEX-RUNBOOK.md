# Codex 操作手册（一步步）

> 面向本项目：`D:\WaimaRoad`，微信原生小程序，`miniprogram/` 需从零重建。
> 命令以 Codex CLI 为准（IDE 扩展的按钮叫法略有差异，本质相同）。命令有变动时以 [官方命令表](https://learn.chatgpt.com/docs/developer-commands?surface=cli) 为准。

---

## 0. 开始前准备（约 10 分钟）

| 项 | 要求 |
| --- | --- |
| Codex | 本机已登录（CLI 或 IDE 扩展任一）。**用本地会话**，不要用云端任务——本项目要靠微信开发者工具在本机编译 |
| 微信开发者工具 | 已装，能打开 `D:\WaimaRoad`（appid `wx14264fd3b18c547f`） |
| 仓库状态 | `miniprogram/` 不存在（正常，等你重建）；`docs/` 齐全 |
| 备份 | 动手前 `git status` 看一眼，必要时先 commit 一次，方便回滚 |

**这一步只做一件事：把 AGENTS.md 放到仓库根目录。**

```powershell
Copy-Item 'D:\WaimaRoad\docs\codex-prompts\AGENTS.md' 'D:\WaimaRoad\AGENTS.md'
```

Codex 每个会话开始都会自动读根目录的 `AGENTS.md`（也可以手工 `/init` 生成，但用我们已经写好的这份，别让它自己写）。

---

## 1. 每个阶段的固定循环（01 → 05 都一样）

```
① 新开会话  → ② 发第一条消息 → ③ 让它复述 → ④ 批准计划 → ⑤ 执行 → ⑥ /diff 自检 → ⑦ 编译验收 → ⑧ 提交
```

### ① 新开会话（关键：一阶段一会话）

```
/new stage-01
```

不要在一个会话里连着跑 02、03——`app.json`、`app.wxss`、组件会互相污染，模型会拿上一阶段的实现去"顺手优化"下一阶段。

### ② 发第一条消息（**只贴路径，不贴正文**）

> 不要把 00-baseline 的 27KB 正文粘进聊天框。让 Codex 自己读文件，省 token 又不失真。

```text
本阶段任务：阶段 01（工程骨架与设计系统）。

请按顺序读这三个文件后再动手：
1. docs/codex-prompts/AGENTS.md（工作约定）
2. docs/codex-prompts/00-baseline.md（事实源，冲突时以它为准）
3. docs/codex-prompts/01-scaffold-theme.md（本阶段规格）

要求：
- 先复述本阶段要创建的文件清单与验收口径（不超过 12 行），等我确认后再写代码。
- 只创建/修改 01 文件「需创建的文件清单」里的路径，别的不许动。
- 路径、色值、Token 名、文案逐字照抄，不要"优化"。
```

### ③ 让它复述，你只做一件事：对照 01 的「需创建的文件清单」看有没有多/少

多出来的文件 = 越界，直接回：`清单外的文件不要建，先只做清单里的。`

### ④ 批准计划（可选但推荐）

```
/plan
```

让它先给执行计划；计划看起来对，再让它开工。计划里如果出现"顺手重构"、"补充优化建议"，删掉再放行。

### ⑤ 执行

权限用默认的 **Auto**（自动编辑、限定在工作区）：

```
/permissions
```

它如果反复请求批准、明显卡在只读模式，再切到可写档；反过来如果它开始动 `docs/`、`project.config.json`，立刻降级或停。

### ⑥ 自检

```
/diff
```

看三件事：**只改了清单内文件**、**没有新增依赖/package.json**、**没有旧命名（heritage/street/mine）**。
想让它自己挑毛病：

```
/review
```

### ⑦ 编译验收

1. 微信开发者工具 → 打开 `D:\WaimaRoad` → 编译。
2. 看控制台：不许有红色报错、不许有「页面不存在」、不许有 Skyline / npm 构建提示。
3. 打开 `01-scaffold-theme.md` 文末的验收清单，逐条勾。
4. 有勾不上的，把**报错原文**贴回给 Codex，不要只说"报错了"。

### ⑧ 提交

```powershell
git add -A; git commit -m "feat(stage-01): 工程骨架与设计系统"
```

一个阶段一个 commit，回滚才有边界。

---

## 2. 五个阶段各自的「第一条消息」

只改第一行的阶段号与文件名，其余照抄：

| 阶段 | 文件 | 发完这条之后你最该盯的 |
| --- | --- | --- |
| 02 | `02-explore-archive.md` | 探索页地图 + 4 色 marker + POI 卡；史料页 5 个分类胶囊 |
| 03 | `03-detail-walk.md` | 今昔对比滑块能拖动；走街 4 条路线数据与 `stops.length` 一致 |
| 04 | `04-auth-profile-user.md` | 登录 `baibianwaimatu` / `123456`；字体设置全局生效 |
| 05 | `05-data-platform-acceptance.md` | 页面只调 `api.js`；主包 ≤2MB；跑完整走查清单 |

阶段 05 的第一条消息多一句：

```text
本阶段是收口阶段：只补 mock/、utils/、接口与平台能力，并回归阶段 01—04 的验收项；
不允许重写页面结构。完成后输出「验收勾选表 + 未通过项 + 建议回滚范围」。
```

---

## 3. 可选：阶段 06（浏览器原型）

只在你想"先看清楚再写"时做。

1. 装插件（以你的 Codex 版本为准，插件市场里搜 `build-web-apps` / `openai-curated`）。
2. 新会话 `/new proto`，发：

```text
读 docs/codex-prompts/06-web-prototype-buildwebapps.md，按其中第 4 节的提示词执行。
只产出 prototype/index.html（浏览器可开、零依赖），不写小程序代码，不动 docs/ 与 Token。
```

3. 浏览器打开 `prototype/index.html`，把 `--fs` 调到 0.9 / 1.0 / 1.15 / 1.3 各看一遍，版式不破才算过。
4. 把确认过的数值回写 `docs/ui_design.html`，然后 `/new stage-01` 进入正式实现。

> 提醒：插件产出的是 Web 原型，**不是交付物**；`prototype/` 已在 `.gitignore`。

---

## 4. 阶段 07（素材接入，任何时候素材到齐都能做）

1. 在即时设计里按 `07-assets-swap.md` 第 2 节把图层改名 → 批量导 `PNG 2x` / 照片 `JPG q80`。
2. 解压到 `miniprogram/assets/` 对应目录。
3. 新会话发：

```text
读 docs/codex-prompts/07-assets-swap.md，进入阶段 07。
先扫 miniprogram/assets/ 输出「文件 → 引用位置」对照表，列清缺图/多图/命名不符，等我确认后再改。
只允许改：mock/sites.js 的图片字段、WXML 里的 <image src> 与 empty-state 的 image、app.json 的 tabBar 图标路径。
不得改 Token、字号、间距、业务逻辑。
完成后报告：用了哪些图、哪些仍是占位、主包体积估算。
```

---

## 5. 出问题怎么办

| 情况 | 处理 |
| --- | --- |
| 改坏了、还没提交 | `git diff` 看范围 → `git checkout -- <文件>` 只回滚被改的文件；别 `git reset --hard` |
| 改坏了、已提交 | `git revert` 该 commit，不要改写历史 |
| 越界改了 `docs/`、`project.config.json` | 立刻 `git checkout -- docs project.config.json`，并把 AGENTS.md 的硬约束再贴一次 |
| 某个阶段反复失败 | 缩小任务：先"只建页面与样式"，通过后再"只接 api.js 数据" |
| 上下文太长、回答开始变差 | `/compact` 压缩，或直接 `/new` 开新会话（阶段产物在文件里，不在对话里） |
| 它坚称"设计稿没有这个规格" | 让它读 `00-baseline.md` 对应小节，而不是争论 |
| 想看它到底改了哪些没跟踪的文件 | `/diff` 会包含 untracked 文件 |

---

## 6. 命令速查（都用得上）

| 命令 | 用途 |
| --- | --- |
| `/new <名字>` | 开新会话（阶段之间必用） |
| `/plan` | 让它先出计划再动手 |
| `/diff` | 看工作区全部改动（含未跟踪文件） |
| `/review` | 让它自审一遍 |
| `/permissions` | 调权限档位（Auto / 只读） |
| `/approve` | 对被自动拒绝的动作重试一次 |
| `/mention <路径>` | 把某个文件显式挂进上下文（也可以直接 `@` 文件名） |
| `/model`、`/status` | 换模型 / 看当前会话状态与用量 |
| `/compact` | 压缩上下文 |
| `/skills` | 列出本地 skills 并插入（本项目暂时不需要） |
| `/quit` | 退出 |

---

## 7. 十条别做的事

1. 别在一个会话里连跑 5 个阶段。
2. 别把 `00-baseline.md` 全文粘进聊天框——让它读文件。
3. 别让 Codex 自己写 `AGENTS.md`（`/init` 会覆盖我们这份）。
4. 别说"优化一下""看着改改"——它一定会改色值和间距。
5. 别让它碰 `project.config.json` 的 appid / libVersion。
6. 别在阶段 01 就要求实现 20 个页面（只建空壳）。
7. 别用浏览器原型替代微信开发者工具验收。
8. 别在失败的会话里反复重试同一个提示词——先回滚到干净状态再重发。
9. 别跳过「先复述再写代码」，这是防跑偏成本最低的一步。
10. 别把 `.design-pdf/`、`prototype/`、`node_modules` 提交进仓库（`.gitignore` 已处理，提交前还是扫一眼 `git status`）。
