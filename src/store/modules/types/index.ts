// 定义小仓库数据state类型
import type { RouteRecordRaw } from 'vue-router'

export interface userState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}
