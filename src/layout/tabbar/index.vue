<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <BreadCrumb></BreadCrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tabbar">
import BreadCrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);

  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    :deep(img) {
      width: 32px;
      height: 32px;
      margin: 0 12px;
      border-radius: 50%;
    }
  }
}
</style>
