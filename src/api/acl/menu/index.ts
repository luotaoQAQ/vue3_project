import request from "@/utils/request";
import type { permissionParams, permissionResponseData } from "./type";

const API = {
  GET_PERMISSION_URL: "/admin/acl/permission",
  ADD_PERMISSION_URL: "/admin/acl/permission/save",
  UPDATE_PERMISSION_URL: "/admin/acl/permission/update",
  REMOVE_PERMISSION_URL: "/admin/acl/permission/remove/"
}

// 获取菜单列表
export const reqAllPermission = () => request.get<any, permissionResponseData>(API.GET_PERMISSION_URL)

// 新增/更新菜单接口
export const reqAddOrUpdatePermission = (data: permissionParams) => {
  if(data.id){
    return request.put<any, any>(API.UPDATE_PERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADD_PERMISSION_URL, data)
  }
}

// 删除菜单接口
export const reqRemovePermission = (permissionId: number) => request.delete<any, any>(API.REMOVE_PERMISSION_URL+permissionId)