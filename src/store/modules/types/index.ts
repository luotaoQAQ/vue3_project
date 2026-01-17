import type { categoryAttr } from '@/api/product/attr/type'
import type { RouteRecordRaw } from 'vue-router'

// 定义user小仓库数据state类型
export interface userState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

// 定义category小仓库数据state类型
export interface categoryState {
  c1Id: number | string
  c2Id: number | string
  c3Id: number | string
  c1Arr: categoryAttr[]
  c2Arr: categoryAttr[]
  c3Arr: categoryAttr[]
}
