# 城市历史文化探索微信小程序 - The Implementation Plan

## [x] Task 1: 全局配置与主题样式
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 更新 app.json 配置：注册所有页面路由、配置底部Tab导航（探索/史料/走街/我的）、设置主题色
  - 更新 app.wxss：定义全局CSS变量（暖棕色系配色方案）、全局字体（宋体标题）、通用卡片样式、圆角、阴影等
  - 更新 app.js：初始化云开发环境、全局数据管理（用户信息、字体设置、收藏/打卡缓存）
  - 删除示例页面和组件，清理项目结构
- **Acceptance Criteria Addressed**: AC-1, AC-15, FR-1, FR-3
- **Test Requirements**:
  - `programmatic` TR-1.1: app.json 中包含4个Tab配置，页面路径正确
  - `programmatic` TR-1.2: app.wxss 中定义了完整的CSS变量（主色、辅色、文字色、圆角、阴影）
  - `programmatic` TR-1.3: app.js 正确初始化云开发，globalData包含用户信息、字体设置等字段
  - `human-judgement` TR-1.4: 视觉评审：打开小程序后底部导航栏样式正确，4个Tab图标和文字清晰
- **Notes**: 底部Tab图标优先使用项目已有 icons 目录中的资源，如不匹配则使用文字或自定义图标

## [x] Task 2: 探索首页（地图+快捷入口）
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 创建 pages/explore/index 页面（4个文件：wxml/wxss/js/json）
  - 顶部标题栏："探索"大标题+时间显示+搜索/消息按钮
  - 手绘地图区域：使用背景色+SVG/Canvas模拟手绘街道风格，放置建筑/红色/宗教分类图标标注（使用绝对定位）
  - 地图图例说明
  - 快捷入口卡片网格：4个卡片（建筑遗存、红色记忆、AI修复影像、主题走街）
  - 全局AI悬浮圆圈入口
  - 实现交互：点击分类图标跳转史料模块并传递分类参数；点击快捷入口跳转对应页面
- **Acceptance Criteria Addressed**: AC-2, AC-3, FR-4, FR-5, FR-6, FR-7
- **Test Requirements**:
  - `programmatic` TR-2.1: 页面路由在app.json中正确注册
  - `programmatic` TR-2.2: 点击建筑图标调用wx.switchTab或navigateTo到史料页并携带category=building参数
  - `human-judgement` TR-2.3: 视觉评审：地图区域配色为暖棕色系手绘风格，图标标注位置合理，快捷卡片样式统一
  - `human-judgement` TR-2.4: 交互评审：所有可点击元素有hover反馈，页面滚动流畅
- **Notes**: 地图使用纯CSS+WXML模拟即可，无需真实地图组件；后续可替换为真实手绘地图图片

## [x] Task 3: 史料列表页（分类+卡片列表）
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 创建 pages/heritage/index 页面
  - 顶部标题："史料"+副标题
  - 分类标签滚动导航：全部、建筑、红色、宗教、AI修复（横向滚动，选中态高亮）
  - 史料卡片列表：卡片包含缩略图（emoji或渐变色块代替）、分类标签、标题、简介、浏览数/收藏数
  - 下拉刷新、上拉加载更多
  - 使用Mock数据展示至少6条不同分类的史料
  - 点击卡片跳转史料详情页
  - 接收从探索页跳转过来的分类参数，自动选中对应标签
- **Acceptance Criteria Addressed**: AC-4, FR-8, FR-9
- **Test Requirements**:
  - `programmatic` TR-3.1: 页面路由正确注册为Tab页
  - `programmatic` TR-3.2: 分类标签点击后列表数据正确过滤
  - `programmatic` TR-3.3: 从探索页带参数跳转时自动选中对应分类
  - `human-judgement` TR-3.4: 视觉评审：卡片样式与UI原型一致，分类标签选中态明显
- **Notes**: Mock数据放在单独的data文件中，便于后续替换为云数据库接口

## [x] Task 4: 史料详情页
- **Priority**: high
- **Depends On**: Task 3
- **Description**: 
  - 创建 pages/heritageDetail/index 页面
  - 顶部大图展示区（渐变色+emoji代替）
  - 返回按钮、收藏按钮、分享按钮
  - 标题、标签组（分类/地点/年代）
  - 简介文字段落
  - 语音播放器组件：播放按钮、进度条、时长显示
  - 相关图片展示网格（3列）
  - 收藏功能：点击收藏按钮，调用云数据库保存/删除收藏记录
  - Mock语音播放（使用innerAudioContext，实际音频可后续补充）
- **Acceptance Criteria Addressed**: AC-5, AC-12, FR-10, FR-12
- **Test Requirements**:
  - `programmatic` TR-4.1: 页面路由正确注册
  - `programmatic` TR-4.2: 收藏状态正确切换，云数据库favorites集合有对应记录
  - `human-judgement` TR-4.3: 视觉评审：大图区、标签、语音播放器样式与原型一致
  - `human-judgement` TR-4.4: 交互评审：语音播放按钮点击有反馈，进度条可显示
- **Notes**: 语音播放器封装为独立组件，便于复用

## [x] Task 5: AI修复影像对比页
- **Priority**: medium
- **Depends On**: Task 3
- **Description**: 
  - 创建 pages/aiCompare/index 页面
  - 返回按钮
  - 标题+副标题说明
  - 滑动对比器组件：左侧显示修复前影像（灰度+低透明度滤镜）、右侧显示修复后影像、中间可拖动的分割控制条
  - 对比标签："原始影像"、"AI修复"
  - 背景故事文字介绍
  - 实现触摸滑动控制对比分割线位置
- **Acceptance Criteria Addressed**: AC-6, FR-11
- **Test Requirements**:
  - `programmatic` TR-5.1: 页面路由正确注册
  - `programmatic` TR-5.2: 触摸滑动时分割线位置跟随手指移动
  - `human-judgement` TR-5.3: 视觉评审：对比效果明显，修复前后差异可清晰感知
  - `human-judgement` TR-5.4: 交互评审：滑动流畅无卡顿，分割线位置准确
- **Notes**: 使用两张不同效果的图片（或渐变色块）作为对比素材

## [x] Task 6: 走街路线列表页
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 创建 pages/street/index 页面（作为走街Tab首页）
  - 顶部标题："走街"+副标题
  - 主题路线卡片列表，至少3条路线：
    - 红色记忆路线（红色主题标签、5个点位、2.5小时、3.2公里）
    - 建筑艺术路线（建筑主题标签、6个点位、3小时、4.1公里）
    - 宗教文化路线（宗教主题标签、4个点位、2小时、2.5公里）
  - 每张卡片包含：路线名称、主题徽章、点位流程（圆点连线展示）、统计信息、"开始走街"按钮
  - 点击路线卡片或开始按钮跳转到走街地图页
- **Acceptance Criteria Addressed**: AC-7, FR-13
- **Test Requirements**:
  - `programmatic` TR-6.1: 页面路由正确注册为Tab页
  - `programmatic` TR-6.2: 点击开始按钮正确跳转到走街地图页并携带routeId参数
  - `human-judgement` TR-6.3: 视觉评审：路线卡片样式与原型一致，主题标签颜色区分明显
- **Notes**: 路线数据使用Mock数据，结构参考PRD数据字典

## [x] Task 7: 走街地图页（地图+点位+弹窗）
- **Priority**: high
- **Depends On**: Task 6
- **Description**: 
  - 创建 pages/streetMap/index 页面
  - 顶部导航：返回按钮、路线名称、进度说明
  - 使用微信地图组件（map）展示路线点位，标记所有点位
  - 走街进度条：已完成百分比、进度填充条
  - 点位列表：每个点位显示序号、名称、状态（已打卡/当前/未完成）
  - 点位弹窗组件（从底部弹出）：
    - 点位名称、关闭按钮
    - 地图缩略图+图片（2列网格）
    - 简略史料介绍
    - AI视频按钮、语音讲解按钮
    - "查看具体史料信息"主按钮（跳转史料详情）
    - "在地图上查看"次按钮（跳转探索首页并定位）
    - 打卡按钮
  - 点击地图上的点位标记弹出点位弹窗
  - 打卡功能：保存到云数据库checkins集合
- **Acceptance Criteria Addressed**: AC-8, AC-13, FR-14, FR-15, FR-16
- **Test Requirements**:
  - `programmatic` TR-7.1: 页面路由正确注册
  - `programmatic` TR-7.2: 地图组件正确标记所有点位，markers数据正确
  - `programmatic` TR-7.3: 打卡成功后云数据库checkins集合有记录
  - `human-judgement` TR-7.4: 视觉评审：点位弹窗从底部滑出，样式与原型一致
  - `human-judgement` TR-7.5: 交互评审：弹窗弹出/关闭动画流畅，按钮点击有反馈
- **Notes**: 地图组件使用微信原生map组件，markers经纬度使用示例数据

## [x] Task 8: 我的页面（个人中心）
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 创建 pages/mine/index 页面（我的Tab首页）
  - 顶部用户信息区：渐变背景（暖棕色渐变）、头像、昵称、签名
  - 未登录状态显示登录入口，已登录显示用户信息
  - 统计数据卡片：打卡数、收藏数、足迹路线数（三列）
  - 功能菜单分组：
    - 第一组：我的打卡点、我的收藏
    - 第二组：喜好设置、字体设置、隐私设置
  - 每个菜单项：图标、标题、说明文字、右箭头
  - 微信登录功能：使用wx.getUserProfile或button open-type
  - AI悬浮圆圈入口
- **Acceptance Criteria Addressed**: AC-9, FR-17, FR-18, FR-19, FR-20, FR-22, FR-23
- **Test Requirements**:
  - `programmatic` TR-8.1: 页面路由正确注册为Tab页
  - `programmatic` TR-8.2: 登录后用户信息正确保存到globalData和本地缓存
  - `programmatic` TR-8.3: 点击我的打卡点/收藏正确跳转对应页面
  - `human-judgement` TR-8.4: 视觉评审：顶部渐变背景、统计卡片、菜单样式与原型一致
- **Notes**: 登录态使用本地缓存持久化

## [x] Task 9: 我的收藏/打卡列表页
- **Priority**: medium
- **Depends On**: Task 8
- **Description**: 
  - 创建 pages/myFavorites/index 页面（收藏列表）
  - 创建 pages/myCheckins/index 页面（打卡列表）
  - 顶部导航：返回按钮、页面标题
  - 列表卡片：与史料卡片类似，展示收藏/打卡的内容
  - 空状态展示：无数据时显示友好提示
  - 收藏列表从云数据库favorites集合查询
  - 打卡列表从云数据库checkins集合查询
  - 支持点击跳转对应详情页
- **Acceptance Criteria Addressed**: FR-19, FR-20
- **Test Requirements**:
  - `programmatic` TR-9.1: 页面路由正确注册
  - `programmatic` TR-9.2: 列表数据正确从云数据库获取
  - `human-judgement` TR-9.3: 视觉评审：空状态友好，列表卡片样式统一
- **Notes**: 两个页面结构类似，可复用列表组件

## [x] Task 10: 字体设置页
- **Priority**: medium
- **Depends On**: Task 8
- **Description**: 
  - 创建 pages/fontSettings/index 页面
  - 顶部导航：返回按钮、标题"字体设置"
  - 预览区域：标题"预览效果"+示例文字段落
  - 字号选项：4个选项（小/中/大/特大），当前选中高亮
  - 自动同步系统字体开关
  - 选择字号后预览区域文字实时变化
  - 字体设置保存到本地缓存和app.globalData
  - 全局生效：所有页面读取全局字体设置调整文字大小
- **Acceptance Criteria Addressed**: AC-10, FR-21
- **Test Requirements**:
  - `programmatic` TR-10.1: 页面路由正确注册
  - `programmatic` TR-10.2: 字号设置保存到本地缓存，key为fontSize
  - `human-judgement` TR-10.3: 视觉评审：字号选项样式与原型一致，选中态明显
  - `human-judgement` TR-10.4: 交互评审：切换字号时预览文字实时变化，返回其他页面后字体也变化
- **Notes**: 使用CSS变量控制全局字体大小，切换时更新page的style

## [x] Task 11: AI知识库问答组件
- **Priority**: medium
- **Depends On**: Task 1
- **Description**: 
  - 创建 components/aiChat 组件（wxml/wxss/js/json）
  - 悬浮圆圈：可拖动（movable-view），默认右下角位置
  - 点击悬浮圆圈弹出问答面板（从底部滑入，占75%屏幕高度）
  - 问答面板：
    - 头部：AI头像、名称、在线状态、关闭按钮
    - 快捷问题标签：横向滚动，3个推荐问题
    - 对话区域：AI消息气泡（白底）、用户消息气泡（暖棕渐变底）
    - 回答反馈：有帮助/没帮助按钮
    - 输入区：多行输入框、发送按钮
  - Mock问答：预置几条问答对，用户提问后匹配返回
  - 在4个主Tab页面中引入该组件
- **Acceptance Criteria Addressed**: AC-11, FR-25, FR-26, FR-27, FR-28, FR-29
- **Test Requirements**:
  - `programmatic` TR-11.1: 组件正确注册，4个主页面均引入
  - `programmatic` TR-11.2: 悬浮圆圈可拖动，位置可改变
  - `human-judgement` TR-11.3: 视觉评审：对话气泡样式与原型一致，AI和用户气泡区分明显
  - `human-judgement` TR-11.4: 交互评审：面板从底部滑入动画流畅，快捷问题点击可填入对话
- **Notes**: 组件使用movable-area+movable-view实现可拖动效果

## [x] Task 12: 喜好设置与隐私设置页
- **Priority**: low
- **Depends On**: Task 8
- **Description**: 
  - 创建 pages/preferenceSettings/index 页面（喜好设置）
    - 分类多选：建筑、红色、宗教、AI修复等，可多选
    - 保存到本地缓存和云数据库
  - 创建 pages/privacySettings/index 页面（隐私设置）
    - 个人资料展示与编辑入口
    - 授权管理：通知权限、定位权限状态展示
    - 订阅消息入口：新史料通知、活动提醒、打卡成就的订阅/取消
    - 调用wx.requestSubscribeMessage进行订阅消息授权
- **Acceptance Criteria Addressed**: FR-22, FR-23, FR-24, AC-14
- **Test Requirements**:
  - `programmatic` TR-12.1: 页面路由正确注册
  - `programmatic` TR-12.2: 订阅消息调用wx.requestSubscribeMessage能弹出授权框
  - `human-judgement` TR-12.3: 视觉评审：页面风格与整体一致
- **Notes**: 订阅消息模板ID暂时使用占位符，后续替换

## [x] Task 13: 云数据库初始化与Mock数据
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 在云数据库中创建以下集合：
    - heritages（史料表）：至少插入10条Mock数据，涵盖建筑、红色、宗教、AI修复分类
    - routes（路线表）：至少插入3条路线数据
    - points（点位表）：每个路线至少4个点位
    - favorites（收藏表）：用户收藏记录
    - checkins（打卡表）：用户打卡记录
    - users（用户表）：用户信息
  - 创建 utils/data.js 管理本地Mock数据（作为云数据的备选方案）
  - 创建 utils/db.js 封装云数据库操作（增删改查）
- **Acceptance Criteria Addressed**: 所有依赖数据的功能
- **Test Requirements**:
  - `programmatic` TR-13.1: 云数据库集合创建成功，可通过wx.cloud.database访问
  - `programmatic` TR-13.2: Mock数据文件存在，格式正确
  - `human-judgement` TR-13.3: 数据结构与PRD数据字典一致
- **Notes**: 如云开发环境暂不可用，所有功能降级使用本地Mock数据

## [x] Task 14: 云函数与订阅消息
- **Priority**: low
- **Depends On**: Task 12
- **Description**: 
  - 创建云函数 sendSubscribeMessage：处理订阅消息发送
  - 创建云函数 subscriptionScheduler：定时扫描待发送消息（参考wechat-subscription-guide）
  - 配置云函数config.json：openapi权限、定时触发器
  - 订阅消息模板参考：
    - 新史料上线通知：史料名称、分类、上线时间
    - 走街活动提醒：活动名称、时间、集合地点
    - 打卡成就通知：成就名称、解锁奖励
- **Acceptance Criteria Addressed**: FR-24, AC-14
- **Test Requirements**:
  - `programmatic` TR-14.1: 云函数创建并部署成功
  - `programmatic` TR-14.2: 调用云函数可正确触发订阅消息发送
  - `human-judgement` TR-14.3: 云函数代码结构参考wechat-subscription-guide规范
- **Notes**: 订阅消息模板ID需用户在微信公众平台申请后填入

## [x] Task 15: 整体联调与体验优化
- **Priority**: medium
- **Depends On**: Task 2-14
- **Description**: 
  - 完整走查所有功能流程：从首页→史料→详情→收藏；首页→走街→路线→点位→打卡；我的→登录→设置等
  - 页面间参数传递正确，返回逻辑正确
  - 空状态、错误状态、加载状态处理
  - 字体设置全局生效验证
  - 云开发降级处理（无云环境时使用Mock数据）
  - 检查小程序包大小，优化资源
- **Acceptance Criteria Addressed**: AC-1 ~ AC-15 全部
- **Test Requirements**:
  - `human-judgement` TR-15.1: 完整业务流程走查无阻断
  - `human-judgement` TR-15.2: 异常状态处理友好
  - `programmatic` TR-15.3: 主包大小不超过2MB
- **Notes**: 此任务为最后收尾，确保整体体验流畅
