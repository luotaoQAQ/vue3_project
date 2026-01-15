import request from "@/utils/request";
import type { attrResponseData, categoryResponseData, attr } from "./type";

const API = {
  CATEGORY1_URL: "/admin/product/getCategory1",
  CATEGORY2_URL: "/admin/product/getCategory2/",
  CATEGORY3_URL: "/admin/product/getCategory3/",
  ATTR_URL: "/admin/product/attrInfoList/",
  ADD_OR_UPDATE_ATTR_URL: "/admin/product/saveAttrInfo",
  REMOVE_ATTR_URL: "/admin/product/deleteAttr/"
}

// 获取一级分类接口
export const reqCategory1 = () => request.get<any, categoryResponseData>(API.CATEGORY1_URL)

// 二级分类
export const reqCategory2 = (category1Id: number|string) => request.get<any, categoryResponseData>(API.CATEGORY2_URL+category1Id)

// 三级分类
export const reqCategory3 = (category2Id: number|string) => request.get<any, categoryResponseData>(API.CATEGORY3_URL+category2Id)

// 获取分类下已有的属性与属性值接口
export const reqAttr = (category1Id: number|string, category2Id: number|string, category3Id: number|string) => request.get<any, attrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)

// 添加或者修改已有的属性的接口
export const reqAddOrUpdateAttr = (data: attr) => request.post<any, any>(API.ADD_OR_UPDATE_ATTR_URL, data)

// 删除基础属性接口
export const reqRemoveAttr = (attrId: number) => request.delete<any, any>(API.REMOVE_ATTR_URL+attrId)