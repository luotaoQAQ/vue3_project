<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Screen">
import { onMounted, ref } from 'vue';
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
const screen = ref()

onMounted(() => {
  // 一挂载就缩放和拖拽一次
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h

  return ww < wh ? ww : wh
}

// 监听视口的变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) center center/cover no-repeat;

  .screen {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .left {
        flex: 1.2;
        height: 1040px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .tourist {
          flex: 1;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .right {
        flex: 1;
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
          margin-top: 40px;
        }

        .line {
          flex: 1;
          background-color: yellow;
        }
      }

    }
  }
}
</style>
