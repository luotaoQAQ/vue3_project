<template>
  <div>
    <h1>{{ userStore.username }}</h1>
  </div>
</template>

<script setup lang="ts" name="Home">
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
</script>

<style scoped></style>
