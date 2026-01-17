// 常量路由
export const constantRoute = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true, // 在菜单栏中是否隐藏
    },
  },
  {
    name: 'Layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
    meta: {
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        name: 'Home',
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
  {
    name: 'Screen',
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'Platform',
    },
  },
]

// 异步路由
export const asyncRoute = [
  {
    name: 'Acl',
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        name: 'User',
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        name: 'Role',
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        name: 'Permission',
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  {
    name: 'Product',
    path: '/product',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        name: 'Trademark',
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCart',
        },
      },
      {
        name: 'Attr',
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        name: 'Spu',
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'Grid',
        },
      },
      {
        name: 'Sku',
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
]

// 任意路由
export const anyRoute = [
  {
    name: 'Any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      title: '任意路由',
      hidden: true,
    },
  },
]
