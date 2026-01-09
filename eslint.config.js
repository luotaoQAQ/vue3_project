// 扁平化配置 (ESLint v9+) 需要导入插件模块，而不是通过字符串引用
import js from "@eslint/js";                    // 替代原来的 'eslint:recommended'
import globals from "globals";                  // 提供环境变量，替代原来的 env 配置
import tseslint from "typescript-eslint";       // TypeScript ESLint 插件
import pluginVue from "eslint-plugin-vue";      // Vue.js ESLint 插件
import prettier from "eslint-config-prettier";  // Prettier 集成
import { defineConfig } from "eslint/config";   // 定义配置的辅助函数（提供类型提示）

// @see https://eslint.org/docs/rules/
export default defineConfig([
  // ========== 1. 基础JavaScript配置 ==========
  // 作用：应用基础ESLint推荐规则，并设置浏览器、Node等环境变量
  // 变化：env 配置被拆解，通过 globals 包按需导入全局变量
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],  // 匹配所有相关文件
    plugins: { js },                               // 注册基础JS插件
    extends: ["js/recommended"],                   // 替代原来的 'eslint:recommended'
    languageOptions: {
      globals: {
        ...globals.browser,  // 浏览器全局变量 (window, document等)，对应原 env.browser
        ...globals.es2021,   // ES2021全局变量，对应原 env.es2021
        ...globals.node,     // Node.js全局变量 (process, require等)，对应原 env.node
        ...globals.jest      // Jest测试全局变量 (describe, test等)，对应原 env.jest
      }
    },
    rules: {
      /* 
        eslint (https://eslint.org/docs/rules/)
        off 或 0 ==> 关闭规则
        warn 或 1 ==> 打开的规则作为警告，不影响代码执行
        error 或 2 ==> 规则作为一个错误，代码不能执行，界面报错
      */
      "no-var": "error",  // 要求使用 let 或 const 而不是 var
      "no-multiple-empty-lines": ["warn", { max: 1 }], // 不允许多个空行
      "no-unexpected-multiline": "error", // 禁止意外的多行语法
      "no-useless-escape": "off", // 禁止不必要的转义字符
      
      // 生产环境禁用 console 和 debugger
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    }
  },

  // ========== 2. TypeScript配置 ==========
  // 作用：为TypeScript文件提供类型检查和推荐规则
  // 变化：不再需要单独配置 parser，tseslint.configs.recommended 已包含解析器设置
  ...tseslint.configs.recommended,  // 替代原来的 'plugin:@typescript-eslint/recommended'
  {
    // TypeScript特定规则
    files: ["**/*.{ts,mts,cts}"],  // 仅针对TypeScript文件
    rules: {
      "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
      "@typescript-eslint/prefer-ts-expect-error": "error", // 推荐使用 @ts-expect-error 而非 @ts-ignore
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型
      "@typescript-eslint/no-non-null-assertion": "off", // 允许非空断言
      "@typescript-eslint/no-namespace": "off", // 允许使用命名空间
      "@typescript-eslint/semi": "off" // 不强制分号
    }
  },

  // ========== 3. Vue.js配置 ==========
  // 作用：为Vue单文件组件提供语法检查和推荐规则
  // 变化：使用 pluginVue.configs["flat/essential"] 替代原来的 'plugin:vue/vue3-essential'
  ...pluginVue.configs["flat/essential"],  // Vue 3基础规则
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off", // 允许单字组件名
      "vue/script-setup-uses-vars": "error", // 检测 <script setup> 中使用的变量
      "vue/no-mutating-props": "off", // 允许修改props（谨慎使用）
      "vue/attribute-hyphenation": "off" // 不强制属性使用连字符
    }
  },

  // ========== 4. Vue + TypeScript集成配置 ==========
  // 作用：确保Vue文件中的TypeScript代码能被正确解析
  // 变化：原来在 parserOptions.parser 中的配置现在需要显式指定
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,  // 指定Vue文件使用TypeScript解析器
        jsxPragma: "React",       // JSX相关配置
        ecmaFeatures: {
          jsx: true               // 启用JSX支持
        }
      },
      // 这里不再需要 ecmaVersion 和 sourceType，它们由基础配置继承
    }
  },

  // ========== 5. Prettier集成 ==========
  // 作用：解决ESLint与Prettier的规则冲突，确保代码格式化一致性
  // 变化：使用 eslint-config-prettier 的扁平化版本
  prettier,  // 替代原来的 'plugin:prettier/recommended'
  
  // ========== 6. 忽略文件配置 ==========
  // 作用：排除不需要检查的目录和文件
  {
    ignores: [
      "**/node_modules/**",  // 忽略依赖包
      "**/dist/**",          // 忽略构建输出
      "**/.git/**",          // 忽略Git目录
      "**/*.min.js",         // 忽略压缩文件
      "**/coverage/**"       // 忽略测试覆盖率报告
    ]
  }
]);