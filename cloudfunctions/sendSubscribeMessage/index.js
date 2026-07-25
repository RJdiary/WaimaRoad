const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      templateId: event.templateId,
      page: event.page || 'pages/index/index',
      data: event.data
    })
    return { success: true, result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
