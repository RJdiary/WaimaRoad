# 阶段 07 · 素材接入（把设计稿的细节图一一用上）

> 这是 01—05 之后的**收尾阶段**：把占位图换成真素材。它不改版式、不改 Token、不改业务，只换文件与路径。
> 前置：01—05 已通过验收；`assets/` 目录结构已按 01 §4.8 建好。

---

## 0. 先认清一件事：设计稿里的「图」不在 PDF 里

14 个 PDF 是**矢量导出**，实测内部几乎不含可复用位图：

| 画板 | 体积 | 图像对象 | 内嵌 JPEG |
| --- | --- | --- | --- |
| `探索 .vector.pdf` | 27MB | 16 | 0 |
| `史料 (1).vector.pdf` | 13MB | 6 | 0 |
| `5.个人中心*.vector.pdf` | 4—5MB | 4 | 0 |
| `走街.vector.pdf` / `6.登录注册*.vector.pdf` | 0.4—2MB | 2 | 0 |

结论：**PDF 里没有可以「抠出来直接用」的照片**，能抠出来的只有整屏（带文字和背景、且被栅格化后发虚）。
但图片资源并没有丢——它们在**即时设计源文件**里（`https://js.design/f/6EFmjK?p=xwVagmukjl&mode=design`），导出方式见 3.1—3.3。所以：

| 素材类型 | 正确来源 |
| --- | --- |
| 手绘插画、书法标题、Tab 图标、Marker、纸张纹理 | 即时设计里**按图层或编组导出 PNG @2x**（见 3.2） |
| 史料照片、老照片、登录页背景、AI 复原图 | 设计稿只给「位置 + 构图 + 尺寸」，**照片本身要你自己收集/拍摄/授权**，按规格出图（见 3.5） |
| 只有 PDF、源文件已丢 | 用 PDF 整屏当**对位参考**（在 Figma 里铺底、按 750rpx 描），插画重画一遍；不要截图当素材（见 3.4） |

这条决定了操作顺序：**先定尺寸与命名（本文第 2 节）→ 再按尺寸出图 → 最后接线（第 4 节）**。

---

## 1. 三条总原则

1. **名字即契约**：文件名固定（第 2 节），代码只引用文件名。换图 = 覆盖同名文件，不动一行代码。
2. **尺寸即规格**：一律按 750rpx 基准、**@2x 出图**（750rpx 宽 = 750px 图）。禁止先放小图再让 CSS 拉伸。
3. **数据驱动**：照片路径走 `mock/sites.js` 的 `cover` / `images` / `aiRestored` / `oldPhotos` 字段，不写死进 WXML。若接线时必须改页面代码，说明当初没按数据驱动写，属于 01—05 的返工点。

---

## 2. 目录、文件名、尺寸（唯一清单）

> 全部小写、下划线分隔、不带中文、不带空格、不带 `@2x` 后缀（尺寸靠像素保证，不靠文件名）。

| 目录 | 文件名 | 尺寸 | 数量 | 用途 | 接入点 |
| --- | --- | --- | --- | --- | --- |
| `assets/tabbar/` | `explore.png` `archive.png` `walk.png` `profile.png` + 同名 `-active.png` | 104×104 | 8 | 自定义 TabBar 图标 | `app.json` 的 `tabBar.list[].iconPath` / `selectedIconPath` |
| `assets/markers/` | `kaibu.png` `qiaoxiang.png` `wenjiao.png` `hongse.png` | 112×144 | 4 | 地图分类 pin | `explore` 页 marker 的 `iconPath` |
| `assets/illustrations/` | `header-map.png` | 1240×760 | 1 | 探索页 1915—1947 老地图拼贴 | `pages/explore` 头部 |
| | `profile-cover.png` | 1500×1120 | 1 | 我的页水彩封面 | `pages/profile` 封面 |
| | `book.png` | 400×360 | 1 | 史料页旧书 + 羽毛笔 | `pages/archive` 右上 |
| | `signpost.png` | 400×320 | 1 | 走街页木质路牌 | `pages/walk` 左上 |
| | `pin-map.png` | 360×320 | 1 | 走街页地图定位插画 | `pages/walk` 右上 |
| | `empty-search.png` `empty-favorites.png` `empty-checkins.png` `empty-route.png` `empty-messages.png` | 480×360 | 5 | 各空状态插画 | `empty-state` 组件的 `image` |
| `assets/images/` | `login-bg.jpg` | 1125×2436 | 1 | 登录页中山纪念亭背景 | `pages/login` 全屏背景 |
| | `avatar-default.png` | 200×200 | 1 | 未登录默认头像 | `pages/profile` / 编辑资料 |
| `assets/images/sites/` | `site_001.jpg` … `site_012.jpg` | 750×450 | 12 | 12 个点位封面 | `mock/sites.js` 的 `cover` |
| `assets/images/compare/` | `site_001-old-1.jpg` `site_001-old-2.jpg` `site_001-now.jpg` … | 750×500 | 12×3 | 今昔对比老照片 + 现状图 | `Site.oldPhotos[]` / `compare-slider` |
| `assets/images/ai/` | `site_002-ai.jpg` 等 | 750×500 | 按需 | AI 复原示意图 | `Site.aiRestored` |

- `site_XXX` 必须与 `mock/sites.js` 的 `id` 一一对应；**先有 12 条 id，再出 12 张图**，不要反过来。
- 详情页 POI 卡/列表缩略图复用 `images/sites/*.jpg`，不另切一套。
- 走街完成海报用 Canvas 2D 现画，不需要切图。

---

## 3. 怎么把图导出来

### 3.1 设计源文件在即时设计（本项目的唯一图片源）

- 文件：`https://js.design/f/6EFmjK?p=xwVagmukjl&mode=design`
- 14 个 PDF 只是这份文件的**矢量导出**，真正能拿到「原本的图片资源」的地方只有即时设计里的图层。
- 注意：该链接是登录后才可见的在线编辑器，页面由前端渲染；**Codex 和我都打不开它**（抓到的只是空壳 HTML），所以素材必须由你在浏览器里导出成文件。
- 只要图层还在，就永远优先从这里导出，不要退而求其次去 PDF 里截图。

### 3.2 即时设计里批量导出切图（推荐路径）

1. 打开上面的链接，左侧「图层」面板找到对应画板：`探索` / `史料` / `走街` / `个人中心` / `登录注册`。
2. **先改图层名**：把要导出的图层或编组改名为第 2 节的最终文件名（`site_001.jpg`、`explore.png`、`header-map.png` …）。即时设计默认用图层名当导出文件名，**改名 = 省掉后面手工重命名**。
3. 选中图层 → 右侧属性面板最底部「导出」→ `+` → 格式选 `PNG`、倍率 `2x`；照片类选 `JPG`、质量 `80`。
4. 批量导：按住 Shift 多选（或框选同一层级的编组）→ 在导出面板统一设置 → 点「导出全部」→ 浏览器下载一个 zip。
5. 解压 → 按第 2 节的目录放进 `miniprogram/assets/`，覆盖同名占位。
6. 顺手把**整页**也导一份（选画板 → `PNG` `1x`）放 `.design-pdf/ref/`，作为 WXSS 对位参考；它不进 `assets/`、不进包。

**即时设计里必须注意的 5 件事**

| 情况 | 处理 |
| --- | --- |
| 导出面板里有 `SVG` 选项 | 图标可以导 SVG 存档，但**不要放进小程序**：`<image>` 不认 SVG，`app.json` 的 tabBar 只认 PNG |
| 编组带背景填充 | 导出会得到带底色的方图 → 关掉编组填充，或只选框内元素导出 |
| 图层带阴影/模糊效果 | 导出默认包含 → 取消「包含效果」，阴影交给 WXSS 的 `--shadow-*` |
| 插画旁边贴着文字图层 | 先临时隐藏或解锁文字，避免文字被烙进切图 |
| 用了蒙版的照片（封面裁切） | 先应用/转换蒙版再导出，否则导出的还是未裁切的原图 |

### 3.3 把导出 zip 交给助手，一次做完改名与压缩

- 把即时设计下载的 zip 放到 `D:\WaimaRoad\.design-pdf\export\`（已在 `.gitignore`，不进仓库）。
- 剩下的事可以脚本化：按第 2 节清单改名 → 缩放到目标像素 → JPG 压到 ≤80KB、PNG 压到 ≤150KB → 生成 `assets/` 目录树 → 输出「已就位 / 缺失 / 尺寸不符」台账。
- 前提是 zip 里的文件名能认出来（第 3.2 步第 2 点改过图层名最省事；没改也行，只要图层名本身有语义）。

### 3.4 源文件丢了、只有 PDF

1. 用 PDF 阅读器把画板导出为**整屏 PNG**（仅作对位参考，不进 `assets/`，放 `.design-pdf/ref/`）。
2. 在 Figma 里铺这张参考图，按 750rpx 网格（1rpx = 1px @2x）重描插画与图标。
3. 照片位置按第 2 节的尺寸出图，构图参照参考图。
4. **不要把整屏截图切块当素材**：文字会被切进去、边缘发糊、导出后无法换内容。

### 3.5 照片从哪来（必须自己解决）

- 优先用有授权的公开史料图（档案馆、地方志、馆方授权），或自己实地拍摄。
- 每张照片在 `assets/README.md` 记一行来源与授权状态；AI 复原图必须标「AI 生成」。
- 不要用搜索引擎抓图直接上线。

---

## 4. 三种接线方式（对应代码，不改版式）

### 4.1 数据驱动（照片，12 封面 + 对比图）

```js
// mock/sites.js —— 只改这里，页面不动
{
  id: 'site_001',
  name: '潮海关旧址',
  cover: '/assets/images/sites/site_001.jpg',          // 原来是 ''（空串走占位）
  images: [
    '/assets/images/sites/site_001.jpg',
    '/assets/images/sites/site_001-2.jpg'
  ],
  oldPhotos: [
    { url: '/assets/images/compare/site_001-old-1.jpg', year: '1923', source: '汕头市档案馆' },
    { url: '/assets/images/compare/site_001-old-2.jpg', year: '1938', source: '汕头市档案馆' }
  ],
  aiRestored: '/assets/images/ai/site_001-ai.jpg',
}
```

页面侧只读字段，不判断文件是否存在；缺图时 `cover` 留空串，由 `.media-placeholder` 走占位分支。

### 4.2 组件 props（插画、空状态、marker）

```html
<!-- pages/walk/index.wxml -->
<image class="walk__sign" src="/assets/illustrations/signpost.png" mode="aspectFit" lazy-load />

<!-- empty-state：换图只换 props，组件不动 -->
<empty-state image="/assets/illustrations/empty-favorites.png"
             title="收藏夹还是空的" action-text="去逛史料" bind:action="goArchive" />
```

### 4.3 静态配置（TabBar 图标）

```json
// app.json —— 8 个图标必须真实存在，否则自定义 TabBar 校验失败
{ "pagePath": "pages/explore/index", "text": "探索",
  "iconPath": "assets/tabbar/explore.png",
  "selectedIconPath": "assets/tabbar/explore-active.png" }
```

`tab-icon` 组件内部若用 CSS 画占位图标，接线时改为 `<image>` 渲染；**只改组件内部**，外部调用方式不变。

---

## 5. 体积红线（最容易在这一步翻车）

| 预算项 | 上限 |
| --- | --- |
| 主包 | **≤ 2MB**（含 4 Tab + 登录注册 + 它们引用的图片） |
| 单张列表封面 | ≤ 80KB（750px 宽、JPG q80） |
| 单张插画 | ≤ 150KB（PNG-24；超了改 JPG q85 或降 @1.5x） |
| 首屏图片总量 | < 800KB |

算一笔账：12 封面（80KB）+ 36 对比图（80KB）≈ **3.8MB**，直接塞主包必炸。对策：

1. **对比图只服务详情页** → 放 `subpackages/detail`，图片跟着分包走（分包上限 2MB，总包 20MB）。
2. 照片优先 **WebP**（`<image>` 支持），比 JPG 再省 25—35%；`assets/README.md` 里注明格式。
3. 插画能用 `aspectFit` 缩小的，按实际显示尺寸出图，不要一律 @2x 出 1500px 大图。
4. 禁止：base64 内联大图、外链图片、网络字体、`.svg` 直接当 Tab 图标（`app.json` 只认 PNG）。

---

## 6. 分批接入（建议顺序）

| 批次 | 内容 | 完成后能看到什么 |
| --- | --- | --- |
| 1 | 4 个 Tab 图标 + 4 个 marker | 整体视觉骨架立刻"像设计稿"了 |
| 2 | 12 张点位封面 | 史料列表、POI 卡、打卡页同时亮起来 |
| 3 | 5 张插画（头部拼贴、书、路牌、定位、我的封面） | 4 个 Tab 的头部全部到位 |
| 4 | 登录背景 + 默认头像 | 登录流程可截图 |
| 5 | 今昔对比 + AI 复原图（进详情分包） | 详情页最有说服力的部分 |
| 6 | 5 张空状态插画 | 兜底体验完整 |

每批做完就跑一次真机，别攒到最后一起调——第 5 批最容易把包体顶爆。

---

## 7. 交给 Codex 的提示词（可直接贴）

```
阶段 07 · 素材接入。你只做三件事：接线、不改版式、不动文档。

【输入】
- 资产目录：miniprogram/assets/（tabbar/ markers/ illustrations/ images/）
- 素材清单：docs/codex-prompts/07-assets-swap.md 第 2 节
- 现有数据：miniprogram/mock/sites.js

【要求】
1. 先扫 assets/ 下真实存在的文件，输出一张「文件 → 引用位置」对照表，缺图/多图/命名不符的全部列出，等我确认后再动手。
2. 只允许改三处：
   a) mock/sites.js 的 cover / images / oldPhotos / aiRestored 字段；
   b) 页面 WXML 里 <image> 的 src 与 empty-state 的 image 属性；
   c) app.json 的 tabBar 图标路径与 tab-icon 组件内部渲染方式。
3. 不得改动：app.wxss 的 Token、字号、圆角、间距、任何 margin/padding/尺寸；不得新增组件；不得改业务逻辑。
4. 每张图必须带 mode（aspectFill 用于封面、aspectFit 用于插画）与 lazy-load（列表内）。
5. 缺图时保留占位分支，不得留空 src、不得写外链、不得把图片转 base64。
6. 完成后输出：用了哪些图、哪些还是占位、主包体积估算（按文件字节数求和）、以及需要我补的图清单。
```

---

## 8. 验收清单

- [ ] `assets/tabbar/` 8 个 PNG 存在，TabBar 4 项图标选中/未选中都正确，无白边无锯齿。
- [ ] `assets/markers/` 4 个 pin 在地图上显示正常，点击热区不偏、选中态放大 1.2 倍不糊。
- [ ] 12 张封面全部落地，史料列表 / POI 卡 / 我的打卡点三处复用同一文件。
- [ ] 5 张插画在 750px 宽屏与 iPhone SE 尺寸下都不裁切主体、不变形。
- [ ] 登录背景铺满无留白，顶部白色渐隐下黑字可读，底部黑遮罩下白字可读。
- [ ] 今昔对比滑块：老照片与现状图同机位、同尺寸，拖动无跳变。
- [ ] 所有空状态有插画（不是空白），文案与插画语义一致。
- [ ] 全仓库 `<image>` 无外链、无 base64、无空 src。
- [ ] 主包体积 ≤ 2MB（开发者工具「代码依赖分析」核对）。
- [ ] 真机（iOS + 安卓各一台）滚一遍：无白框、无裂图、无明显发虚。
- [ ] `assets/README.md` 记录了每张图的来源/授权/尺寸/格式。
- [ ] 换图只覆盖同名文件，`git diff` 里不出现 `.js` / `.wxml` 改动。

---

## 9. 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 真机上图标发虚 | 出图按 1x（52px），显示放大 | 按 104×104 出图（2x） |
| 封面主体被裁掉 | `aspectFill` + 图长宽比与 750×450 不符 | 按 5:3 出图；主体居中 |
| 阴影变两层、边缘发脏 | 切图自带投影/白底 | 导出时去掉背景与效果 |
| TabBar 校验失败 | `app.json` 引用了不存在的图标 | 8 个 PNG 先落地再改 app.json |
| 主包超 2MB | 对比图、大插画塞进主包 | 对比图挪 `subpackages/detail` |
| PNG 变 JPG 后出现黑边 | 透明背景被压缩成黑色 | 照片用 JPG，插画/图标用 PNG-24 |
| 中文文件名在真机裂图 | 部分安卓机对中文路径不友好 | 全部小写英文 + 下划线 |
| 换了一批图后样式全乱 | 顺手改了 WXML 结构或加了尺寸 | 回滚，只允许改 src |

---

## 10. 素材对照表模板（复制到 `miniprogram/assets/README.md` 逐行填）

| 编号 | 文件名 | 尺寸 | 来源（画板/图层/拍摄/授权） | 接入位置 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 01 | `tabbar/explore.png` | 104×104 | 探索画板 · Tab 图标图层 | `app.json` tabBar | ☐ |
| 02 | `tabbar/explore-active.png` | 104×104 | 同上（选中态） | `app.json` tabBar | ☐ |
| 03 | `markers/kaibu.png` | 112×144 | 探索画板 · 地图 pin | explore marker | ☐ |
| … | … | … | … | … | ☐ |
| 25 | `images/sites/site_001.jpg` | 750×450 | 自摄 / 馆方授权 | `mock/sites.js` cover | ☐ |
| 26 | `images/compare/site_001-old-1.jpg` | 750×500 | 汕头市档案馆（待授权） | `oldPhotos[0]` | ☐ |

> 这张表就是「一一用上」的台账：每勾一行，就少一张占位图。素材到齐后把它交给 Codex，第 7 节的提示词会按表核对缺漏。
