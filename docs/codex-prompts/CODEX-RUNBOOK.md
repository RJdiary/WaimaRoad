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

## 1. 每个阶段的固定循环（01 → 09 都一样）

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
- 先复述实现方案（≤15 行）：① 要建/改哪些文件 ② 每个文件怎么实现（数据从哪来、组件怎么拆、关键 API/事件/存储 key）③ 最容易做错的 2 个点与你的规避办法 ④ 验收怎么逐条判。等我确认后再写代码。
- 只创建/修改 01 文件「需创建的文件清单」里的路径，别的不许动。
- 路径、色值、Token 名、文案逐字照抄，不要"优化"。
```

> 01—08 每个阶段的完整「第一条消息」都在 `FIRST-MESSAGES.md`，直接复制，不用每次现写。

### ③ 看复述：重点不是「知道要做什么」，而是「说清楚怎么做」

合格的复述必须回答四问，缺一条就打回：

| 问 | 合格的样子 | 不合格的样子 |
| --- | --- | --- |
| ① 做哪些文件 | 逐个列出，且都能对上阶段文件的清单 | 「我会创建相关页面和组件」 |
| ② **怎么实现** | 说数据从哪来（`api.xxx` / Storage key）、组件怎么拆、关键交互用什么 API（如 `movable-area`、`wx.startLocationUpdate`、`touchmove` 算百分比）、状态放哪（`data` 还是 `globalData`） | 只报文件名，一个 API 名都不提 |
| ③ 最易做错的 2 点 | 自己点出坑（如「地图上普通 view 会被盖住，用 cover-view」）并给规避办法 | 「应该没什么难点」 |
| ④ 验收怎么判 | 对应到验收清单的具体条目，说明怎么自测 | 「我会保证质量」 |

**只列文件名的复述，一律打回**，回这句：

```text
你只给了清单。请补三点再说：
1) 每个文件的数据从哪来（调哪个 api 方法、读哪个 byxz_ key）；
2) 关键交互怎么实现（用哪个小程序 API、核心算法/公式、状态存哪）；
3) 这两处最容易出错的地方，以及你的规避办法。
不要写代码，只补这三段。
```

复述通过后，再对照阶段文件的「需创建的文件清单」看有没有多/少——多了就是越界，回：`清单外的文件不要建，先只做清单里的。`

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

看三件事：**只改了清单内文件**、**没有新增依赖/package.json**、**没有旧命名**。

旧命名只用这条命令查，别扫全仓库：

```powershell
Get-ChildItem miniprogram -Recurse -File -Include *.js,*.json,*.wxml,*.wxss |
  Select-String -Pattern 'pages/heritage|pages/street|pages/mine|heritageDetail|streetMap|aiCompare|quickstart|databaseGuide|cloudTipModal|install_tip|usercenter|goods|examples|business'
```

结果为空即通过。`docs/`、`AGENTS.md`、`.trae/skills/` 里出现这些词是**正常的**——那是在写「禁止这些词」的规定，不算违规，更不要为了"grep 干净"去改文档。
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

验收全绿之后，三行命令，别多想：

```powershell
git add -A
git commit -m "feat(stage-01): 工程骨架与设计系统"
git log --oneline -1
```

`git add -A` 在这里是安全的：`.design-pdf/`、`.acl-recovery/`、`prototype/` 都已在 `.gitignore` 里。具体每个阶段抄哪一行，见下面第 2 节。

---

## 2. 每个阶段提交什么（照着抄就行）

### 2.1 一句话原理

commit = **给当前这一步拍个存档**。一个阶段拍一次，写坏了回到上一个存档就行，不用从头来。

所以规则只有一条：**一个阶段做完、验收勾完了，才拍照**。中途别拍。

### 2.2 固定套路（三行，每阶段都一样）

```powershell
git add -A
git commit -m "<下面表格里那一行>"
git log --oneline -1
```

第三行是用来确认"真的提交了"，会回显一条 `feat(stage-02): ...`。

### 2.3 九个阶段，各抄哪一行

| 阶段 | 直接复制这一行 |
|---|---|
| 01 | `feat(stage-01): 工程骨架与设计系统` |
| 02 | `feat(stage-02): 探索页与史料页` |
| 03 | `feat(stage-03): 史料详情、AI 复原与走街` |
| 04 | `feat(stage-04): 登录注册与用户中心` |
| 05 | `chore(stage-05): 数据层收口与整体验收` |
| 06 | `chore(stage-06): 补充浏览器视觉原型`（一般不用提交） |
| 07 | `feat(stage-07): 接入真实素材` |
| 08 | `feat(stage-08): AI 知识库问答悬浮球` |
| 09 | `feat(stage-09): 适老化模式` |

`feat` = 加了功能，`chore` = 收尾/杂务，`docs` = 只改文档。不用记，表格里已经写好了。

### 2.4 完整命令（连起来复制，一次一个阶段）

**阶段 02**
```powershell
git add -A
git commit -m "feat(stage-02): 探索页与史料页"
git log --oneline -1
```

**阶段 03**
```powershell
git add -A
git commit -m "feat(stage-03): 史料详情、AI 复原与走街"
git log --oneline -1
```

**阶段 04**
```powershell
git add -A
git commit -m "feat(stage-04): 登录注册与用户中心"
git log --oneline -1
```

**阶段 05**
```powershell
git add -A
git commit -m "chore(stage-05): 数据层收口与整体验收"
git log --oneline -1
```

**阶段 07（素材）**
```powershell
git add -A
git commit -m "feat(stage-07): 接入真实素材"
git log --oneline -1
```

**阶段 08（AI 悬浮球）**
```powershell
git add -A
git commit -m "feat(stage-08): AI 知识库问答悬浮球"
git log --oneline -1
```

**阶段 09（适老化）**
```powershell
git add -A
git commit -m "feat(stage-09): 适老化模式"
git log --oneline -1
```

**文档改动（比如现在待提交的那 13 项）**
```powershell
git add -A
git commit -m "docs: 补充 AI 问答与适老化阶段、合并提交清单"
git log --oneline -1
```

> 01 已经提交过了（`feat(stage-01): 工程骨架与设计系统`），不用再跑。

### 2.5 提交后怎么确认没混入别的东西

```powershell
git show --stat HEAD
```

看输出的文件列表：**只要都属于本阶段**就对了。比如刚提交 02，列表里出现 `pages/explore/...`、`pages/archive/...` 没问题；出现 `mock/user.js` 或 `pages/login/...`，说明 Codex 越界了，用第 6 节的办法回滚那部分。

### 2.6 提交错了怎么办（三种，都简单）

| 情况 | 命令 |
|---|---|
| 刚 `git add` 完，还没 commit，想反悔 | `git reset` （只取消暂存，文件不动） |
| 刚 commit，发现漏了文件 | `git add -A ; git commit --amend --no-edit` （把漏的并进上一次提交） |
| 已提交好几步，想退回上一个存档 | `git revert HEAD`（生成一个反向提交，历史不动） |

**永远不要用** `git reset --hard`——它会连你没提交的代码一起删掉。

### 2.7 想拆得更细（可选，不做也不影响）

一个阶段太大可以拆，比如 03：

```powershell
git commit -m "feat(stage-03): 史料详情与今昔对比滑块"
git commit -m "feat(stage-03): 专题聚合与 AI 复原影像"
git commit -m "feat(stage-03): 走街三页与路线时间轴"
```

拆法是**按页面拆**，不要按"样式 / 逻辑"拆。

---

## 3. 五个阶段各自的「第一条消息」

只改第一行的阶段号与文件名，其余照抄：

| 阶段 | 文件 | 发完这条之后你最该盯的 |
| --- | --- | --- |
| 02 | `02-explore-archive.md` | 探索页地图 + 4 色 marker + POI 卡；史料页 5 个分类胶囊 |
| 03 | `03-detail-walk.md` | 今昔对比滑块能拖动；走街 4 条路线数据与 `stops.length` 一致 |
| 04 | `04-auth-profile-user.md` | 登录 `baibianwaimatu` / `123456`；字体设置全局生效 |
| 05 | `05-data-platform-acceptance.md` | 页面只调 `api.js`；主包 ≤2MB；跑完整走查清单 |
| 08 | `08-ai-chat.md` | 球在除登录/注册外的 18 页都在；**拖动时页面不滚动**；地图页球不被盖住 |
| 09 | `09-elder-mode.md` | 开关后当前页立即变大；`byxz_font_scale` 前后不变；关掉后回到用户原字号 |

> 08（AI 悬浮球）不依赖 02—05，阶段 01 完成后随时可做；但要等页面都有了再一次性补 18 处挂载，否则每做一个页面都要回头改。
> 09（适老化）依赖 04 的字体设置与 03 的路线详情，建议排最后。

阶段 05 的第一条消息多一句：

```text
本阶段是收口阶段：只补 mock/、utils/、接口与平台能力，并回归阶段 01—04 的验收项；
不允许重写页面结构。完成后输出「验收勾选表 + 未通过项 + 建议回滚范围」。
```

---

## 4. 可选：阶段 06（浏览器原型）

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

## 5. 阶段 07（素材接入，任何时候素材到齐都能做）

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

## 6. 出问题怎么办

| 情况 | 处理 |
| --- | --- |
| 改坏了 / 提交错了 | 见上面 2.6，那里三条命令够用；**别用 `git reset --hard`** |
| 越界改了 `docs/`、`project.config.json` | `git checkout -- docs project.config.json` 还原，再把 AGENTS.md 的硬约束贴一次 |
| 某个阶段反复失败 | 缩小任务：先"只建页面与样式"，通过后再"只接 api.js 数据" |
| 上下文太长、回答开始变差 | `/compact` 压缩，或直接 `/new` 开新会话（阶段产物在文件里，不在对话里） |
| 它坚称"设计稿没有这个规格" | 让它读 `00-baseline.md` 对应小节，而不是争论 |
| 想看它到底改了哪些没跟踪的文件 | `/diff` 会包含 untracked 文件 |

---

## 7. 命令速查（都用得上）

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

## 8. 十条别做的事

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
