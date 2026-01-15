<template>
  <div>
    <el-card>
      <!-- 表格 -->
      <el-table border style="margin: 10px 0;" :data="skuArr">
        <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
        <el-table-column label="名称" width="300">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="tooltip-content">
                  {{ row.skuName }}
                </div>
              </template>
              <div class="multi-line-ellipsis">{{ row.skuName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="300">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="tooltip-content">
                  {{ row.skuDesc }}
                </div>
              </template>
              <div class="multi-line-ellipsis">{{ row.skuDesc }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="默认图片" width="250">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px;">
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(g)" width="250"></el-table-column>
        <el-table-column prop="price" label="价格(元)" width="250"></el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button :type="row.isSale ? 'success' : 'info'" :icon="row.isSale ? 'Top' : 'Bottom'"
              :title="row.isSale ? '下架' : '上架'" @click="toggleOnSale(row)"></el-button>
            <el-button type="primary" icon="Edit" title="更新SKU" @click="updateSku"></el-button>
            <el-button type="info" icon="InfoFilled" title="查看SKU详情" @click="viewSkuInfo(row.id)"></el-button>
            <el-popconfirm :title="`你确定要删除 ${row.skuName} 吗?`" width="200" icon="Warning" @confirm="removeSku(row.id)">
                <template #reference>
                  <el-button type="danger" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40, 50]"
        size="small" :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
        @change="getSku">
      </el-pagination>

      <!-- 查看sku详情右侧抽屉 -->
      <el-drawer v-model="drawer" title="查看商品详情" direction="rtl">
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuDetailInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuDetailInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuDetailInfo.price }}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag type="success" v-for="item in skuDetailInfo.skuAttrValueList" :key="item.id" style="margin: 0px 5px 5px 0px;">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag type="danger" v-for="item in skuDetailInfo.skuSaleAttrValueList" :key="item.id" style="margin: 0px 5px 5px 0px;">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuDetailInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" :alt="item.imgName" style="width: 100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Sku">
import { reqRemoveSku, reqSkuCancelSale, reqSkuDetail, reqSkuOnSale, reqSkuPageList } from '@/api/product/sku';
import type { skuPageListResponseData, skuData, skuDetailResponseData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

let pageNo = ref<number>(1)
let limit = ref<number>(10)
let total = ref<number>(0)

let skuArr = ref<skuData[]>([])

// 控制sku详情右侧抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 存储sku详情数据
let skuDetailInfo = ref<skuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: null,
  skuSaleAttrValueList: null,
  skuImageList: null,
  skuDefaultImg: ''
})

onMounted(() => {
  getSku()
})

async function getSku() {
  const result: skuPageListResponseData = await reqSkuPageList(pageNo.value, limit.value)

  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 切换上架/下架按钮的回调
async function toggleOnSale(row: skuData) {
  if (row.isSale) {
    // 当前是上架状态
    await reqSkuCancelSale(row.id as number)

    getSku()
    ElMessage({ type: 'success', message: '下架成功' })

  } else {
    await reqSkuOnSale(row.id as number)

    getSku()
    ElMessage({ type: 'success', message: '上架成功' })
  }
}

// 更新sku按钮的回调
function updateSku() {
  ElMessage({ type: 'success', message: '程序猿还在骑马来的路上' })
}

// 查看商品详情按钮的回调
async function viewSkuInfo(id: number) {
  const result: skuDetailResponseData = await reqSkuDetail(id)
  if(result.code === 200){
    skuDetailInfo.value = result.data
  }

  drawer.value = true
}

// 删除sku按钮的回调
async function removeSku(id: number) {
  const result = await reqRemoveSku(id)
  if(result.code === 200){
    ElMessage({type: 'success', message: '删除成功'})
    getSku()
  } else {
    ElMessage({type: 'error', message: '删除失败'})
  }
}
</script>

<style scoped lang="scss">
.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; // 显示 3 行
  line-clamp: 3;
  overflow: hidden;
  word-break: break-all;
  line-height: 20px;
  cursor: pointer;
}

.tooltip-content {
  max-width: 400px;
  white-space: normal;
  word-break: break-all;
  line-height: 20px;
}

.el-row {
  margin: 10px 0;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

:deep(.el-carousel__button){
  width: 20px;
}
</style>
