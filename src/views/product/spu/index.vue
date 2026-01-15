<template>
  <div>
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table :data="spuArr" border style="margin: 10px 0">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column label="SPU描述">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <!-- tooltip 内容 -->
                <template #content>
                  <div class="tooltip-content">
                    {{ row.description }}
                  </div>
                </template>
                <!-- 表格中显示的内容 -->
                <div class="multi-line-ellipsis">{{ row.description }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="SPU操作">
            <template #default="{ row }">
              <el-tooltip effect="dark" content="添加SKU" placement="top">
                <el-button
                  type="primary"
                  icon="Plus"
                  @click="addSku(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="修改SPU" placement="top">
                <el-button
                  type="warning"
                  icon="Edit"
                  @click="updateSpu(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看SKU列表" placement="top">
                <el-button
                  type="info"
                  icon="InfoFilled"
                  @click="viewSkuList(row.id)"
                ></el-button>
              </el-tooltip>
              <el-popconfirm
                :title="`你确定要删除 ${row.spuName} 吗?`"
                width="200"
                icon="Warning"
                @confirm="removeSpu(row.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :page-sizes="[3, 5, 7, 9]"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :background="true"
          size="small"
          :total="total"
          @change="getSpu"
        ></el-pagination>
      </div>

      <!-- 添加/修改SPU -->
      <div v-show="scene === 1">
        <SpuForm ref="spuFormRef" @changeScene="changeScene"></SpuForm>
      </div>

      <!-- 添加SKU -->
      <div v-show="scene === 2">
        <SkuForm ref="skuFormRef" @changeScene="changeScene"></SkuForm>
      </div>

      <!-- 查看sku列表对话框 -->
      <el-dialog title="SKU列表" v-model="dialogVisible">
        <el-table :data="skuList" border>
          <el-table-column prop="skuName" label="SKU名称"></el-table-column>
          <el-table-column prop="price" label="SKU价格"></el-table-column>
          <el-table-column prop="weight" label="SKU重量"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Spu">
import { onBeforeUnmount, ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqRemoveSpu, reqSkuListBySpuId, reqSpuList } from '@/api/product/spu'
import type {
  skuData,
  skuListBySpuIdResponseData,
  spuData,
} from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

let scene = ref<number>(0) // 0：表格，1：添加/修改SPU，2：添加SKU

let pageNo = ref<number>(1)

let limit = ref<number>(3)

let spuArr = ref<spuData[]>([])

let total = ref<number>(0)

let spuFormRef = ref<any>()
let skuFormRef = ref<any>()

// 存储sku列表数据
let skuList = ref<skuData[]>([])

// 控制sku列表对话框展示或隐藏的变量
let dialogVisible = ref<boolean>(false)

onBeforeUnmount(() => {
  categoryStore.$reset()
})

watch(
  () => categoryStore.c3Id,
  () => {
    spuArr.value = []
    if (!categoryStore.c3Id) return
    getSpu()
  },
)

async function getSpu() {
  const result = await reqSpuList(pageNo.value, limit.value, categoryStore.c3Id)

  if (result.code === 200) {
    spuArr.value = result.data.records
    total.value = result.data.total
  }
}

// 添加SPU按钮回调
function addSpu() {
  scene.value = 1
  spuFormRef.value.initSpuData()
}

// 添加SKU按钮回调
function addSku(row: spuData) {
  scene.value = 2
  const { c1Id, c2Id } = categoryStore
  skuFormRef.value.initSkuData(c1Id, c2Id, row)
}

// 修改SPU按钮回调
function updateSpu(row: spuData) {
  scene.value = 1
  // 把spuId发给子组件
  spuFormRef.value.initSpuData(row)
}

// 查看SKU列表按钮的回调
async function viewSkuList(id: number) {
  const result: skuListBySpuIdResponseData = await reqSkuListBySpuId(id)
  console.log(result)
  if (result.code === 200) {
    skuList.value = result.data
    // 对话框展示
    dialogVisible.value = true
  }
}

// 删除SPU按钮回调
async function removeSpu(id: number) {
  const result: any = await reqRemoveSpu(id)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getSpu()
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

// 给子组件绑定自定义事件，好让子组件修改父组件中的scene
function changeScene(val: number) {
  scene.value = val
  if (val == 0) {
    getSpu()
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
</style>
