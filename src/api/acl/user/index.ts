import request from '@/utils/request'
import type {
  assignedAndAllRolesResponseData,
  assignRoleData,
  userData,
  userPageListResponseData,
} from './type'

const API = {
  GET_USER_PAGELIST_URL: '/admin/acl/user/',
  ADD_USER_URL: '/admin/acl/user/save',
  UPDATE_USER_URL: '/admin/acl/user/update',
  GET_USER_ROLE_URL: '/admin/acl/user/toAssign/',
  ASSIGN_ROLE_URL: '/admin/acl/user/doAssignRole',
  REMOVE_USER_URL: '/admin/acl/user/remove/',
  REMOVE_BATCH_USER_URL: '/admin/acl/user/batchRemove',
}

// 获取用户分页列表
export const reqUserPageList = (
  page: number,
  limit: number,
  username: string,
) =>
  request.get<any, userPageListResponseData>(
    API.GET_USER_PAGELIST_URL + `${page}/${limit}`,
    { params: { username } },
  )

// 用户新增/更新接口
export const reqAddOrUpdateUser = (data: userData) => {
  if (data.id) {
    // 更新接口
    return request.put<any, any>(API.UPDATE_USER_URL, data)
  } else {
    return request.post<any, any>(API.ADD_USER_URL, data)
  }
}

// 请求用户已有角色和所有角色列表的接口
export const reqUserAndAllRoles = (userId: number) =>
  request.get<any, assignedAndAllRolesResponseData>(
    API.GET_USER_ROLE_URL + userId,
  )

// 为用户分配角色
export const reqAssignRoles = (data: assignRoleData) =>
  request.post<any, any>(API.ASSIGN_ROLE_URL, data)

// 单独删除用户接口
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.REMOVE_USER_URL + userId)

// 批量删除用户接口
export const reqBatchRemoveUser = (idList: number[]) =>
  request.delete<any, any>(API.REMOVE_BATCH_USER_URL, { data: idList })
