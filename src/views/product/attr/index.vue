<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0;">
      <div v-show="scene===0">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true" @click="addAttr">添加平台属性</el-button>
        <el-table border style="width: 100%;margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="属性名称" width="200" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-tag type="primary" v-for="item in row.attrValueList" :key="item.id" style="margin: 5px;">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="warning" icon="Edit" @click="updateAttr(row)">修改</el-button>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗?`" width="200" icon="Warning" @confirm="removeAttr(row.id)">
                <template #reference>
                  <el-button type="danger" icon="Delete">删除</el-button>
                </template>
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene===1">
        <el-form :model="attrParams" inline>
            <el-form-item label="属性名称">
              <el-input v-model="attrParams.attrName" placeholder="请你输入属性名称"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" :disabled="!attrParams.attrName" @click="addAttrValue">添加属性值</el-button>
        <!-- <el-button type="primary" plain>取消</el-button> -->
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
            <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
            <el-table-column prop="prop" label="属性值名称">
              <template #default="{row, $index}">
                <el-input :ref="(vc: any) => elInputArr[$index] = vc" v-model="row.valueName" placeholder="请你输入属性值名称" v-if="row.isEdit" @blur="toLook(row, $index)"></el-input>
                <div v-else @dblclick="toEdit(row, $index)">{{ row.valueName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作">
              <template #default="{$index}">
                <el-button type="danger" icon="Delete" @click="removeAttrValue($index)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr" :disabled="!attrParams.attrValueList.length">保存</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Attr">
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '@/api/product/attr';
import type { attr, attrResponseData, attrValue } from '@/api/product/attr/type';
import useCategoryStore from '@/store/modules/category';
import { ElInput, ElMessage } from 'element-plus';
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';

const categoryStore = useCategoryStore()

let attrArr = ref<attr[]>([])

// 定义el-card组件内容切换变量，0展示表格，1展示添加属性内容
let scene = ref<number>(0)

// 准备一个数组用来存储对应的el-input组件实例
let elInputArr = ref<any>([])  

// 收集新增属性的数据
let attrParams = reactive<attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})

onBeforeUnmount(() => {
  // 销毁时清空数据，使用 $reset() 方法重置到初始状态
  categoryStore.$reset()
})

// 监听c3Id，如果有了就请求属性和属性值
watch(() => categoryStore.c3Id, () => {
  // 清空上一次查询的数据
  attrArr.value = []
  // c3Id变化就会触发监听事件，可能是c3Id变为空字符串导致的
  if (!categoryStore.c3Id) return
  getAttr()
})

async function getAttr() {
  const { c1Id, c2Id, c3Id } = categoryStore

  const result: attrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 新增属性按钮回调
function addAttr(){
  // 清空上一次收集的数据，并收集三级分类id
  Object.assign(attrParams, { id: undefined, attrName: '', attrValueList: [], categoryId: categoryStore.c3Id, categoryLevel: 3})
  scene.value = 1
}

// 修改已有属性按钮回调
function updateAttr(row: attr){
  scene.value = 1
  /* 
      Object.assign(attrParams, row)
      这里是浅拷贝，attrArr的row这一项和attrParams指向同一个对象，
      导致下面新增属性值时attrArr的row这一项随着attrParams变化而变化，
      即使点击的是取消按钮，表格中展示的属性值也发生了变化，但又因为没
      点击保存按钮发请求，所以刷新后变化的数据又变回去了
  */
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 删除已有属性按钮回调
async function removeAttr(attrId: number){
  const result = await reqRemoveAttr(attrId)

  if(result.code === 200){
    ElMessage({type: 'success', message: '删除成功'})
    getAttr()
  } else {
    ElMessage({type: 'error', message: '删除失败'})
  }
}

// 新增属性值按钮回调
function addAttrValue(){
  // isEdit编辑模式和查看模式切换变量
  attrParams.attrValueList.push({valueName: '', isEdit: true})
  // 自动聚焦
  nextTick(() => {
    elInputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 查看模式
function toLook(row: attrValue, index: number){
  // 必须要有文本内容，为空的话失去焦点后div没有内容撑开，就不能回到编辑模式
  if(row.valueName.trim() === ''){
    attrParams.attrValueList.splice(index, 1)
    ElMessage({type: 'error', message: '属性值不能为空'})
    return
  }

  // 属性值不能重复
  const repeat = attrParams.attrValueList.findIndex(item => {
    if(item != row){
      return item.valueName === row.valueName
    }
  })
  if(repeat !== -1){
    attrParams.attrValueList.splice(index, 1)
    ElMessage({type: 'error', message: '属性值不能重复'})
    return
  }
  row.isEdit = false
}

// 编辑模式
function toEdit(row: attrValue, index:number){
  row.isEdit = true
  // 自动聚焦
  nextTick(() => {
    elInputArr.value[index].focus()
  })
}

// 删除属性值按钮回调
function removeAttrValue(index: number){
  attrParams.attrValueList.splice(index, 1)
}

// 保存按钮回调
async function saveAttr(){
  const result: any = await reqAddOrUpdateAttr(attrParams)

  if(result.code === 200){
    ElMessage({type: 'success', message: attrParams.id ? '修改成功' : '添加成功'})
    scene.value = 0
    getAttr()
  } else {
    ElMessage({type: 'error', message: attrParams.id ? '修改失败' : '添加失败'})
  }
}

// 取消按钮回调
function cancel(){
  scene.value = 0
}
</script>

<style scoped></style>
