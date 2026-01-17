import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn, // 默认支持语言英语设置为中文
})

// svg插件需要配置代码
import 'virtual:svg-icons-register'

// 注册全局组件
import globalComponent from '@/components/index'
app.use(globalComponent)

// 引入模板的全局样式
import '@/styles/index.scss'

// 测试假的mock接口
/* import axios from 'axios';
axios({
    url: '/api/user/login',
    method: 'post',
    data: {
        username: 'admin',
        password: '111111'
    }
}) */

// 路由
import router from '@/router/index'
app.use(router)

// 仓库
import pinia from './store'
app.use(pinia)

// 路由鉴权
import './permission'

// 引入暗黑模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

// 引入自定义指令文件
import { isHasButton } from './directive/has'
isHasButton(app)

app.mount('#app')
