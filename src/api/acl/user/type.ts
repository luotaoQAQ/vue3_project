export interface responseData {
  code: number,
  message: string,
  ok: boolean
}

// 请求用户分页列表接口的ts类型
export interface userData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  username: string,
  password?: string,
  name: string,
  phone?: null,
  roleName?: string
}

export interface userPageListResponseData extends responseData {
  data: {
    records: userData[],
    total: number,
    size: number,
    current: number,
    pages: number
  }
}

// 请求用户已有角色和所有角色列表接口的ts类型
export interface roleData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark: null
}

export interface assignedAndAllRolesResponseData extends responseData {
  data: {
    assignRoles: roleData[],
    allRolesList: roleData[]
  }
}

// 给用户分配角色接口的ts类型
export interface assignRoleData {
  roleIdList: number[],
  userId: number
}
