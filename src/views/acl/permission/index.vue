<template>
  <div>
    <el-table :data="permissionArr" style="width: 100%;" row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="权限值"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" icon="Plus" size="small" :disabled="row.level === 4" @click="addPermission(row)">{{ row.level === 3 ? '添加功能' : '添加菜单' }}</el-button>
          <el-button type="warning" icon="Edit" size="small" :disabled="row.level === 1" @click="updatePermission(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}吗?`" width="200" icon="Warning" @confirm="removePermission(row.id)">
              <template #reference>
                <el-button type="danger" icon="Delete" size="small" :disabled="row.level === 1">删除</el-button>
              </template>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="permissionParams.id ? '修改菜单' : '添加菜单'" v-model="dialogVisible" @close="clearData">
      <el-form label-width="80" style="width: 80%;">
        <el-form-item label="菜单名称">
          <el-input placeholder="请输入菜单名称" v-model="permissionParams.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input placeholder="请输入权限值" v-model="permissionParams.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" plain @click="cancelAddOrUpdatePermission">取消</el-button>
        <el-button type="primary" @click="saveAddOrUpdatePermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Permission">
import { reqAddOrUpdatePermission, reqAllPermission, reqRemovePermission } from '@/api/acl/menu';
import type { permissionData, permissionList, permissionParams, permissionResponseData } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

let permissionArr = ref<permissionList>([])

// 控制添加或修改菜单对话框显示与隐藏
let dialogVisible = ref<boolean>(false)

// 收集添加或修改菜单的数据
let permissionParams = reactive<permissionParams>({
  code: '',
  name: '',
  level: 0,
  pid: 0
})

onMounted(() => {
  getPermissionList()
})

async function getPermissionList(){
  const result: permissionResponseData = await reqAllPermission()
  if(result.code === 200){
    permissionArr.value = result.data
  }
}

// 添加菜单按钮的回调
function addPermission(row: permissionData){
  dialogVisible.value = true
  // 存储要添加菜单的level
  permissionParams.level = row.level + 1
  // 给谁新增子菜单
  permissionParams.pid = row.id
}

// 修改菜单按钮的回调
function updatePermission(row: permissionData){
  Object.assign(permissionParams, row)
  dialogVisible.value = true
}

// 删除菜单按钮的回调
async function removePermission(id: number){
  const result: any = await reqRemovePermission(id)
  if(result.code === 200){
    ElMessage({type: 'success', message: '删除成功'})
    // 当删除已有菜单时页面需要刷新使左侧菜单栏重新展示
    // location.reload()
    getPermissionList()
  } else {
    ElMessage({type: 'error', message: '删除失败'})
  }
}

// 添加或修改菜单对话框取消按钮的回调
function cancelAddOrUpdatePermission(){
  dialogVisible.value = false
}

// 添加或修改菜单对话框确定按钮的回调
async function saveAddOrUpdatePermission(){
  const result: any = await reqAddOrUpdatePermission(permissionParams)
  if(result.code === 200){
    ElMessage({type: 'success', message: permissionParams.id ? '修改成功' : '添加成功'})
    dialogVisible.value = false
    getPermissionList()
  } else {
    ElMessage({type: 'error', message: permissionParams.id ? '修改失败' : '添加失败'})
  }
}

// 添加或修改菜单对话框关闭触发的事件
function clearData(){
  Object.assign(permissionParams, {id: undefined,code: '',name: '',level: 0,pid: 0})
}
</script>

<style scoped></style>
