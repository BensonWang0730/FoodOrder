<script setup lang="ts">
import OrderMenu from '@/components/OrderMenu.vue'
import OrderInput from '@/components/OrderInput.vue'
import { onMounted, ref } from 'vue'

// 'https://script.google.com/macros/s/AKfycbzF44xPPgodY3a_W38GyyccM5_ctzhGIc4e4-PKb28RMln_6o0xObHMTVFHyfqFG1gCSg/exec?method=getUserOrder`
const restaurantInfo = ref()
const getRestaurantData = async (restaurantName: string = 'bendo') => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzwR_5_iOZv80M7B5FnPYvFmS1UcMV5TeJeR5Kx5MZOk5Us8uaoP1MDvZ_EPZqEJptZMg/exec?method=getMenu&name=${restaurantName}`
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
  </div>
</template>
