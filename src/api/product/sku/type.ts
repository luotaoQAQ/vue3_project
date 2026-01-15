export interface responseData {
  code: number,
  message: string,
  ok: boolean
}

// 请求sku分页列表接口的ts类型
export interface skuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList: null | skuAttrValue[],
  skuSaleAttrValueList: null | skuSaleAttrValue[],
  skuImageList: null|skuImage[]
  skuDefaultImg: string,
  isSale?: number,
  id?: number
}

export interface skuAttrValue {
  attrId: string | number,
  valueId: string | number,
  valueName?: string,
  id?: number
}

export interface skuSaleAttrValue {
  saleAttrId: string | number,
  saleAttrValueId: string | number,
  saleAttrValueName?: string,
  id?: number
}

export interface skuImage {
  imgName: string,
  imgUrl: string,
  isDefault: number,
  id?: number
}

export interface skuPageListResponseData extends responseData {
  data: {
    records: skuData[],
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}

// 获取sku商品详情接口的ts类型
export interface skuDetailResponseData extends responseData {
  data: skuData
}