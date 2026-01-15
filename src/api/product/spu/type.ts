export interface responseData {
  code: number
  message: string
  ok: boolean
}

export interface spuData {
  id?: number
  spuName: string
  tmId: number | string
  description: string
  category3Id: number | string
  spuSaleAttrList: null | spuSaleAttr[]
  spuImageList: null | spuImage[]
}

export interface spuResponseData extends responseData {
  data: {
    records: spuData[]
    total: number
    size: number
    current: number
    searchCount: true
    pages: number
  }
}

// 所有品牌数据的ts类型
export interface spuTrademark {
  id: number
  tmName: string
  logoUrl: string
}

export interface allTrademarkResponseData extends responseData {
  data: spuTrademark[]
}

// Spu下图片数据的ts类型
export interface spuImage {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName: string
  imgUrl: string
}

export interface spuImageResponseData extends responseData {
  data: spuImage[]
}

// spu下销售属性列表ts类型
export interface spuSaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

export interface spuSaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValue[]

  isEdit?: boolean
  saleAttrValue?: string
  attrIdAndValueId?: string
}

export interface spuSaleAttrResponseData extends responseData {
  data: spuSaleAttr[]
}

// 全部销售属性ts类型
export interface allSaleAttr {
  id: number
  name: string
}

export interface allSaleAttrResponseData extends responseData {
  data: allSaleAttr[]
}

// 添加sku接口的ts类型
export interface skuData {
  category3Id: string | number
  spuId: string | number
  tmId: string | number
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList: null | skuAttrValue[]
  skuSaleAttrValueList: null | skuSaleAttrValue[]
  skuDefaultImg: string
}

export interface skuAttrValue {
  attrId: string | number
  valueId: string | number
}

export interface skuSaleAttrValue {
  saleAttrId: string | number
  saleAttrValueId: string | number
}

// 根据spuId获取sku列表接口的ts类型
export interface skuListBySpuIdResponseData extends responseData {
  data: skuData[]
}
