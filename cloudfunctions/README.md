# 云函数说明

## 云函数列表

### 1. sendSubscribeMessage

**功能**：发送微信订阅消息

**目录**：`cloudfunctions/sendSubscribeMessage/`

**调用参数**：
```javascript
{
  openid: '用户的openid',
  templateId: '订阅消息模板ID',
  page: '跳转页面（可选，默认 pages/index/index）',
  data: {
    // 模板字段数据，格式如：
    thing1: { value: '史料名称' },
    time2: { value: '2026年1月1日' }
  }
}
```

**返回值**：
```javascript
{ success: true, result: {...} }   // 成功
{ success: false, error: '错误信息' } // 失败
```

---

### 2. subscriptionScheduler

**功能**：定时扫描并发送订阅消息（每分钟触发一次）

**目录**：`cloudfunctions/subscriptionScheduler/`

**工作流程**：
1. 每分钟自动触发
2. 查询 `subscription_tasks` 集合中 `status='ACTIVE'` 且 `nextRemindTime <= 当前时间` 的任务
3. 对每个任务调用 `sendSubscribeMessage` 发送订阅消息
4. 更新 `sentCount` 和 `nextRemindTime`
5. 当 `sentCount >= maxCount` 时，将任务状态设为 `FINISH`

---

## 数据库集合配置

请在微信云开发控制台中创建集合：**`subscription_tasks`**

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | String | 任务ID（自动生成） |
| `_openid` | String | 用户的 openid |
| `status` | String | 任务状态：`ACTIVE`（进行中）/ `FINISH`（已结束） |
| `startTime` | String | 任务开始时间，格式：`YYYY-MM-DD HH:mm:ss` |
| `nextRemindTime` | String | 下一次提醒时间，格式：`YYYY-MM-DD HH:mm:ss` |
| `interval` | Number | 通知间隔，单位：秒 |
| `maxCount` | Number | 最大通知次数，`-1` 表示无限循环 |
| `sentCount` | Number | 已发送次数 |
| `templateId` | String | 订阅消息模板ID |
| `externargs` | Object | 模板字段数据（键值对，value 为 `{ value: 'xxx' }` 格式） |

### 数据示例

```json
{
  "_id": "task_id",
  "_openid": "user_openid",
  "status": "ACTIVE",
  "startTime": "2026-01-01 10:00:00",
  "nextRemindTime": "2026-01-01 10:00:00",
  "interval": 60,
  "maxCount": 5,
  "sentCount": 0,
  "templateId": "wechat_template_id",
  "externargs": {
    "thing1": {"value": "史料名称"},
    "time2": {"value": "2026年1月1日"}
  }
}
```

---

## 订阅消息模板配置

请在 [微信公众平台](https://mp.weixin.qq.com/) 申请以下三个订阅消息模板，并将获取到的模板ID替换代码中的占位符。

### 模板1：新史料上线通知

| 项目 | 内容 |
|------|------|
| 模板ID占位符 | `TEMPLATE_NEW_HERITAGE` |
| 适用场景 | 有新的非遗史料上线时通知用户 |

**模板字段**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `thing1` | 事物 | 史料名称 |
| `thing2` | 事物 | 分类 |
| `date3` | 日期 | 上线时间 |

**调用示例**：
```javascript
data: {
  thing1: { value: '南京云锦织造技艺' },
  thing2: { value: '传统技艺' },
  date3: { value: '2026年01月15日' }
}
```

---

### 模板2：走街活动提醒

| 项目 | 内容 |
|------|------|
| 模板ID占位符 | `TEMPLATE_STREET_ACTIVITY` |
| 适用场景 | 用户报名的走街活动开始前提醒 |

**模板字段**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `thing1` | 事物 | 活动名称 |
| `time2` | 时间 | 活动时间 |
| `thing3` | 事物 | 集合地点 |

**调用示例**：
```javascript
data: {
  thing1: { value: '老门东历史文化走街' },
  time2: { value: '2026年01月20日 14:00' },
  thing3: { value: '老门东牌坊下' }
}
```

---

### 模板3：打卡完成通知（已配置）

| 项目 | 内容 |
|------|------|
| 模板ID | `eaZCg6Wr7GwYZB9yNI36edxfCaOhUq2r_Pxp6tK0a3s` |
| 模板编号 | 18569 |
| 适用场景 | 用户完成打卡时通知 |

**模板字段**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `thing1` | 事物 | 用户 |
| `time5` | 时间 | 打卡时间 |
| `thing6` | 事物 | 打卡地点 |

**调用示例**：
```javascript
data: {
  thing1: { value: '历史文化探索者' },
  time5: { value: '2026年07月20日 18:00' },
  thing6: { value: '老舍纪念馆' }
}
```

---

## 部署步骤

### 1. 部署云函数

在微信开发者工具中：
1. 右键点击 `cloudfunctions/sendSubscribeMessage` 文件夹 → **上传并部署：云端安装依赖**
2. 右键点击 `cloudfunctions/subscriptionScheduler` 文件夹 → **上传并部署：云端安装依赖**

### 2. 上传触发器

部署 `subscriptionScheduler` 后，需要单独上传触发器配置：
- 右键点击 `cloudfunctions/subscriptionScheduler/config.json` → **上传触发器**

### 3. 创建数据库集合

在微信云开发控制台：
1. 进入 **数据库** 页面
2. 点击 **+** 新建集合
3. 集合名称输入：`subscription_tasks`

### 4. 配置订阅消息模板

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入 **订阅消息** 页面
3. 添加上述三个模板
4. 将获取到的模板ID替换代码中的占位符（`TEMPLATE_NEW_HERITAGE`、`TEMPLATE_STREET_ACTIVITY`、`TEMPLATE_ACHIEVEMENT`）

---

## 注意事项

1. **触发器配置**：修改 `config.json` 中的触发器配置后，必须手动右键上传触发器才能生效
2. **时间格式**：所有时间字段使用 `YYYY-MM-DD HH:mm:ss` 格式字符串
3. **无限循环**：`maxCount` 设为 `-1` 表示无限循环，需手动将 `status` 设为 `FINISH` 才能停止
4. **发送限制**：微信订阅消息每次授权只能发送一次，需要用户多次点击累积授权次数
5. **权限申请**：`wx.requestSubscribeMessage` 必须在用户点击事件中调用，不能在回调或生命周期中调用
