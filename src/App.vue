<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container relative">
    <!-- <header class="flex gap-4 items-center justify-center p-2">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/all-orders">所有訂單</RouterLink>
    </header> -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
