import request from '@/utils/request'
// import type { loginForm, loginResponseData, userResponseData } from "./type";
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from './type'

const API = {
  LOGIN_URL: '/admin/acl/index/login',
  LOGOUT_URL: '/admin/acl/index/logout',
  USER_INFO_URL: '/admin/acl/index/info',
}

// 登录接口方法
// mock
// export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>('/user/login', data)

// 真实接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息
// mock
// export const reqUserInfo = () => request.get<any, userResponseData>('/user/info')

// 真实接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USER_INFO_URL)

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
