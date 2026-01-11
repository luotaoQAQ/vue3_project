<template>
  <!-- 左侧菜单栏展开按钮 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="isCollapse ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="margin-right: 5px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="BreadCrumb">
import { ref } from 'vue'
import emitter from '@/utils/emitter'
import { useRoute } from 'vue-router'

const $route = useRoute()

// 控制菜单栏是否折叠
let isCollapse = ref(false)

function changeIcon() {
  isCollapse.value = !isCollapse.value
  emitter.emit('send-isCollapse', isCollapse.value)
}
</script>

<style scoped></style>
