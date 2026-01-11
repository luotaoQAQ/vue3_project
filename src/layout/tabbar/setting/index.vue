<template>
  <el-button icon="Refresh" plain circle @click="refresh"></el-button>
  <el-button icon="FullScreen" plain circle @click="fullScreen"></el-button>
  <el-button icon="Setting" plain circle></el-button>
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
import { useRoute, useRouter } from 'vue-router'

const $router = useRouter()
const $route = useRoute()

const layoutSettingStore = useLayoutSettingStore()

const userStore = useUserStore()

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
