// layout组件相关配置仓库
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('LayoutSettingStore', {
  state() {
    return {
      isRefresh: false,
    }
  },
})

export default useLayoutSettingStore
