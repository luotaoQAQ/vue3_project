<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: isCollapse }">
      <Logo :collapse="isCollapse"></Logo>
      <el-scrollbar class="scrollbar">
        <el-menu
          background-color="#001529"
          text-color="white"
          active-text-color="#bfa"
          :default-active="$route.path"
          :collapse="isCollapse"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: isCollapse }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{ fold: isCollapse }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts" name="Layout">
import Logo from './Logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 获取路由对象
import { useRoute } from 'vue-router'

// 绑定emitter，让孙组件breadcrumb给爷组件layout传递isCollapse
import emitter from '@/utils/emitter'
import { onUnmounted, ref } from 'vue'

let isCollapse = ref(false)

emitter.on('send-isCollapse', (value) => {
  isCollapse.value = value as boolean
})

onUnmounted(() => {
  emitter.off('send-isCollapse')
})

const userStore = useUserStore()

const $route = useRoute()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    color: white;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width !important;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - $base-menu-min-width) !important;
      left: $base-menu-min-width !important;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - $base-menu-min-width) !important;
      left: $base-menu-min-width !important;
    }
  }
}
</style>
