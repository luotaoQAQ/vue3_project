<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts" name="Main">
import useLayoutSettingStore from '@/store/modules/setting'
import { nextTick, ref, watch } from 'vue'

const layoutSettingStore = useLayoutSettingStore()

let flag = ref(true)

// 监听仓库内部isRefresh是否发生变化
watch(
  () => layoutSettingStore.isRefresh,
  () => {
    // 组件需要销毁重新创建
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
