import request from '@/utils/request'
import type {
  allSaleAttrResponseData,
  allTrademarkResponseData,
  skuData,
  skuListBySpuIdResponseData,
  spuData,
  spuImageResponseData,
  spuResponseData,
  spuSaleAttrResponseData,
} from './type'

const API = {
  GET_ALL_TRADEMARK_URL: '/admin/product/baseTrademark/getTrademarkList',
  GET_IMAGE_URL: '/admin/product/spuImageList/',
  GET_SALEATTR_URL: '/admin/product/spuSaleAttrList/',
  GET_ALL_SALEATTR_URL: '/admin/product/baseSaleAttrList',

  GET_SPU_URL: '/admin/product/',
  UPDATE_SPU_URL: '/admin/product/updateSpuInfo',
  ADD_SPU_URL: '/admin/product/saveSpuInfo',
  REMOVE_SPU_URL: '/admin/product/deleteSpu/',

  ADD_SKU_URL: '/admin/product/saveSkuInfo',
  GET_SKU_INFO_URL: '/admin/product/findBySpuId/',
}

// 获取SPU分页列表
export const reqSpuList = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, spuResponseData>(API.GET_SPU_URL + `${page}/${limit}`, {
    params: { category3Id },
  })

// 获取全部SPU品牌的数据
export const reqAllTrademark = () =>
  request.get<any, allTrademarkResponseData>(API.GET_ALL_TRADEMARK_URL)

// 获取商品图片列表接口
export const reqSpuImageList = (spuId: number) =>
  request.get<any, spuImageResponseData>(API.GET_IMAGE_URL + `${spuId}`)

// 获取商品销售属性列表接口
export const reqSpuSaleAttrList = (spuId: number) =>
  request.get<any, spuSaleAttrResponseData>(API.GET_SALEATTR_URL + `${spuId}`)

// 获取所有销售列表，最多三个
export const reqAllSaleAttr = () =>
  request.get<any, allSaleAttrResponseData>(API.GET_ALL_SALEATTR_URL)

// 新增/更新SPU接口
export const reqAddOrUpdateSpu = (data: spuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATE_SPU_URL, data)
  } else {
    return request.post<any, any>(API.ADD_SPU_URL, data)
  }
}

// 删除SPU接口
export const reqRemoveSpu = (spuId: number) =>
  request.delete<any, any>(API.REMOVE_SPU_URL + spuId)

// 新增SKU接口
export const reqAddSku = (data: skuData) =>
  request.post<any, any>(API.ADD_SKU_URL, data)

// 根据 SPU ID 查询 SKU 接口
export const reqSkuListBySpuId = (spuId: number) =>
  request.get<any, skuListBySpuIdResponseData>(API.GET_SKU_INFO_URL + spuId)
