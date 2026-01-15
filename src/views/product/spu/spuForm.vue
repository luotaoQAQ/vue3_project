<template>
  <el-form label-width="100" :model="spuParams">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>

    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择品牌" style="width: 200px;" v-model="spuParams.tmId">
        <el-option v-for="tm in allTradeMarkArr" :label="tm.tmName" :value="tm.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请输入SPU描述" v-model="spuParams.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU照片">
      <el-upload v-model:file-list="spuImageList" action="/api/admin/product/fileUpload" :headers="uploadHeaders"
        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
        :before-upload="handleUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <el-select style="width: 200px;" v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleAttr.length ? `还可选择${unSelectSaleAttr.length}个属性` : '暂无数据可选择'">
        <el-option v-for="attr in unSelectSaleAttr" :key="attr.id" :label="attr.name"
          :value="`${attr.id}:${attr.name}`"></el-option>
      </el-select>
      <el-button type="primary" icon="Plus" style="margin-left: 10px;" :disabled="!saleAttrIdAndValueName"
        @click="addSaleAttr">添加销售属性</el-button>
      <el-table border style="margin: 10px 0;" :data="spuSaleAttrList">
        <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="180"></el-table-column>
        <el-table-column label="属性值">
          <template #default="{ row }">
            <!-- 展示销售属性值 -->
            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" type="primary"
              style="margin-right: 10px;" closable @close="removeAttrValue(row, index)">
              {{ item.saleAttrValueName }}
            </el-tag>
            <!-- 添加销售属性值按钮 -->
            <el-button type="success" icon="Plus" size="small" v-if="!row.isEdit" @click="toEdit(row)"></el-button>
            <!-- 添加销售属性值输入框 -->
            <el-input v-model="row.saleAttrValue" size="small" style="width: 150px;" v-else
              @blur="toLook(row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ $index }">
            <el-button type="danger" icon="Delete" @click="spuSaleAttrList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save" :disabled="!spuSaleAttrList.length">保存</el-button>
      <el-button type="primary" plain @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts' name="SpuForm">
import { reqAddOrUpdateSpu, reqAllSaleAttr, reqAllTrademark, reqSpuImageList, reqSpuSaleAttrList } from '@/api/product/spu';
import type { allSaleAttr, allSaleAttrResponseData, allTrademarkResponseData, spuData, spuImageResponseData, spuSaleAttr, spuSaleAttrResponseData, spuSaleAttrValue, spuTrademark } from '@/api/product/spu/type';
import { ElMessage, type UploadUserFile } from 'element-plus'
import { computed, ref } from 'vue';
import useUserStore from '@/store/modules/user';
import useCategoryStore from '@/store/modules/category';

const categoryStore = useCategoryStore()

const $emit = defineEmits(['changeScene'])

// 这里上传图片是浏览器原生 XHR/Fetch 请求，不会经过我的 axios 拦截器，所以需要手动把token带上
const userStore = useUserStore()
const uploadHeaders = computed(() => ({
  token: userStore.token
}))

let allTradeMarkArr = ref<spuTrademark[]>([])
let spuImageList = ref<UploadUserFile[]>([])
let spuSaleAttrList = ref<spuSaleAttr[]>([])
let allSaleAttrArr = ref<allSaleAttr[]>([])
// 存储父组件传过来的不完整的spu
let spuParams = ref<spuData>({
  spuName: '',
  category3Id: '',
  tmId: '',
  description: '',
  spuImageList: null,
  spuSaleAttrList: null
})

// 将来收集还未选择的销售属性的id和name
let saleAttrIdAndValueName = ref<string>('')

// 控制照片墙预览对话框显示变量
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')

// 销售属性最多三个，新增销售属性等于全部-已有
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttrArr.value.filter(item => {
    return !spuSaleAttrList.value.some(ele => ele.saleAttrName === item.name)
  })
  return unSelectArr
})

// 添加销售属性按钮回调
function addSaleAttr() {
  const [baseSaleAttrId, saleAttrName = ''] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: spuSaleAttr = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: []
  }
  spuSaleAttrList.value.push(newSaleAttr)
  // 情况销售属性下拉框
  saleAttrIdAndValueName.value = ''
}

// 编辑模式
function toEdit(row: spuSaleAttr) {
  row.isEdit = true
  // 新增销售属性值的名称，要给每个对象都添加，如果只用一个变量，页面最多同时出现三个输入框，那三个输入框的值就只能同步
  row.saleAttrValue = ''
}

// 查看模式
function toLook(row: spuSaleAttr) {
  const { baseSaleAttrId, saleAttrValue = '' } = row
  let newSaleAttrValue: spuSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue
  }
  if (saleAttrValue.trim() === '') {
    ElMessage({ type: 'error', message: '属性值不能为空' })
    row.isEdit = false
    return
  }
  // 属性值不能重复
  let repeat = row.spuSaleAttrValueList.findIndex(item => item.saleAttrValueName === saleAttrValue)
  if (repeat !== -1) {
    ElMessage({ type: 'error', message: '属性值不能重复' })
    row.isEdit = false
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.isEdit = false
}

// el-tag删除按钮回调
function removeAttrValue(row: spuSaleAttr, index: number) {
  row.spuSaleAttrValueList.splice(index, 1)
}

// 保存按钮的回调
async function save() {
  // 整理照片墙数据
  spuParams.value.spuImageList = spuImageList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: item.response ? item.response.data : item.url
    }
  })
  // 整理销售属性数据
  spuParams.value.spuSaleAttrList = spuSaleAttrList.value
  // 发请求
  const result = await reqAddOrUpdateSpu(spuParams.value)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: spuParams.value.id ? '更新成功' : '添加成功' })
    // 切换场景
    $emit('changeScene', 0)
  } else {
    ElMessage({ type: 'error', message: spuParams.value.id ? '更新失败' : '添加失败' })
  }
}

// 取消按钮回调
function cancel() {
  $emit('changeScene', 0)
}

// 初始化spu数据
async function initSpuData(spu?: spuData) {
  resetSpuData()

  // 如果有spu传过来说明是修改
  if (spu) {
    // 发送四个请求
    const result1: allTrademarkResponseData = await reqAllTrademark()
    const result2: spuImageResponseData = await reqSpuImageList(spu.id as number)
    const result3: spuSaleAttrResponseData = await reqSpuSaleAttrList(spu.id as number)
    const result4: allSaleAttrResponseData = await reqAllSaleAttr()

    // 保存请求到的数据
    allTradeMarkArr.value = result1.data
    spuImageList.value = result2.data.map(item => {
      return {
        name: item.imgName,
        url: item.imgUrl
      }
    })
    spuSaleAttrList.value = result3.data
    allSaleAttrArr.value = result4.data
    // 保存父组件传过来的spu
    spuParams.value = spu
  } else {
    // 添加只用发两个请求
    const result1: allTrademarkResponseData = await reqAllTrademark()
    const result2: allSaleAttrResponseData = await reqAllSaleAttr()

    allTradeMarkArr.value = result1.data
    allSaleAttrArr.value = result2.data
    // 保存三级分类id
    spuParams.value.category3Id = categoryStore.c3Id
  }
}
defineExpose({ initSpuData })

// 重置数据
function resetSpuData(){
  // 清空之前收集到的数据
  Object.assign(spuParams.value, {id: undefined,spuName: '',category3Id: '',tmId: '',description: '',spuImageList: null,spuSaleAttrList: null})
  spuImageList.value = []
  spuSaleAttrList.value = []
  saleAttrIdAndValueName.value = ''
}

// 照片墙点击预览按钮时触发的钩子
function handlePictureCardPreview(uploadFile: any) {
  dialogVisible.value = true
  dialogImageUrl.value = uploadFile.url
}

// 照片墙点击删除按钮时触发的钩子
function handleRemove() {
  console.log(123);
}

function handleUpload(rawFile: any) {
  if (rawFile.type === 'image/png' || rawFile.type === 'image/jpeg' || rawFile.type === 'image/gif') {
    if (rawFile.size < 4 * 1024 * 1024) {
      return true
    } else {
      ElMessage({ type: 'error', message: '上传文件大小不能超过4M' })
      return false
    }
  } else {
    ElMessage({ type: 'error', message: '上传文件格式必须是png | jpg | gif' })
    return false
  }
}
</script>

<style scoped></style>
