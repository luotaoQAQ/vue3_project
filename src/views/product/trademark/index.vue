<template>
  <div>
    <el-card>
      <el-button
        type="primary"
        icon="Plus"
        @click="addTrademark"
        v-has="'btn.Trademark.add'"
      >
        添加品牌
      </el-button>
      <!-- 表格 -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌logo">
          <template #default="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button type="warning" icon="Edit" @click="updateTrademark(row)">
              修改
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.tmName}吗?`"
              width="200"
              icon="Warning"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        size="small"
        :pager-count="9"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @change="getTrademark"
      />
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      @close="formRef.resetFields()"
    >
      <el-form
        ref="formRef"
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
      >
        <el-form-item label="品牌名称" label-width="100" prop="tmName">
          <el-input
            placeholder="请你输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100" prop="logoUrl">
          <!-- action指定上传请求的URL -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Trademark">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  reqAddOrUpdateTrademark,
  reqRemoveTrademark,
  reqTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  tradeMark,
  trademarkResponseData,
} from '@/api/product/trademark/type'
import { ElMessage, type UploadProps } from 'element-plus'
import useUserStore from '@/store/modules/user'

// 当前页
let pageNo = ref<number>(1)
// 每一页展示数据数量
let limit = ref<number>(3)
// 获取已有品牌总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 收集品牌信息
let trademarkParams = reactive<tradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取el-form组件实例
const formRef = ref()

// 这里上传图片是浏览器原生 XHR/Fetch 请求，不会经过我的 axios 拦截器，所以需要手动把token带上
const userStore = useUserStore()
const uploadHeaders = computed(() => ({
  token: userStore.token,
}))

onMounted(() => {
  getTrademark()
})

async function getTrademark() {
  const result: trademarkResponseData = await reqTrademark(
    pageNo.value,
    limit.value,
  )

  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 添加品牌按钮回调
function addTrademark() {
  // 清空之前收集的品牌信息
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0

  dialogFormVisible.value = true
}

// 修改品牌按钮回调
function updateTrademark(row: tradeMark) {
  Object.assign(trademarkParams, row)

  dialogFormVisible.value = true
}

// 删除品牌按钮回调
async function removeTrademark(id: number) {
  const result = await reqRemoveTrademark(id)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    if (trademarkArr.value.length <= 1 && pageNo.value >= 1) {
      pageNo.value -= 1
    }
    getTrademark()
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

function cancel() {
  dialogFormVisible.value = false
}

async function confirm() {
  // 在发请求前对表单进行校验
  await formRef.value.validate()

  const result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code === 200) {
    // 重新请求已有品牌
    getTrademark()
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改失败' : '添加失败',
    })
  }
  // 关闭对话框
  dialogFormVisible.value = false
}

// 图片上传之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传文件之前可以约束文件类型或大小
  // 要求文件格式png/jpg/gif <4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
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

// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (res, uploadFile) => {
  trademarkParams.logoUrl = res.data
  // 之前没上传图片可能会有表单检验的错误提示信息，上传图片后应该去掉
  formRef.value.clearValidate('logoUrl')
}

// 表单验证
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: checkTmName }],
  logoUrl: [{ required: true, validator: checkLogoUrl }],
}

function checkTmName(rule: any, value: any, callback: any) {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称不能小于两位'))
  }
}

function checkLogoUrl(rule: any, value: any, callback: any) {
  // 这里value是图片的地址
  if (value) {
    callback()
  } else {
    callback(new Error('请上传LOGO图片'))
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
