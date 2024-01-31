<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BASE_API_GET } from './utils/api'
const allRestaurant = ref()

const getAllRestaurant = async () => {
  const data = await BASE_API_GET({ url: 'getAllRestaurant' })
  allRestaurant.value = data
}

onMounted(() => {
  getAllRestaurant()
})
</script>
<template>
  <div>
    <!-- {{ allRestaurant }} -->
  </div>
</template>
<style scoped></style>
