<template>
  <div class="tourist-container">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="reserve">可预约总量<span>99999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts' name="Tourist">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'
import 'echarts-liquidfill'

let people = ref('215908人')

let charts = ref()

onMounted(() => {
  let myCharts = echarts.init(charts.value)
  myCharts.setOption({
    title: {
      text: '水球图',
      left: 10
    },
    series: {
      type: 'liquidFill',
      data: [0.6, 0.4, 0.2],
      // waveAnimation: false,
      // animationDuration: 0,
      // animationDurationUpdate: 0
      radius: '80%',
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          // color: 'red',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0,0,0,.25)'
        }
      }
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  })
})
</script>

<style scoped lang="scss">
.tourist-container {
  background: url('../../images/dataScreen-main-lb.png') center center/cover no-repeat;
  margin-top: 15px;
  width: 80%;

  .top {
    margin-left: 20px;
    color: white;

    .title {
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url('../../images/dataScreen-title.png') center center/cover no-repeat;
      margin-top: 10px;
    }

    .reserve {
      float: right;
      font-size: 16px;
      margin-top: 10px;
      margin-right: 10px;

      span {
        color: orange;
        margin: 0 5px;
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px 50px;

    span {
      flex: 1;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background: url('../../images/total.png') center center/cover no-repeat;
      color: #29fcff;
      font-size: 25px;
    }
  }

  .charts {
    width: 100%;
    height: 240px;
  }
}
</style>
