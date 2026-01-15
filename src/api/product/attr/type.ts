export interface responseData {
  code: number
  message: string
  ok: boolean
}

// 三级分类ts类型
export interface categoryAttr {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface categoryResponseData extends responseData {
  data: categoryAttr[]
}

// 属性与属性值的ts类型
export interface attrValue {
  id?: number
  valueName: string
  attrId?: number
  isEdit?: boolean
}

export interface attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: attrValue[]

  attrIdAndValueId?: string
}

export interface attrResponseData extends responseData {
  data: attr[]
}
