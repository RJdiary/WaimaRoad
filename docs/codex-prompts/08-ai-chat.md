# 阶段 08 · AI 知识库问答（全局悬浮球 + 问答面板）

> 前置：阶段 01 完成即可开工（组件与 `utils` 不依赖页面）。全量挂载建议在 02—04 页面都存在后一次性补，或每做一个页面顺手加一行。
> 依据：《大创申报书 10.3》——“引入腾讯 ima 知识库实现 AI 智能问答”“生成问答二维码嵌入”“用户可通过小程序扫码进行智能问答与自定义路线咨询”，即“**可看、可听、可逛、可问**”里的“可问”。
> 本阶段把申报书里的「扫码去 ima」升级为**小程序内悬浮球 + 面板**：能内答的就内答，答不了的给「去 ima 继续问」。不改任何已有页面版式。

---

## 1. 目标

1. 在**全部 20 个页面**右下角出现一个可拖动的 AI 悬浮球（默认位置记忆、松手吸附左右边缘）。
2. **拖动只动球，不动页面**：拖动过程中页面不滚动、不误触、不选中文字。
3. 点击球 → 从底部弹出问答面板（85% 高），支持快捷问题、输入提问、对话气泡、加载/错误/空三态、历史 50 条、清空、复制、反馈。
4. 回答来源可切换，默认 `mock`（本地知识条目命中），预留 `ima`（扫码/复制去 ima）与 `api`（云函数/HTTP）两种 provider，切后端不改页面。
5. 合规：每条 AI 回答带「AI 生成，请以史料原文为准」标识；不暗示史实权威性。

---

## 2. 前置状态

- `miniprogram/` 已由阶段 01 建好：`app.js` / `app.json` / `app.wxss` / 20 条路由空壳 / `components/` 下 5 个基础组件 / `utils/` 4 个工具 / `assets/`。
- `app.wxss` 已有 18 个 Token、`--fs`、`--shadow-card/--shadow-float`、`.page` / `.tap` / `.media-placeholder`。
- 页面可能仍是空壳——本阶段**不要求**页面有内容，只要求每页能挂住球。
- 阶段 05（数据层）可能还没跑：本阶段自带 `utils/ai.js` 与 `mock/ai.js`，**不依赖** `utils/api.js` 是否已实现 `askAI`；若 05 已跑，则把 `askAI` 并入 `api.js` 并保持签名一致。

---

## 3. 需创建 / 修改的文件清单

| # | 路径 | 职责 | 完成度 |
| --- | --- | --- | --- |
| 1 | `components/ai-ball/index.{js,json,wxml,wxss}` | 悬浮球：拖动、吸附、位置记忆、点击开面板、`cover` 模式 | 完整实现 |
| 2 | `components/ai-panel/index.{js,json,wxml,wxss}` | 问答面板：消息列表、输入、快捷问题、三态、历史 | 完整实现 |
| 3 | `utils/ai.js` | provider 抽象：`ask({q, history})`、`getQuickQuestions(page)`、`getHistory/saveHistory/clearHistory`、`AI_PROVIDER` 开关 | 完整实现 |
| 4 | `mock/ai.js` | 知识条目（≥20 条，覆盖 4 个主题 + 走街/打卡规则）、兜底话术、快捷问题表 | 完整实现 |
| 5 | `utils/storage.js` | **修改**：`KEYS` 增加 `byxz_ai_ball_pos`、`byxz_ai_history` | 修改 |
| 6 | `app.json` | **修改**：`usingComponents` 全局注册 `ai-ball`（路径 `/components/ai-ball/index`） | 修改 |
| 7 | 20 个页面 `index.wxml` | **修改**：根节点末尾各加一行 `<ai-ball bounds="{{...}}" />` | 修改（20 处） |
| 8 | 4 个 Tab 页 + `walking` | **修改**：把球的可拖动区域与 TabBar / 底部操作栏 / 地图卡错开（见 §4.6） | 修改 |
| 9 | `app.wxss` | **可选**：只允许新增 `.ai-*` 的**布局**类；颜色一律 `var(--*)` | 可选 |

- 不改：20 条路由、`project.config.json`、任何页面的既有排版与业务逻辑。
- 不新增页面。面板是组件，不是页面。

---

## 4. 详细要求

### 4.1 悬浮球外观（`ai-ball`）

- 尺寸 **96rpx 圆形**；`background: var(--white)`；`border: 1rpx solid var(--amber)`；`box-shadow: var(--shadow-float)`。
- 图标：优先用文字「问」或「AI」+ 陶土渐变（`linear-gradient(180deg,#C9705A,#B65A44)` 裁字），36rpx/600；**不要**外链图片、不要 Lottie。
- 与探索页搜索按钮区分：搜索按钮 72rpx、在地图卡内右上；AI 球 96rpx、默认右下（`right: 32rpx; bottom: calc(152rpx + env(safe-area-inset-bottom))`，即 TabBar 112rpx + 40rpx 间距）。
- 按压态 `scale(0.94)`，松开回弹；拖动中阴影加深（`--shadow-float`）。
- 首次进入 3s 后有一次轻微「呼吸」提示（缩放 1→1.05→1，仅一次，之后不再出现）。

### 4.2 拖动：只动球，不动页面（本阶段的技术核心）

**唯一推荐实现**：`movable-area` + `movable-view` + `catch:touchmove`。

```
<movable-area class="ai-area" scale-area="{{false}}">
  <movable-view class="ai-view"
                direction="all"
                inertia="{{false}}"
                out-of-bounds="{{false}}"
                x="{{x}}" y="{{y}}"
                bindtouchend="onDragEnd"
                catch:touchmove="noop"
                bindtap="openPanel">
    ...球...
  </movable-view>
</movable-area>
```

样式要点（**照抄，否则页面点不动或球被裁**）：

```css
.ai-area {
  position: fixed; left: 0; top: 0; width: 100vw;
  height: calc(100vh - 112rpx - env(safe-area-inset-bottom)); /* 不覆盖 TabBar */
  pointer-events: none;   /* 关键：整层不吃事件，页面照常可点 */
  z-index: 900;
}
.ai-view { pointer-events: auto; width: 96rpx; height: 96rpx; }
```

- `pointer-events: none` + `movable-view` 上 `auto`：**这是「不带动页面」和「不挡页面」的两全写法**。漏掉 `none`，整屏会被一层透明遮罩挡住。
- `catch:touchmove` 阻断事件冒泡到页面滚动；`movable-view` 自身已用 `catch` 处理移动，页面不会跟着滚。
- 拖动结束（`bindtouchend`）：把 `x` 与「球心到左/右边缘距离」比较，**吸附到较近的一侧**；`y` 夹取在 `[safeTop+88, areaHeight-96]`。结果写 `byxz_ai_ball_pos = { side: 'left'|'right', y: Number }`。
- 进入页面 `onShow` 读回位置：`side` 决定 `x`，`y` 直接复用；首次无记录用默认右下。
- **不要**用 `position: fixed` + `bindtouchmove` 手写拖动：iOS 上会与页面滚动打架、跟手性差，且拖动时页面仍会跟随滚动。
- **不要**给 `movable-area` 加 `overflow: hidden`（会裁掉阴影）。

### 4.3 与原生地图的冲突（必读）

`<map>` 是原生组件，WebView 层级高于普通 `view`：

| 页面 | 处理 |
| --- | --- |
| `pages/explore` | 球**不要落在 map 卡（540rpx 高）范围内**：默认右下、拖动 `y` 下限设在 map 卡下沿之下；若必须覆盖地图，该页传 `cover` 走 `cover-view` 渲染（体验降级，仅兜底） |
| `subpackages/route/pages/walking` | 全屏地图 + 无 TabBar：球固定右上（顶部信息条下方 24rpx），`bounds` 限制在右侧 1/4 竖条内 |
| `subpackages/route/pages/route-detail` | 上半屏地图：球默认右下，`y` 下限设在地图下沿之下 |
| 其余 17 页 | 无原生组件冲突，按 §4.2 默认实现 |

- `bounds` 作为 prop 传入：`{ minY, maxY, minX, maxX }`（rpx 数值，组件内换算），不给则用全屏安全区。
- 触发 `cover` 模式时，球用 `cover-view` + `cover-image`（若用文字则 `cover-view` 内文本），**不接受**拖动动画降级以外的问题；`cover` 模式下拖动用 `bindtouchmove` 手动计算（这是唯一例外）。

### 4.4 问答面板（`ai-panel`）

**结构（自上而下）**

1. 顶部把手 40rpx 宽灰条（`var(--line)`）+ 标题「问埠影」+ 右侧「清空」与「关闭」。
2. 免责条：浅杏底 `var(--apricot)`，22rpx：「回答由 AI 生成，仅供参考，请以史料原文为准。」
3. 消息区 `scroll-view`：`scroll-into-view` 到最后一条；用户消息右对齐（`var(--blue)` 白字，圆角 24rpx），AI 消息左对齐（白底 + `var(--shadow-card)`），每条 AI 消息底部一行 22rpx `var(--ink-3)`：「AI 生成 · 可反馈」+ 两个拇指图标。
4. 快捷问题条（仅首屏显示）：横向滚动胶囊，取自 `mock/ai.js` 的 `quickQuestions`，按当前页面给不同组（探索页给「附近有什么」、史料页给「这条史料讲什么」、走街页给「这条路线怎么走」）。
5. 输入区：`textarea`（`auto-height`、`maxlength=200`、`cursor-spacing=24`、`adjust-position`）+ 发送按钮（`var(--blue)` 胶囊，空内容置灰）。
6. 「去 ima 继续问」入口（`AI_PROVIDER === 'ima'` 或本条回答命中兜底时出现）：按钮 → 弹层显示 ima 问答二维码（`assets/images/ai/ima-qr.png`，200×200，缺失时显示文字「在 ima 中搜索：埠影寻踪知识库」）+「复制问题」按钮。

**交互**

- 打开：遮罩淡入 200ms + 面板上滑 240ms（`cubic-bezier(.2,.8,.2,1)`）；关闭反向。
- 键盘：`adjust-position` 打开；面板高度用 `85vh`，输入区 `padding-bottom: env(safe-area-inset-bottom)`；键盘弹起时消息区自动滚到底。
- 提问：立即插入用户气泡 + 一个「思考中」三点动画气泡；`ask()` 返回后替换为回答；失败则显示「回答失败了」+「重试」。
- 空态：无历史时显示欢迎语 + 「试试这样问」示例。
- 历史：`byxz_ai_history` 存 `[{ role: 'user'|'ai', text, ts, refs? }]`，**最多 50 条**，超出丢最早；「清空」二次确认。
- 复制：长按消息 → `wx.setClipboardData`。

### 4.5 `utils/ai.js` 契约（切换后端不改页面）

```js
const AI_PROVIDER = 'mock'; // 'mock' | 'ima' | 'api'

module.exports = {
  AI_PROVIDER,
  ask({ question, history }),        // → Promise<{ answer, refs: [], fallback: Boolean }>
  getQuickQuestions(pageKey),        // → String[]（pageKey: explore|archive|walk|profile|detail|route|other）
  getHistory(), saveHistory(list), clearHistory(),
  copyQuestion(question),            // 复制 + Toast
};
```

- `mock`：`mock/ai.js` 里 `knowledge` 为 `[{ id, keywords: [], q: [], a: '', refs: [] }]`；命中规则＝关键词全覆盖优先、其次任一命中；未命中返回 `fallback: true` + 兜底话术（「这个问题我还没有把握，可以去 ima 知识库继续问」）。
- `ima`：`ask` 直接返回 `{ answer: 引导话术, fallback: true, ima: true }`，面板据此显示二维码区。
- `api`：`wx.request` 到 `AI_ENDPOINT`（云函数或 HTTPS），入参 `{ question, page, sessionId }`，出参 `{ code, data:{ answer, refs } }`；失败按 05 的错误码口径处理。
- 延迟：`mock` 用 600—900ms 模拟（比列表接口长，符合"AI 在思考"的体感），**不要**用 300ms——太快会显得假。

### 4.6 20 页挂载

`app.json` 全局注册后，仍要**每页 WXML 放一行**（小程序没有全局插入节点的机制）：

```html
<ai-ball bounds="{{aiBallBounds}}" />
```

| 页面组 | 传参 |
| --- | --- |
| 4 个 Tab 页 | 默认 bounds（底部留 TabBar 112rpx + 安全区） |
| `explore` / `route-detail` | 传「避开地图卡」的 bounds |
| `walking` | 传右上窄条 bounds，且无 TabBar 留白 |
| `login` / `register` | **不挂**（登录页要干净；已在登录态的用户不会看到球，未登录时也不需要问答入口） |
| 其余 14 页 | 默认 bounds |

> 合计挂载 **18 个页面**（20 减登录、注册）。这是本阶段唯一允许的"每个页面都改一行"的例外。

### 4.7 合规与文案

- 每条 AI 消息必须显示：「AI 生成，请以史料原文为准」。
- 首条进入时显示一次说明：「问答基于外马路史料知识库，回答可能不完整。」
- 不做：医疗/法律/政治类回答（超出范围时统一回「这个超出史库范围，建议查阅官方资料」）。
- 敏感词过滤：问题与回答都过一遍 `utils/format.js` 同目录的 `sensitive.js`（可选，词表内置 50 条）。
- 不采集：不记录用户身份，不把提问上报到第三方；`sessionId` 仅用于单次会话内多轮。

---

## 5. 数据

| 项 | 值 |
| --- | --- |
| Storage | `byxz_ai_ball_pos`（`{side,y}`）、`byxz_ai_history`（≤50 条） |
| Mock 知识条目 | ≥20 条，覆盖 kaibu/qiaoxiang/wenjiao/hongse + 走街规则 + 打卡规则 |
| 快捷问题 | 每组 3—4 条，如「潮海关旧址为什么重要？」「开埠外交线怎么走？」「打卡要多近？」 |
| 兜底话术 | 「这个问题我还没有把握。你可以去 ima 知识库继续问，或先看看【潮海关旧址】的史料。」（带一个可点跳转的推荐点位） |

---

## 6. 验收标准

- [ ] 20 个页面中**除登录、注册外的 18 个**都出现悬浮球，位置一致、样式一致。
- [ ] 拖动跟手（无掉帧感），**拖动时页面不滚动**、不误触下方元素；松手吸附到最近的左右边缘。
- [ ] 位置持久化：切页、返回、杀进程重进后，球仍在原来的边与高度。
- [ ] 探索页 / 路线详情页 / 走街页三处的球**不被原生地图盖住**，也不遮挡地图上的搜索按钮与浮层按钮。
- [ ] 球不遮挡 TabBar、不遮挡详情页底部操作栏；点击区 ≥96rpx。
- [ ] 点击球 → 面板 200/240ms 内完成遮罩淡入与上滑；关闭可点遮罩或下滑。
- [ ] 快捷问题按页面分组，点击即提问；输入框空内容时发送按钮置灰。
- [ ] 提问后 1s 内出现「思考中」，回答渲染后自动滚到底；失败有「重试」。
- [ ] 每条 AI 回答带「AI 生成，请以史料原文为准」；兜底回答带「去 ima 继续问」入口。
- [ ] 历史 ≤50 条、可清空；清空有二次确认。
- [ ] 字体缩放 1.3 时面板不破版，输入框与消息文字同步放大。
- [ ] 键盘弹起时输入框可见、消息区不被遮；iOS 与安卓各验一次。
- [ ] `AI_PROVIDER` 切到 `ima` 或 `api` 时，页面代码零改动。
- [ ] 控制台无报错；无 `setData` 大对象循环（消息列表用增量 `setData(['messages[N]'])`）。
- [ ] 除 `app.json`、18 个页面 WXML 各一行、`utils/storage.js` 的 `KEYS` 外，**没有改动其他已完成的文件**。

---

## 7. 约束与禁止

1. 不新增页面、不改 20 条路由；面板是组件。
2. 不改任何页面的既有排版：挂载只加一行 `<ai-ball />`，不加包裹层。
3. 颜色只用 `app.wxss` 的 18 个 Token；不新增色值、不引入图标库或 Lottie。
4. 拖动实现只允许 `movable-area + movable-view`（`cover` 模式除外），禁止手写 `bindtouchmove` 全屏拖动。
5. 禁止把整个 `movable-area` 做成可点区域（必须 `pointer-events: none`）。
6. 不引入第三方 AI SDK；`api` provider 只用 `wx.request`，域名需在 `request合法域名` 中配置（本阶段不配，默认 `mock`）。
7. 不得把用户提问写进 `byxz_ai_history` 以外的地方；不得上报第三方。
8. 登录、注册页不挂球。

---

## 8. 与申报书口径的对应

| 申报书表述 | 本项目实现 |
| --- | --- |
| 引入腾讯 ima 知识库实现 AI 智能问答 | `AI_PROVIDER = 'ima'` 时，面板提供「去 ima 继续问」+ 二维码；`api` 模式可对接自建知识库 |
| 生成问答二维码嵌入 | `assets/images/ai/ima-qr.png` + 面板内二维码弹层 |
| 用户可通过小程序扫码进行智能问答与自定义路线咨询 | 悬浮球入口 + 快捷问题里的「路线怎么走」；扫码路径保留为兜底 |
| 「可看、可听、可逛、可问」 | 本阶段补上「可问」；其余三项由 02—05 覆盖 |
