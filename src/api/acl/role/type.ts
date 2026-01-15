export interface responseData {
  code: number,
  message: string,
  ok: boolean
}

// 获取角色分页列表接口的ts类型
export interface roleData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark?: null
}

export interface rolePageListResponseData extends responseData {
  data: {
    records: roleData[],
    total: number,
    size: number,
    current: number,
    pages: number
  }
}

// 根据角色获取菜单接口的ts类型
export interface menuData {
  id: number,
  createTime: string,
  updateTime: string,
  pid: number,
  name: string,
  code: string,
  toCode: string,
  type: number,
  status: null,
  level: number,
  children?: menuList,
  select: boolean
}

export type menuList = menuData[]

export interface menuResponseData extends responseData {
  data: menuList
}