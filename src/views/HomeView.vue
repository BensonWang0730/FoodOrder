<script setup lang="ts">
import OrderMenu from '@/components/OrderMenu.vue'
import OrderInput from '@/components/OrderInput.vue'
import VLoading from '@/components/utils/VLoading.vue'

import { onMounted, ref } from 'vue'

const restaurantInfo = ref()
const getRestaurantData = async (restaurantName: string = 'bendo') => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbx_KHLMm75t7LjNSLl0mD1-267TPtxxwLbI2AzFF7ZbqAJtDXn-Ib3KzJvLSAPpPvrFdQ/exec?method=getMenu&name=${restaurantName}`
    )
    const data = await response.json()
    restaurantInfo.value = data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getRestaurantData()
})
</script>

<template>
  <div class="max-w-[500px] mx-auto">
    <OrderMenu :restaurant-info="restaurantInfo" />
    <OrderInput :foods-list="restaurantInfo" />
    <VLoading :active="!restaurantInfo" />
  </div>
</template>
