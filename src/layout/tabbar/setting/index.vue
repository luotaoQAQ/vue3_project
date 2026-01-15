<template>
  <el-button icon="Refresh" plain circle @click="refresh"></el-button>
  <el-button icon="FullScreen" plain circle @click="fullScreen"></el-button>

  <el-popover placement="bottom" title="主题设置" width="300" trigger="click">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="changeColor" v-model="color" :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="isDark" inline-prompt active-icon="Moon" inactive-icon="Sunny" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button icon="Setting" plain circle></el-button>
    </template>
  </el-popover>

  <img :src="userStore.avatar" />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Setting">
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $router = useRouter()
const $route = useRoute()

const layoutSettingStore = useLayoutSettingStore()

const userStore = useUserStore()

const color = ref<string>('#ff4500')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#c7158577',
])

let isDark = ref<boolean>(false)

function refresh() {
  layoutSettingStore.isRefresh = !layoutSettingStore.isRefresh
}

function fullScreen() {
  // DOM对象的一个属性，用来判断当前是不是全屏模式，是返回DOM元素，不是返回null
  let full = document.fullscreenElement
  if (!full) {
    // 文档根节点的方法requestFullscreen实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// HEX转RGBA
const hexToRgba = (hex: string, alpha: number = 1) => {
  // 处理简写形式如 #fff
  const fullHex = hex.length === 4 
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex
    
  const r = parseInt(fullHex.slice(1, 3), 16)
  const g = parseInt(fullHex.slice(3, 5), 16)
  const b = parseInt(fullHex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function changeColor() {
  // 通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement

  const disabledColor = hexToRgba(color.value, 0.5)
  const hoveredColor = hexToRgba(color.value, 0.7)
  // 鼠标默认颜色
  html.style.setProperty('--el-color-primary', color.value)
  html.style.setProperty('--el-color-success', color.value)
  html.style.setProperty('--el-color-warning', color.value)
  html.style.setProperty('--el-color-danger', color.value)
  html.style.setProperty('--el-color-info', color.value)
  // 鼠标disabled颜色
  html.style.setProperty('--el-color-primary-light-5', disabledColor)
  html.style.setProperty('--el-color-success-light-5', disabledColor)
  html.style.setProperty('--el-color-warning-light-5', disabledColor)
  html.style.setProperty('--el-color-danger-light-5', disabledColor)
  html.style.setProperty('--el-color-info-light-5', disabledColor)
  // 鼠标hover颜色
  html.style.setProperty('--el-color-primary-light-3', hoveredColor)
  html.style.setProperty('--el-color-success-light-3', hoveredColor)
  html.style.setProperty('--el-color-warning-light-3', hoveredColor)
  html.style.setProperty('--el-color-danger-light-3', hoveredColor)
  html.style.setProperty('--el-color-info-light-3', hoveredColor)
  // 鼠标点击颜色
  html.style.setProperty('--el-color-primary-dark-2', color.value)
  html.style.setProperty('--el-color-success-dark-2', color.value)
  html.style.setProperty('--el-color-warning-dark-2', color.value)
  html.style.setProperty('--el-color-danger-dark-2', color.value)
  html.style.setProperty('--el-color-info-dark-2', color.value)
}

function changeDark(){
  // 获取html根节点
  const html = document.documentElement
  // 根据isDark判断
  isDark.value ? html.classList.add('dark') : html.classList.remove('dark')
  // isDark.value ? html.className = 'dark' : html.className = ''
}

async function logout() {
  // 1.向服务器发请求[退出登录接口]
  // 2.仓库中用户数据清空
  // 3.跳转到登录页面
  await userStore.userLogout()
  $router.push({
    path: '/login',
    query: {
      redirect: $route.path,
    },
  })
}
</script>

<style scoped lang="scss">
.el-icon--right {
  font-size: 10px;
}
</style>
