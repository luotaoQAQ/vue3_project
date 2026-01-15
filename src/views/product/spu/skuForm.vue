<template>
  <el-form label-width="100" :model="skuParams">
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="请输入价格" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="请输入重量" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline label-width="80">
          <el-form-item v-for="attr in attrArr" :key="attr.id" :label="attr.attrName">
            <!-- 收集到的数据保存到每个属性的对象上,不能只用一个变量保存,因为有多个下拉框 -->
            <el-select v-model="attr.attrIdAndValueId">
              <!-- 收集属性id和属性值id -->
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline label-width="80">
          <el-form-item v-for="attr in spuSaleAttrList" :key="attr.id" :label="attr.saleAttrName">
            <el-select v-model="attr.attrIdAndValueId">
              <!-- 收集属性id和属性值id -->
              <el-option v-for="attrValue in attr.spuSaleAttrValueList" :key="attrValue.id" :label="attrValue.saleAttrValueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="spuImageList" ref="tableRef">
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img :src="row.imgUrl" :alt="row.imgName" style="width: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column prop="prop" label="操作">
            <template #default="{ row }">
              <el-button type="warning" @click="setDefault(row)">设置默认</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" plain @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts' name="SkuForm">
import { reqAttr } from '@/api/product/attr';
import type { attrResponseData, attr } from '@/api/product/attr/type';
import { reqAddSku, reqSpuImageList, reqSpuSaleAttrList } from '@/api/product/spu';
import type { skuAttrValue, skuData, skuSaleAttrValue, spuImage, spuImageResponseData, spuSaleAttr, spuSaleAttrResponseData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const $emit = defineEmits(['changeScene'])

let attrArr = ref<attr[]>([])
let spuSaleAttrList = ref<spuSaleAttr[]>([])
let spuImageList = ref<spuImage[]>([])

// 收集sku参数
let skuParams = reactive<skuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: null,
  skuSaleAttrValueList: null,
  skuDefaultImg: ''
})

const tableRef = ref<any>()

// 初始化sku数据
async function initSkuData(c1Id: number, c2Id:number, spu:any){
  // 发三个请求
  const result1: attrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  const result2: spuSaleAttrResponseData = await reqSpuSaleAttrList(spu.id)
  const result3: spuImageResponseData = await reqSpuImageList(spu.id)
  
  attrArr.value = result1.data
  spuSaleAttrList.value = result2.data
  spuImageList.value = result3.data

  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
}
defineExpose({initSkuData})

// 设置默认图片按钮的回调
function setDefault(row: spuImage){
  // 表格第一列复选框选中,点击的时候先清空用户的选择,再让被点击那行的复选框勾选
  tableRef.value.clearSelection()
  tableRef.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存按钮的回调
async function save(){
  // 整理参数
  skuParams.skuAttrValueList = attrArr.value.reduce((acc: any, current: any) => {
    if(current.attrIdAndValueId){
      let [attrId, valueId] = current.attrIdAndValueId.split(':')
      acc.push({attrId,valueId} as skuAttrValue)
    }
    return acc
  }, [])

  skuParams.skuSaleAttrValueList = spuSaleAttrList.value.reduce((acc: any, current: any) => {
    if(current.attrIdAndValueId){
      let [saleAttrId, saleAttrValueId] = current.attrIdAndValueId.split(':')
      acc.push({saleAttrId,saleAttrValueId} as skuSaleAttrValue)
    }
    return acc
  }, [])

  // 发请求
  const result: any = await reqAddSku(skuParams)
  if(result.code === 200){
    ElMessage({type: 'success', message: '添加成功'})
    $emit('changeScene', 0)
  } else {
    ElMessage({type: 'error', message: '添加失败'})
  }
}

// 取消按钮的回调
function cancel(){
  $emit('changeScene', 0)
}
</script>

<style scoped lang="scss">
.el-select{
  width: 200px;
}
</style>