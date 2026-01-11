<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="login_form"
          :rules="rules"
          ref="loginFormRef"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="login_form.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              v-model="login_form.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="isLoading"
              type="primary"
              class="login_btn"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Login">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification, type FormRules } from 'element-plus'
import { getTime } from '@/utils/time'

// 获取el-form组件
const loginFormRef = ref()

// 定义变量控制按钮加载效果
let isLoading = ref(false)

const login_form = reactive({
  username: 'admin',
  password: '111111',
})

const userStore = useUserStore()

const $router = useRouter()
const $route = useRoute()

async function login() {
  // 发请求之前要保证所有字段校验通过
  await loginFormRef.value.validate()

  isLoading.value = true
  try {
    await userStore.userLogin(login_form)
    // 登录成功跳转
    const redirect: any = $route.query.redirect
    $router.push({
      path: redirect || '/',
    })

    isLoading.value = false
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
  } catch (error) {
    isLoading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 表单校验
const rules = reactive<FormRules>({
  username: [
    // { required: true, min: 5, message: '用户名长度至少五位', trigger: 'blur' }
    // 自定义校验规则
    { validator: checkUserName, trigger: 'blur' },
  ],
  password: [
    { required: true, min: 6, message: '密码长度至少六位', trigger: 'blur' },
  ],
})

/* 
    rule是校验规则对象，value是表单元素的文本内容，
    cb函数：如果校验通过直接调用cb放行即可
            如果不通过也调用cb，只不过要注入错误的提示信息
  */
function checkUserName(rule: any, value: any, callback: any) {
  if (/^\w{5,}$/.test(value)) {
    callback()
  } else {
    callback(new Error('用户名长度至少五位'))
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg'), no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png'), no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
