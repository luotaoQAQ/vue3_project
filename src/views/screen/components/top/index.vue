<template>
  <div class="top">
    <div class="left">
      <span class="left-btn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据展示平台</div>
    </div>
    <div class="right">
      <span class="right-btn">统计报告</span>
      <span class="current-time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang='ts' name="Top">
import moment from 'moment';
import { onBeforeUnmount, onMounted,  ref } from 'vue';
import { useRouter } from 'vue-router'; 

const $router = useRouter()

let time = ref(moment().format('YYYY年MM月DD日 HH:MM:SS'))

let timer = ref(0)

function goHome(){
  $router.push('/home')
}

onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 HH:mm:ss')
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  display: flex;

  .left {
    flex: 1.5;
    background: url('../../images/dataScreen-header-left-bg.png') center center/cover no-repeat;

    .left-btn {
      width: 150px;
      line-height: 40px;
      float: right;
      background: url('../../images/dataScreen-header-btn-bg-l.png') center center/cover no-repeat;
      text-align: center;
      color: #29fcff;
      font-size: 20px;
    }
  }

  .right {
    flex: 1.5;
    background: url('../../images/dataScreen-header-right-bg.png');
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #29fcff;
    font-size: 20px;

    .right-btn {
      width: 150px;
      line-height: 40px;
      float: left;
      background: url('../../images/dataScreen-header-btn-bg-r.png') center center/cover no-repeat;
      text-align: center;
    }

    .current-time {
      margin-right: 10px;
    }
  }

  .center {
    flex: 2;

    .title {
      width: 100%;
      line-height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      color: #29fcff;
      font-size: 30px;
    }
  }
}
</style>