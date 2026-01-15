// 定义全部接口返回数据都有的数据类型
export interface responseData {
  code: number
  message: string
  ok: boolean
}

export interface tradeMark {
  createTime?: string
  id?: number
  logoUrl: string
  tmName: string
  updateTime?: string
}

export type Records = tradeMark[]

// 获取全部已有品牌的ts类型
export interface trademarkResponseData extends responseData {
  data: {
    current: number
    pages: number
    searchCount: boolean
    size: number
    total: number
    records: Records
  }
}
