<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container relative">
    <!-- <header class="flex gap-4 items-center justify-center p-2">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/all-orders">所有訂單</RouterLink>
    </header> -->
    <main class="absolute top-0 left-0 right-0">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
