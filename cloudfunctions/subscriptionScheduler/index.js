const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

exports.main = async (event, context) => {
  const now = new Date()
  const nowStr = formatTime(now)

  try {
    const tasksResult = await db.collection('subscription_tasks')
      .where({
        status: 'ACTIVE',
        nextRemindTime: _.lte(nowStr)
      })
      .limit(30)
      .get()

    const tasks = tasksResult.data
    const results = []

    for (const task of tasks) {
      try {
        const sendResult = await cloud.callFunction({
          name: 'sendSubscribeMessage',
          data: {
            openid: task._openid,
            templateId: task.templateId,
            data: task.externargs
          }
        })

        if (sendResult.result && sendResult.result.success) {
          const newSentCount = task.sentCount + 1
          const nextRemindTime = new Date(now.getTime() + task.interval * 1000)
          const nextRemindTimeStr = formatTime(nextRemindTime)

          let updateData = {
            sentCount: newSentCount,
            nextRemindTime: nextRemindTimeStr
          }

          if (task.maxCount !== -1 && newSentCount >= task.maxCount) {
            updateData.status = 'FINISH'
          }

          await db.collection('subscription_tasks')
            .doc(task._id)
            .update({ data: updateData })

          results.push({
            taskId: task._id,
            success: true,
            sentCount: newSentCount,
            finished: updateData.status === 'FINISH'
          })
        } else {
          results.push({
            taskId: task._id,
            success: false,
            error: sendResult.result ? sendResult.result.error : 'Unknown error'
          })
        }
      } catch (taskErr) {
        results.push({
          taskId: task._id,
          success: false,
          error: taskErr.message
        })
      }
    }

    return {
      success: true,
      processedCount: tasks.length,
      results
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
}
