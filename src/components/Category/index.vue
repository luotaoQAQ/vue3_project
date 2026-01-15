<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene!==0" v-model="categoryStore.c1Id" placeholder="请选择" style="width: 240px;" @change="getC2">
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene!==0" v-model="categoryStore.c2Id" placeholder="请选择" style="width: 240px;" @change="getC3">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene!==0" v-model="categoryStore.c3Id" placeholder="请选择" style="width: 240px;">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts' name="Category">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category';

const categoryStore = useCategoryStore()

onMounted(() => {
  getC1()
})

defineProps(['scene'])

function getC1(){
  categoryStore.getC1List()
}

function getC2(){
  // 需要将二级和三级数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []

  categoryStore.getC2List()
}

function getC3(){
  categoryStore.c3Id = ''
  
  categoryStore.getC3List()
}
</script>

<style scoped></style>