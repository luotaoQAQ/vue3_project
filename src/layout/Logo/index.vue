<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <span :class="{ fold: collapse }">{{ setting.title }}</span>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'

defineProps(['collapse'])
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
    white-space: nowrap; // 防止换行（就算显示时也别换行）
    overflow: hidden;
    opacity: 1;
    // 展开时：延迟 0.3s 再显示（等宽度动画结束）
    transition: opacity 0s;

    &.fold {
      opacity: 0;
    }
  }
}
</style>
