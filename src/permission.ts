// 路由鉴权：项目中路由能不能被访问的权限设置(某一个路由什么条件下可以访问，什么条件下不能访问)
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user'
import pinia from './store'
import setting from './setting'

// 右上角加载圆圈去掉
NProgress.configure({ showSpinner: false })

/* 
  Uncaught Error: [🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
  必须先引入并使用pinia
*/
const userStore = useUserStore(pinia)

/* 
    全部路由：
      登录/404/任意路由/首页/数据大屏/权限管理：三个子路由/商品管理：四个子路由

    用户未登录：只能访问登录页面  
    登录成功：不能访问登录页面
*/

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 实现进度条nprogress
  NProgress.start()

  // 获取token判断用户登录与否
  const token = userStore.token
  const username = userStore.username
  if (token) {
    if (to.path === '/login') {
      next({ path: from.path })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期，获取不到信息了
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 后置守卫
router.afterEach((to) => {
  document.title = `${setting.title}-${to.meta.title}`
  NProgress.done()
})
