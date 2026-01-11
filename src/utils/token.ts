// 封装本地存储和读取token的方法
export const SET_TOKEN = function (token: string) {
  localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = function () {
  return localStorage.getItem('TOKEN')
}

export const REMOVE_TOKEN = function () {
  localStorage.removeItem('TOKEN')
}
