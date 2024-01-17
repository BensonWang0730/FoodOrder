<script setup lang="ts">
import { computed } from 'vue'

interface RestaurantInfo {
  restaurantName: string
  menuImg: string
  openTime: string
  phone: string
}

const props = defineProps({
  restaurantInfo: {
    type: Array as () => RestaurantInfo[] // 這個是什麼東西
  }
})

const restaurantInfo = computed(() => {
  if (props.restaurantInfo) {
    return props.restaurantInfo[0]
  }
  return {} as RestaurantInfo
})
</script>
<template>
  <div class="pt-10">
    <h1 class="text-center pb-5">今日訂餐</h1>
    <div class="border-y py-4 border-accent">
      <img :src="restaurantInfo.menuImg" alt="" class="object-contain pb-2" />
      <div class="flex justify-between items-top">
        <h2>{{ restaurantInfo.restaurantName }}</h2>
        <div class="text-xs">
          <p>營業時間：{{ restaurantInfo.openTime }}</p>
          <p>電話：{{ restaurantInfo.phone }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
