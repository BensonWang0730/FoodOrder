<script setup lang="ts">
import { BASE_API_GET } from '@/components/utils/api'
import OrderMenu from '@/components/OrderMenu.vue'
import OrderInput from '@/components/OrderInput.vue'
import VLoading from '@/components/utils/VLoading.vue'
import SelectRestaurant from '@/components/SelectRestaurant.vue'

import { onMounted, ref } from 'vue'

const restaurantInfo = ref()
const getRestaurantData = async (restaurantName: string = 'bendo') => {
  try {
    const data = await BASE_API_GET({ url: `getMenu&name=${restaurantName}` })
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
    <SelectRestaurant />
  </div>
</template>
