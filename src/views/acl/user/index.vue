<template>
  <div>
    <el-card style="margin-bottom: 10px;">
      <el-form inline class="flex-form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入用户名关键字" v-model="searchUserName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!searchUserName.trim()" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-popconfirm title="你确定要删除选中的用户吗?" width="200" icon="Warning" @confirm="batchRemoveUser">
        <template #reference>
          <el-button type="danger" :disabled="!batchRemoveUserArr.length">批量删除</el-button>
        </template>
      </el-popconfirm>
      

      <el-table @selection-change="selectChange" border style="margin: 10px 0;" :data="userArr">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="username" label="用户姓名" align="center"></el-table-column>
        <el-table-column prop="name" label="用户昵称" align="center"></el-table-column>
        <el-table-column prop="roleName" label="用户角色" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" sortable
          show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" sortable
          show-overflow-tooltip=""></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template #default="{ row }">
            <el-button type="primary" icon="User" size="small" @click="setRole(row)">分配角色</el-button>
            <el-button type="warning" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}吗?`" width="200" icon="Warning" @confirm="removeUser(row)">
              <template #reference>
                <el-button type="danger" icon="Delete" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]" size="small"
        :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @change="getUserList">
      </el-pagination>

      <!-- 添加或修改用户 -->
      <el-drawer v-model="drawer1" :title="userParams.id ? '修改用户' : '添加用户'" direction="rtl"
        @close="formRef.resetFields()">
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" plain @click="cancelAddOrUpdateUser">取消</el-button>
          <el-button type="primary" @click="saveAddOrUpdateUser">确定</el-button>
        </template>
      </el-drawer>

      <!-- 分配角色 -->
      <el-drawer title="分配角色用户" v-model="drawer2">
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
              <el-checkbox v-for="role in allRoles" :key="role.id" :value="role">
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" plain @click="cancelAssignRole">取消</el-button>
          <el-button type="primary" @click="saveAssignRole">确定</el-button>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="User">
import { reqAddOrUpdateUser, reqAssignRoles, reqBatchRemoveUser, reqRemoveUser, reqUserAndAllRoles, reqUserPageList } from '@/api/acl/user';
import type { assignedAndAllRolesResponseData, assignRoleData, roleData, userData, userPageListResponseData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import useUserStore from '@/store/modules/user';
import useLayoutSettingStore from '@/store/modules/setting';

const userStore = useUserStore()
const settingStore = useLayoutSettingStore()

let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)

let userArr = ref<userData[]>([])

// 控制添加或修改用户抽屉的显示与隐藏
let drawer1 = ref<boolean>(false)
// 控制分配角色抽屉显示与隐藏
let drawer2 = ref<boolean>(false)

// 收集用户的数据
let userParams = reactive<userData>({
  username: '',
  name: '',
  password: ''
})
// 收集用户修改前的用户名
let prevUsername = ref<string>('')

// 是否全选
let checkAll = ref<boolean>(false)
// 设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true)
// 存储全部角色的数组
let allRoles = ref<roleData[]>([])
// 已经勾选的角色的数组
let checkedRoles = ref<roleData[]>([])

// 批量删除用户的id数组
let batchRemoveUserArr = ref<number[]>([])

// 判断批量删除有没有用户自己的遍历
let isBatchRemoveSelf = ref<boolean>(false)

// 收集用户输入的用来搜索的关键字
let searchUserName = ref<string>('')

// 表单校验规则
const rules = {
  username: [{ required: true, trigger: 'blur', validator: checkUsername }],
  name: [{ required: true, trigger: 'blur', validator: checkName }],
  password: [{ required: true, trigger: 'blur', validator: checkPassword }],
}
const formRef = ref<any>()

onMounted(() => {
  getUserList()
})

async function getUserList() {
  const result: userPageListResponseData = await reqUserPageList(pageNo.value, limit.value, searchUserName.value)

  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 搜索按钮的回调
function search(){
  getUserList()
  // 情况搜索框
  searchUserName.value = ''
}

// 重置按钮的回调
function reset(){
  // 和tabbar里面的刷新按钮操作一样，main组件里面再监听这个数据
  settingStore.isRefresh = !settingStore.isRefresh
}

// 添加用户按钮的回调
function addUser() {
  // 清空之前保存的数据
  Object.assign(userParams, { id: undefined, username: '', name: '', password: '' })
  drawer1.value = true
}

// 分配角色按钮的回调
async function setRole(row: userData) {
  drawer2.value = true
  // 收集信息
  Object.assign(userParams, row)
  // 发请求获取用户已有角色和所有角色列表
  const result: assignedAndAllRolesResponseData = await reqUserAndAllRoles(row.id as number)
  if (result.code === 200) {
    allRoles.value = result.data.allRolesList
    checkedRoles.value = result.data.assignRoles
  }
}

// 更新用户按钮的回调
function updateUser(row: userData) {
  Object.assign(userParams, row)
  drawer1.value = true
  prevUsername.value = userParams.username
}

// 删除用户按钮的回调
async function removeUser(row: userData) {
  const result: any = await reqRemoveUser(row.id as number)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    // 如果删的是自己
    if(row.username === userStore.username){
      localStorage.removeItem('TOKEN')
      location.reload()
    } else {
      getUserList()
    }
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

// 表格复选框勾选时触发的事件
function selectChange(selected: any[]) {
  // 会把已勾选的对象形成的数组给你
  batchRemoveUserArr.value = selected.map(item => (item.id))
  console.log(selected);
  
  // 判断批量删除的有没有用户自己
  const arr = selected.filter(item => item.username === userStore.username)
  isBatchRemoveSelf.value = arr.length === 0 ? false : true
}

// 批量删除按钮的回调
async function batchRemoveUser() {
  const result: any = await reqBatchRemoveUser(batchRemoveUserArr.value)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: '批量删除成功' })
    if(isBatchRemoveSelf.value){
      localStorage.removeItem('TOKEN')
      location.reload()
    } else {
      getUserList()
    }
  } else {
    ElMessage({ type: 'error', message: '批量删除失败' })
  }
}

// 新增/更新用户——取消按钮的回调
function cancelAddOrUpdateUser() {
  drawer1.value = false
}

// 新增/更新用户——确定按钮的回调
async function saveAddOrUpdateUser() {
  // 先校验规则
  await formRef.value.validate()

  const result: any = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: userParams.id ? '修改成功' : '添加成功' })
    getUserList()
    drawer1.value = false
    /* 
        有一种特殊情况，用户修改的是自己，服务器会让旧token失效，那么用户需要重新登录，这里让浏览器自动刷新location.reload()
        但是这里后端并没有让旧token失效，所以我只能手动清掉本地保存的token
    */
    if (userStore.username === prevUsername.value) {
      localStorage.removeItem('TOKEN')
      location.reload()
    }
  } else {
    ElMessage({ type: 'error', message: userParams.id ? '修改失败' : '添加失败' })
  }
}

// 校验用户姓名的函数
function checkUsername(rule: any, value: any, callback: any) {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户姓名至少五位'))
  }
}

// 校验用户昵称的函数
function checkName(rule: any, value: any, callback: any) {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称至少五位'))
  }
}

// 校验密码的函数
function checkPassword(rule: any, value: any, callback: any) {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码至少六位'))
  }
}

// 全选复选框的change事件
function handleCheckAllChange(val: boolean) {
  checkedRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}

function handleCheckedRolesChange() {
  const flag = checkedRoles.value.length === allRoles.value.length
  checkAll.value = flag
  isIndeterminate.value = !flag
}

// 分配角色取消按钮的回调
function cancelAssignRole() {
  drawer2.value = false
}

// 分配角色确定按钮的回调
async function saveAssignRole() {
  // 收集分配角色的id
  const assignRoleParams: assignRoleData = {
    userId: userParams.id as number,
    roleIdList: checkedRoles.value.map(item => (item.id as number))
  }
  const result: any = await reqAssignRoles(assignRoleParams)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: '分配成功' })
    drawer2.value = false
    getUserList()
  } else {
    ElMessage({ type: 'error', message: '分配失败' })
  }
}
</script>

<style scoped lang="scss">
.flex-form {
  display: flex;
  justify-content: space-between;
  margin-bottom: -10px; /* 抵消表单底边距 */
}
</style>
