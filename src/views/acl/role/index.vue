<template>
  <div>
    <el-card style="margin-bottom: 10px">
      <el-form inline class="form-flex">
        <el-form-item label="角色搜索">
          <el-input
            placeholder="请输入用户角色关键字"
            v-model="searchRoleName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="search"
            :disabled="!searchRoleName.trim()"
          >
            搜索
          </el-button>
          <el-button @click="settingStore.isRefresh = !settingStore.isRefresh">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-button type="primary" icon="Plus" @click="addRole">
        添加角色
      </el-button>

      <el-table border style="margin: 10px 0" :data="roleArr">
        <el-table-column
          type="index"
          label="#"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="User"
              size="small"
              @click="assignRole(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="warning"
              icon="Edit"
              size="small"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}吗?`"
              width="200"
              icon="Warning"
              @confirm="removeRole(row)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[10, 20, 30, 40]"
        size="small"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @change="getRoleList"
      ></el-pagination>

      <!-- 新增或修改角色 -->
      <el-dialog
        title="添加角色"
        v-model="dialogVisible"
        @close="clearDataAndValidation"
      >
        <el-form
          style="width: 80%"
          :model="roleParams"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              placeholder="请输入角色名称"
              v-model="roleParams.roleName"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" plain @click="cancelAddOrUpdateRole">
            取消
          </el-button>
          <el-button type="primary" @click="saveAddOrUpdateRole">
            确定
          </el-button>
        </template>
      </el-dialog>

      <!-- 分配权限 -->
      <el-drawer title="分配权限" v-model="drawer">
        <el-tree
          ref="treeRef"
          :data="menuArr"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedMenuIdArr"
          :props="defaultProps"
          default-expand-all
        ></el-tree>
        <template #footer>
          <el-button type="primary" plain @click="cancelAssignRole">
            取消
          </el-button>
          <el-button type="primary" @click="saveAssignRole">确定</el-button>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Role">
import {
  reqAddOrUpdateRole,
  reqAssignRolePermission,
  reqPermissionByRoleId,
  reqRemoveRole,
  reqRolePageList,
} from '@/api/acl/role'
import { onMounted, reactive, ref } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
import type { menuList, menuResponseData, roleData } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

const settingStore = useLayoutSettingStore()

let pageNo = ref<number>(1)
let limit = ref<number>(10)
let total = ref<number>(100)
// 获取用户搜索角色的关键字
let searchRoleName = ref<string>('')

let roleArr = ref<roleData[]>([])

// 控制新增或修改角色对话框显示与隐藏
let dialogVisible = ref<boolean>(false)

// 收集新增角色数据
let roleParams = reactive<roleData>({
  roleName: '',
  remark: null,
})

// 控制分配权限抽屉的显示与隐藏
let drawer = ref<boolean>(false)

// 存储用户权限的数据
let menuArr = ref<menuList>([])

// 准备一个数组用于存储勾选菜单节点的id
let checkedMenuIdArr = ref<number[]>([])

// 树形控件prop指定展示什么数据
let defaultProps = {
  children: 'children',
  label: 'name',
}

const treeRef = ref<any>()

const formRef = ref<any>()

// 校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: checkRoleName }],
}
function checkRoleName(rule: any, value: any, callback: any) {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色名称至少两位'))
  }
}

onMounted(() => {
  getRoleList()
})

async function getRoleList() {
  const result = await reqRolePageList(
    pageNo.value,
    limit.value,
    searchRoleName.value,
  )

  if (result.code === 200) {
    total.value = result.data.total
    roleArr.value = result.data.records
  }
}

// 搜索按钮的回调
function search() {
  getRoleList()
  searchRoleName.value = ''
}

// 添加角色按钮的回调
function addRole() {
  dialogVisible.value = true
}

// 分配权限按钮的回调
async function assignRole(row: roleData) {
  drawer.value = true
  Object.assign(roleParams, row)
  // 发请求并收集数据
  const result: menuResponseData = await reqPermissionByRoleId(row.id as number)
  if (result.code === 200) {
    menuArr.value = result.data

    checkedMenuIdArr.value = filterCheckedMenu(menuArr.value, [])
  }
}

function filterCheckedMenu(allData: menuList, initArr: number[]) {
  // 遍历level4菜单
  allData.forEach((item) => {
    if (item.children && item.children.length > 0) {
      // 说明还没到最底层
      filterCheckedMenu(item.children, initArr)
    } else {
      if (item.select) {
        initArr.push(item.id)
      }
    }
  })
  return initArr
}

// 更新角色按钮的回调
function updateRole(row: roleData) {
  dialogVisible.value = true
  Object.assign(roleParams, row)
}

// 删除角色按钮的回调
async function removeRole(row: roleData) {
  const result: any = await reqRemoveRole(row.id as number)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getRoleList()
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

// 对话框中取消按钮的回调
function cancelAddOrUpdateRole() {
  dialogVisible.value = false
}

// 对话框中确定按钮的回调
async function saveAddOrUpdateRole() {
  // 先通过校验规则
  await formRef.value.validate()

  const result: any = await reqAddOrUpdateRole(roleParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '修改成功' : '添加成功',
    })
    dialogVisible.value = false
    getRoleList()
  } else {
    ElMessage({
      type: 'error',
      message: roleParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 对话框关闭时触发的事件
function clearDataAndValidation() {
  // 清数据
  Object.assign(roleParams, { id: undefined, roleName: '', remark: null })
  // 清校验规则
  formRef.value.clearValidate('roleName')
}

// 分配权限里面取消按钮的回调
function cancelAssignRole() {
  drawer.value = false
}

// 分配权限里面确定按钮的回调
async function saveAssignRole() {
  // 先收集数据：角色id和勾选的菜单id数组
  const roleId = roleParams.id as number
  const permissionId = [
    ...treeRef.value.getHalfCheckedKeys(),
    ...treeRef.value.getCheckedKeys(),
  ]

  const result: any = await reqAssignRolePermission(roleId, permissionId)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: '分配权限成功' })
    drawer.value = false
    // 因为可能是修改的用户自己的权限(菜单列表可能会发送变化)，所以需要刷新
    location.reload()
  } else {
    ElMessage({ type: 'error', message: '分配权限失败' })
  }
}
</script>

<style scoped lang="scss">
.form-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: -10px;
}
</style>
