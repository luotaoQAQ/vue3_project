import request from '@/utils/request'
import type {
  menuResponseData,
  roleData,
  rolePageListResponseData,
} from './type'

const API = {
  GET_ROLE_PAGELIST_URL: '/admin/acl/role/',
  ADD_ROLE_URL: '/admin/acl/role/save',
  UPDATE_ROLE_URL: '/admin/acl/role/update',
  GET_PERMISSION_URL: '/admin/acl/permission/toAssign/',
  ASSIGN_PERMISSION_ROLE_URL: '/admin/acl/permission/doAssign',
  REMOVE_ROLE_URL: '/admin/acl/role/remove/',
}

// 获取角色分页列表
export const reqRolePageList = (
  page: number,
  limit: number,
  roleName: string,
) =>
  request.get<any, rolePageListResponseData>(
    API.GET_ROLE_PAGELIST_URL + `${page}/${limit}`,
    { params: { roleName } },
  )

// 新增/更新角色接口
export const reqAddOrUpdateRole = (data: roleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_ROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADD_ROLE_URL, data)
  }
}

// 根据角色获取菜单接口
export const reqPermissionByRoleId = (roleId: number) =>
  request.get<any, menuResponseData>(API.GET_PERMISSION_URL + roleId)

// 给角色分配权限
export const reqAssignRolePermission = (
  roleId: number,
  permissionId: number[],
) =>
  request.post<any, any>(API.ASSIGN_PERMISSION_ROLE_URL, undefined, {
    params: {
      roleId,
      permissionId: permissionId.join(','), // 先转换为逗号分隔的字符串
    },
  })

// 删除角色接口
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVE_ROLE_URL + roleId)
