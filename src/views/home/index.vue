<template>
  <div>
    <el-card>
      <div class="card-flex">
        <img :src="userStore.avatar" alt="" class="avatar">
        <div>
          <h3 class="title">{{ getTime() }}好！{{ userStore.username }}</h3>
          <p class="sub-title">{{ setting.title }}</p>
        </div>
      </div>
    </el-card>

    <div class="bottom">
      <SvgIcon name="welcome" width="500px" height="500px"></SvgIcon>
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time';
import setting from '@/setting';
import { ref } from 'vue';

const userStore = useUserStore()

let drawer = ref<boolean>(false)
</script>

<style scoped lang="scss">
.card-flex {
  display: flex;
  align-items: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .sub-title {
    font-size: 14px;
    font-style: italic;
    color: rgb(110, 114, 109);
  }
}

.bottom {
  display: flex;
  justify-content: center;
}
</style>
