<template>
  <div class="map-container" ref="map"></div>
</template>

<script setup lang="ts" name="Map">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import chinaJSON from './china.json'

let map = ref()

echarts.registerMap('china', chinaJSON as any)

onMounted(() => {
  let myChart = echarts.init(map.value)
  myChart.setOption({
    geo: {
      map: 'china',
      roam: true, // 鼠标缩放效果
      zoom: 1.2,
      label: {
        show: true,
        color: 'white',
        fontSize: 14,
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 30,
          color: 'white',
        },
      },
    },
    series: [
      {
        type: 'lines', // 航线
        data: [
          {
            coords: [
              [116.4, 39.9], // 起点
              [119.3, 26.1], // 终点
            ],

            lineStyle: {
              color: 'black',
              width: 10,
            },
          },
        ],
        effect: {
          show: true,
          symbol: 'arrow',
          symbolSize: 20,
          color: 'red',
        },
      },
    ],
  })
})
</script>

<style scoped></style>
