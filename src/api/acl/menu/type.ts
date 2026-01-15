export interface responseData {
  code: number
  message: string
  ok: boolean
}

// 获取菜单列表接口的ts类型
export interface permissionData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children?: permissionList
  select: boolean
}

export type permissionList = permissionData[]

export interface permissionResponseData extends responseData {
  data: permissionList
}

// 添加或修改菜单接口的ts类型
export interface permissionParams {
  id?: number
  code: string
  name: string
  level: number
  pid: number
}
