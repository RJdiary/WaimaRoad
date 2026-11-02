# 每个阶段的「第一条消息」（直接复制）

> 用法：每个阶段**新开一个会话**（`/new stage-0X`），把对应代码块整段贴进去，等它复述、你确认后再让它写代码。
> 发之前确认三件事：① 根目录有 `AGENTS.md`；② 上一阶段已 commit；③ 微信开发者工具已打开 `D:\WaimaRoad`。

## 复述要复述什么（每一阶段都按这四问验收）

每条消息里都有一行「先复述实现方案」。判它复述得合不合格，只看四件事：

| # | 要它说清楚 | 不合格的样子 |
|---|---|---|
| ① | 建/改哪些文件，逐个列出来 | 「我会创建相关页面和组件」 |
| ② | **每个文件怎么实现**：数据从哪个 `api.xxx()` 来、读哪个 `byxz_` key、关键交互用哪个小程序 API（`movable-area` / `wx.startLocationUpdate` / `touchmove` 算百分比…）、状态放 `data` 还是 `globalData` | 只报文件名，一个 API 都不提 |
| ③ | 最容易做错的 2 个点 + 它打算怎么规避 | 「应该没什么难点」 |
| ④ | 验收清单里每一条怎么自测 | 「我会保证质量」 |

**只列文件名 = 打回**，回这句：

```text
你只给了清单。请补三点再说：
1) 每个文件的数据从哪来（调哪个 api 方法、读哪个 byxz_ key）；
2) 关键交互怎么实现（用哪个小程序 API、核心算法、状态存哪）；
3) 这两处最容易出错的地方，以及你的规避办法。
不要写代码，只补这三段。
```


---

## 阶段 01 · 工程骨架与设计系统

> 已完成可跳过；重跑或换机器时用。

```text
本阶段任务：阶段 01（工程骨架、设计系统与公共基础组件）。

请按顺序读这三个文件后再动手：
1. docs/codex-prompts/AGENTS.md（工作约定）
2. docs/codex-prompts/00-baseline.md（事实源，冲突以它为准）
3. docs/codex-prompts/01-scaffold-theme.md（本阶段规格）

硬性要求：
- 先复述实现方案（≤15 行）：① 要建哪些文件 ② 每个文件怎么实现（app.json 的路由与 TabBar、app.wxss 的 Token 与字体类、storage/format/location/api 各自导出什么、空壳页怎么建）③ 最容易做错的 2 点与规避办法 ④ 验收怎么逐条判。等我确认后再写代码。
- 只创建/修改 01「需创建的文件清单」里的路径，其他一律不动；不改 appid、libVersion、projectname。
- 20 条路由 × 4 文件 = 80 个空壳文件必须齐；app.json 的 8 个 Tab 图标 PNG 必须先真实存在。
- app.wxss 只用 18 个 Token，逐字照抄色值；--fs 体系按规格写，不要自创字号。
- 不调用 wx.cloud.init、不强制登录、不发网络请求、不写业务逻辑。

完成后输出：验收勾选表（是/否 + 文件路径:行号）+ 未做项 + 偏离项。
```

---

## 阶段 02 · 探索页与史料页

```text
本阶段任务：阶段 02（探索页 + 史料页）。

请按顺序读：
1. docs/codex-prompts/AGENTS.md
2. docs/codex-prompts/00-baseline.md
3. docs/codex-prompts/02-explore-archive.md

硬性要求：
- 先复述实现方案（≤15 行）：① 文件清单 ② 探索页怎么实现（拼贴头部与竖排书法怎么做、marker 如何一次性设置、POI 卡怎么滑出与收起）③ 史料页四态（骨架/空态/失败/加载更多）怎么接 ④ 三个最易走形的点与你的规避办法 ⑤ 验收怎么判。等我确认后再写。
- 只允许新增/修改：pages/explore/*、pages/archive/*、components/site-card/*、components/filter-chips/*、mock/sites.js、utils/api.js（只追加接口）。
- 不实现详情页、不做走街；点击卡片只跳转，不写详情逻辑。
- 地图：marker 一次性设置，选中态单独 setData；不要每次移动都重设整份 marker。
- 史料页必须有骨架（3 张）、空态、失败重试、上拉加载「已经到底啦」四态。
- 12 条点位数据放 mock/sites.js，页面只调 api.getSites()，不得直接 require('../../mock/sites')。
- 数字一律走 formatCount（2600 → 2.6k）。

完成后输出：验收勾选表 + 未做项 + 偏离项。
```

---

## 阶段 03 · 详情 / 专题 / AI 复原 / 走街

```text
本阶段任务：阶段 03（史料详情、专题聚合、AI 复原、走街页、路线详情、走街进行中）。

请按顺序读：
1. docs/codex-prompts/AGENTS.md
2. docs/codex-prompts/00-baseline.md
3. docs/codex-prompts/03-detail-walk.md

硬性要求：
- 先复述实现方案（≤15 行）：① 6 页 + 4 组件清单 ② 今昔对比滑块怎么算百分比、走街定位用哪个 API 怎么更新 ③ 哪些浮层必须用 cover-view、Canvas 海报怎么画 ④ 最易做错的 2 点与规避办法 ⑤ 验收怎么判。等我确认后再写。
- 只允许新增/修改：subpackages/detail/pages/{site-detail,topic,ai-restore}/*、subpackages/route/pages/{route-detail,walking}/*、
  components/{compare-slider,checkin-sheet,map-poi-sheet,route-card}/*、mock/routes.js、utils/api.js（追加接口）。
- 原生 <map> 上的浮动元素一律用 cover-view / cover-image，普通 view 会被地图盖住。
- 路线详情：polyline 用主题色，marker 带序号，includePoints 自动缩放；点位数以 stops.length 为准，不写死 5。
- 打卡：≤200m 可打，>200m 按钮置灰并显示距离；同一点位当天只计一次。
- 走街完成海报用 Canvas 2D 现画，不引 Lottie、不用外部图片；AI 复原必须标注「AI 生成 / 仅供想象」。

完成后输出：验收勾选表 + 未做项 + 偏离项。
```

---

## 阶段 04 · 登录注册 / 我的 / 用户中心

```text
本阶段任务：阶段 04（登录、注册、我的页与用户中心 9 个二级页）。

请按顺序读：
1. docs/codex-prompts/AGENTS.md
2. docs/codex-prompts/00-baseline.md
3. docs/codex-prompts/04-auth-profile-user.md

硬性要求：
- 先复述实现方案（≤15 行）：① 11 页清单 ② 登录拦截与 redirect 回跳的完整代码路径（谁写、谁读、谁清）③ 字体缩放怎么做到全局即时生效 ④ 最易做错的 2 点（Storage key 命名、未登录拦截边界）与规避办法 ⑤ 验收怎么判。等我确认后再写。
- 只允许新增/修改：pages/{login,register}/*、pages/profile/*、subpackages/user/pages/ 下 9 页、mock/user.js、utils/auth.js、utils/api.js（追加接口）。
- Storage key 逐字用基线 §7.5：byxz_token、byxz_user、byxz_redirect、byxz_font_scale、byxz_font_follow_system、byxz_preferences、byxz_privacy、byxz_search_history。
- 字体缩放：0.9—1.3、步进 0.05、保留两位小数，写 byxz_font_scale；切换后当前页立即生效。
- 登录页：密码掩码、失焦即校验、错误抖动 300ms、Mock 账号 baibianwaimatu / 123456、验证码 123456。
- 未登录点「打卡/收藏/走街开始/我的数据」→ 写 redirect → 跳登录 → 成功后原路回跳；浏览与搜索不拦。
- 我的页 600ms 数字滚动；菜单 5 项顺序不可变。

完成后输出：验收勾选表 + 未做项 + 偏离项。
```

---

## 阶段 05 · 数据层收口与整体验收

```text
本阶段任务：阶段 05（数据层、Mock、API、业务规则、平台能力与整体验收）。

请按顺序读：
1. docs/codex-prompts/AGENTS.md
2. docs/codex-prompts/00-baseline.md
3. docs/codex-prompts/05-data-platform-acceptance.md

硬性要求：
- 这是收口阶段：只补 mock/、utils/、utils/api.js 全量接口、平台能力与验收；不允许重写页面结构、不允许改版式。
- 先复述实现方案（≤15 行）：① 接口清单与 mock 文件怎么划分 ② 10 条业务规则各自落在哪个函数、怎么判 ③ USE_MOCK 开关在哪、切后端要改哪几行 ④ 最易做错的 2 点与规避办法 ⑤ 主包体积怎么估、验收怎么判。等我确认后再写。
- USE_MOCK 保持 true；页面不得直接 require('mock/*')、不得 wx.getStorageSync 业务数据。
- 12 条点位、4 条路线、种子收藏/打卡数据必须完整可渲染，不留 TODO。
- 平台能力：定位授权说明、隐私协议、分享、震动、订阅消息（模板 ID 空时只写本地状态、不调 API）。
- 最后回归阶段 01—04 的验收项，逐条跑一遍主链路。

完成后输出：验收勾选表 + 主包体积估算（按文件字节求和）+ 未通过项 + 建议回滚范围。
```

---

## 阶段 06 · 浏览器原型（可选）

```text
本阶段任务：阶段 06（用 build-web-apps 插件做浏览器视觉原型）。

请先读 docs/codex-prompts/06-web-prototype-buildwebapps.md，按其中第 4 节的提示词执行。

硬性要求：
- 先复述实现方案（≤10 行）：① 单文件怎么组织（Token 变量、6 屏结构、占位规则）② 拖动/滑块/轮播这些原型交互各用什么 CSS/JS 做 ③ --fs 四档怎么切换且不破版 ④ 验收怎么判。等我确认后再写。
- 只产出 prototype/index.html：单文件、双击可开、零依赖、无外链资源。
- 不写小程序代码，不改 docs/ 下任何文件，不改 Token 与文案。
- 6 屏按 750rpx 设计稿换算（1rpx = 0.5px）；图片位用渐变 + 建筑名占位。
- 必须提供 --fs 切换（0.9 / 1.0 / 1.15 / 1.3），四档都不破版。
- 完成后附一张「关键数值表」：每屏的宽高、间距、字号、圆角（rpx），供 01—04 抄。

注意：这是参考物不是交付物，prototype/ 不进仓库。
```

---

## 阶段 07 · 素材接入（收尾）

```text
本阶段任务：阶段 07（素材接入，替换占位图）。

请先读 docs/codex-prompts/07-assets-swap.md，进入阶段 07。

硬性要求：
- 先复述实现方案（≤10 行）：① 对照表怎么生成（扫哪些目录、比什么）② 三处改动分别在哪个文件、怎么改 ③ 缺图/尺寸不符怎么降级 ④ 怎么保证只改路径不动版式 ⑤ 验收怎么判。等我确认后再改。
- 先扫 miniprogram/assets/ 实际存在的文件，输出「文件 → 引用位置」对照表，列清缺图 / 多图 / 命名不符 / 尺寸不符，等我确认后再改。
- 只允许改三处：mock/sites.js 的图片字段（cover / images / oldPhotos / aiRestored）、
  页面 WXML 的 <image src> 与 empty-state 的 image、app.json 的 tabBar 图标路径（以及 tab-icon 组件内部的渲染方式）。
- 不得改 Token、字号、间距、任何 margin/padding/尺寸、业务逻辑；不得新增组件。
- 封面 mode="aspectFill"，插画 mode="aspectFit"，列表内图加 lazy-load。
- 缺图保留占位分支；禁止空 src、禁止外链、禁止 base64 内联。

完成后报告：用了哪些图、哪些仍是占位、主包体积估算、需要我补的图清单。
```

---

## 阶段 08 · AI 知识库问答（悬浮球）

> 前置：阶段 01 完成即可；全量挂载建议 02—04 页面都齐了再做。

```text
本阶段任务：阶段 08（AI 知识库问答：全局悬浮球 + 问答面板）。

请按顺序读：
1. docs/codex-prompts/AGENTS.md
2. docs/codex-prompts/00-baseline.md
3. docs/codex-prompts/08-ai-chat.md

硬性要求：
- 先复述实现方案（≤15 行）：① 文件清单 ② 拖动与吸附怎么算（movable-area/movable-view 参数、x/y 如何换算、吸附到哪边）、位置如何持久化 ③ 三个有原生 map 的页面怎么避让 ④ 三条口径（拖动不带动页面、18 页挂载、地图页避让）你打算怎么保证 ⑤ 验收怎么判。等我确认后再写。
- 只建：components/ai-ball/*、components/ai-panel/*、utils/ai.js、mock/ai.js；
  只改：app.json（全局注册 ai-ball）、utils/storage.js（加 byxz_ai_ball_pos、byxz_ai_history）、
  18 个页面 WXML（各加一行 <ai-ball />，登录与注册页不挂）。
- 拖动只能用 movable-area + movable-view + catch:touchmove，且 movable-area 必须 pointer-events: none；
  禁止手写 position:fixed + bindtouchmove 全屏拖动。
- 探索、路线详情、走街进行中三个有原生 map 的页面，球不得被地图盖住、不得遮挡地图内按钮。
- 面板：85% 高、遮罩可关、快捷问题按页面分组、加载/失败/空三态、历史 ≤50 条。
- 每条 AI 回答必须带「AI 生成，请以史料原文为准」；超范围问题统一拒答。
- 不改任何页面已有排版与业务逻辑；不新增路由；AI_PROVIDER 默认 'mock'。

完成后输出：验收勾选表（重点：拖动时页面是否滚动、地图页是否被盖）+ 未做项 + 偏离项。
```

---

## 阶段 09 · 适老化模式

> 依赖 04（字体设置）与 03（路线详情）；建议排在 05 之后。

```text
本阶段任务：阶段 09（适老化模式：简约浏览 + 全局字体放大 + 路线适老标注）。

请按顺序读：
1. docs/codex-prompts/AGENTS.md
2. docs/codex-prompts/00-baseline.md
3. docs/codex-prompts/09-elder-mode.md

硬性要求：
- 先复述实现方案（≤15 行）：① .elder 覆盖哪些变量、点击区改成多少、哪些装饰要隐藏、哪些动效要关 ② 开关状态怎么做到全局立即生效、为什么不能写 byxz_font_scale、关闭后怎么回到原字号 ③ facilities 怎么渲染、图标缺失怎么降级 ④ 最容易做错的 2 点与规避办法 ⑤ 验收怎么判。等我确认后再写。
- 只允许修改：app.js、utils/storage.js（加 byxz_elder_mode）、app.wxss（只加 .elder 段）、
  pages/profile/*（菜单第 6 行 + Switch）、20 个页面 WXML 根节点 class、
  subpackages/user/pages/font/*（禁用手法）、subpackages/route/pages/{route-detail,walking}/*、mock/sites.js（追加 facilities）。
- 适老模式只改「显示密度与尺寸」：--fs 1.3、行高 1.9、点击区 ≥112rpx、隐藏 .deco 装饰、关非必要动效。
- 不得用 transform: scale() 整体缩放页面；不得新增色彩 Token（只覆盖 --fs/--ink/--ink-2/--ink-3/--line）。
- 适老开启期间字体设置页滑块禁用并说明；关闭后必须恢复到用户原来的 byxz_font_scale，不得被适老写坏。
- 路线详情时间轴、走街顶部条要显示 Site.facilities（座椅/无障碍/坡道/卫生间/遮阴）；图标缺失降级为文字胶囊，不得裂图。
- 不改信息架构：不删区块、不合并页面、不新增路由。

完成后输出：验收勾选表（重点：byxz_font_scale 前后是否不变、关掉适老是否回到原字号）+ 未做项 + 偏离项。
```

---

## 备用模板

### 它越界改了不该改的文件

```text
越界了：你改了 <文件路径>，它不在本阶段的清单里。
请立刻只回滚这一个文件（git checkout -- <文件路径>），然后用 git diff 自查：
本次改动是否只剩清单内的文件？确认后继续本阶段剩余工作。
```

### 同一阶段反复失败

```text
缩小任务：本阶段只做「页面结构与样式」，不接 api、不写交互逻辑。
先给出 3 个文件的骨架（<文件1> <文件2> <文件3>），我确认结构后再继续。
```

### 想让它自审

```text
/review
请对照本阶段文末「验收标准」逐条给结论：是 / 否 + 证据（文件路径:行号）。
不要修改代码，只报告。
```
