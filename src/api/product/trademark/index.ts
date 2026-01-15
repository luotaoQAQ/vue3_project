import request from "@/utils/request";
import type { tradeMark, trademarkResponseData } from "./type";

const API = {
  TRADEMARK_URL: "/admin/product/baseTrademark/",
  ADD_TRADEMARK_URL: "/admin/product/baseTrademark/save",
  UPDATE_TRADEMARK_URL: "/admin/product/baseTrademark/update",
  REMOVE_TRADEMARK_URL: "/admin/product/baseTrademark/remove/"
}

// 获取已有品牌的接口方法
export const reqTrademark = (page: number, limit: number) => request.get<any, trademarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)

// 添加或修改品牌接口
export const reqAddOrUpdateTrademark = (data: tradeMark) => {
  if(data.id){
    // 修改
    return request.put<any, any>(API.UPDATE_TRADEMARK_URL, data)
  } else {
    // 新增
    return request.post<any, any>(API.ADD_TRADEMARK_URL, data)
  }
}

// 删除品牌接口
export const reqRemoveTrademark = (id: number) => request.delete<any, any>(API.REMOVE_TRADEMARK_URL+id)