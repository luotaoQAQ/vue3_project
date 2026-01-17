import pinia from '@/store'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
  // 全局自定义指令，实现按钮的权限
  app.directive('has', {
    mounted(element: any, binding: any) {
      // 代表使用这个自定义指令的DOM或组件挂载完毕时执行一次
      console.log(userStore.buttons)

      if (!userStore.buttons.includes(binding.value)) {
        // element.parentNode.removeChild(element)
        element.style.display = 'none'
      }
    },
  })
}
