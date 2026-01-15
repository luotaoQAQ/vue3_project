import request from "@/utils/request";
import type { skuDetailResponseData, skuPageListResponseData } from "./type";

const API = {
  GET_SKU_PAGELIST_URL: "/admin/product/list/",
  SKU_ONSALE_URL: "/admin/product/onSale/",
  SKU_CANCELSALE_URL: "/admin/product/cancelSale/",
  GET_SKU_DETAIL_URL: "/admin/product/getSkuInfo/",
  REMOVE_SKU_URL: "/admin/product/deleteSku/"
}

// 获取SKU分页列表
export const reqSkuPageList = (page: number, limit: number) => request<any, skuPageListResponseData>(API.GET_SKU_PAGELIST_URL+`${page}/${limit}`)


// 上架SKU接口
export const reqSkuOnSale = (skuId: number) => request.get<any, any>(API.SKU_ONSALE_URL+skuId)

// 下架SKU接口
export const reqSkuCancelSale = (skuId: number) => request.get<any, any>(API.SKU_CANCELSALE_URL+skuId)

// 获取SKU详情接口
export const reqSkuDetail = (skuId: number) => request.get<any, skuDetailResponseData>(API.GET_SKU_DETAIL_URL+skuId)

// 删除SKU接口
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.REMOVE_SKU_URL+skuId)