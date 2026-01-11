// src/vite-env.d.ts 或 src/global.d.ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svg-icons/client" />

// 或者手动声明虚拟模块
declare module 'virtual:svg-icons-register' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

// 声明 svg 文件
declare module '*.svg' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

declare module '*.svg?component' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

declare module '*.svg?url' {
  const content: string
  export default content
}
