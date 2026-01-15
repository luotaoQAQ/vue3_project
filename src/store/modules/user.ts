import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
// import type { loginForm, loginResponseData } from "@/api/user/type";
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { userState } from './types'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由
import { constantRoute } from '@/router/routes'

let useUserStore = defineStore('User', {
  // 存储数据的地方
  state(): userState {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, // 生成菜单需要的路由
      username: '',
      avatar: '',
    }
  },
  // 处理异步/逻辑的地方
  actions: {
    // 真实接口
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // 成功获取到token
      const result: loginResponseData = await reqLogin(data)

      if (result.code === 200) {
        this.token = result.data as string
        // 本地存储
        SET_TOKEN(result.data as string)
        // 保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 获取用户信息的方法
    async userInfo() {
      // 存储用户信息
      const result: userInfoResponseData = await reqUserInfo()

      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()

      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // mock
    // 用户登录的方法
    /* async userLogin(data: loginForm){
      // 成功获取到token
      const result: loginResponseData = await reqLogin(data)
      if(result.code === 200){
        this.token = (result.data.token as string)
        // 本地存储
        SET_TOKEN((result.data.token as string))
        // 保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },

    // 获取用户信息的方法
    async userInfo(){
      // 存储用户信息
      const result = await reqUserInfo()
      if(result.code === 200){
        this.username = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },

    // 退出登录
    userLogout(){
      // 目前没有mock退出登录接口(通知服务器用户目前token失效)
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    } */
  },
  getters: {},
})

export default useUserStore
