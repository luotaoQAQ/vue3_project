// 获取当前时间是早/中/晚?
export const getTime = function () {
  let message = ''
  let hours = new Date().getHours()
  if (hours >= 6 && hours <= 9) {
    message = '早上'
  } else if (hours <= 12) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
