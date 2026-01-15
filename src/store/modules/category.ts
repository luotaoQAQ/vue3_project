import { defineStore } from 'pinia'
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product/attr'
import type { categoryResponseData } from '@/api/product/attr/type'
import type { categoryState } from './types'

let useCategoryStore = defineStore('CategoryStore', {
  state(): categoryState {
    return {
      c1Arr: [],
      c2Arr: [],
      c3Arr: [],
      c1Id: '',
      c2Id: '',
      c3Id: '',
    }
  },
  actions: {
    async getC1List() {
      const result: categoryResponseData = await reqCategory1()

      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },

    async getC2List() {
      const result: categoryResponseData = await reqCategory2(this.c1Id)

      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },

    async getC3List() {
      const result: categoryResponseData = await reqCategory3(this.c2Id)

      if (result.code === 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
