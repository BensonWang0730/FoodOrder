<script setup lang="ts">
import AutoInput from './utils/AutoInput.vue'
import { ref, watch } from 'vue'

interface PostOrderData<T> {
  user: string
  food: T[]
  price: T[]
  count: T[]
  total: number
  [key: string]: string | number | T[]
}

interface FoodsList {
  name: string
  price: number
}

const props = defineProps({
  foodsList: Array as () => FoodsList[][]
})

const userOrder = ref<PostOrderData<number | string>>({
  user: '',
  food: [''],
  price: [],
  count: [1],
  total: 0,
  note: ''
})

watch(
  () => [userOrder.value.food, userOrder.value.count],
  () => {
    let length = userOrder.value.food.length
    let total = 0
    for (let i = 0; i < length; i++) {
      const price = userOrder.value.price[i] as number
      const count = userOrder.value.count[i] as number
      total += price * count

      if (isNaN(total)) {
        return
      }
    }
    userOrder.value.total = total
  },
  { deep: true }
)

const setFood = (value: FoodsList, orderInputId: number) => {
  // 應該用 splice 的方式加入
  userOrder.value.food.splice(orderInputId, 1, value.name)
  userOrder.value.price.splice(orderInputId, 1, value.price)
}

const postOrder = async () => {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzPWbGrqxLvNw3Sg2FcP2DUorOHkwmx8KaI8N-6ZoXv-TJnkH_xL_vq1x2P-HnEJDPtjw/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(userOrder.value)
      }
    )
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

const addNewInputBox = () => {
  const index = userOrder.value.count.length - 1
  if (!userOrder.value.food[index]) {
    return
  }
  userOrder.value.count.push(1)
  userOrder.value.food.push('')

  // console.log(JSON.stringify(userOrder.value))
}
</script>
<template>
  <div class="py-8 px-2 flex flex-col gap-5">
    <div class="order-input">
      <label for="user">訂購人</label>
      <input type="text" id="user" name="user" v-model="userOrder.user" />
    </div>
    <div class="flex flex-row gap-4 -mb-4">
      <div class="order-input w-full">
        <label for="meal">餐點</label>
        <div v-for="(item, id) in userOrder.food" :key="id" class="mb-2">
          <AutoInput :foods-list="props.foodsList" @food-emit="setFood($event, id)" />
        </div>
      </div>
      <div class="order-input w-[20%]">
        <label for="count">數量</label>
        <div v-for="(item, id) in userOrder.count" :key="id" class="mb-2">
          <input
            type="text"
            id="count"
            name="count"
            class="w-full"
            v-model.number="userOrder.count[id]"
          />
        </div>
      </div>
    </div>
    <button
      class="rounded-lg p-1 text-lg bg-gray-200 hover:bg-gray-300 duration-200 font-mediuma"
      @click="addNewInputBox"
    >
      +
    </button>
    <div class="order-input">
      <label for="notes">備注</label>
      <input type="text" id="notes" name="notes" v-model="userOrder.note" />
    </div>
    <div class="flex gap-10 py-5 items-center justify-end">
      <div class="flex gap-5">
        <p>合計</p>
        <p>{{ userOrder.total }}</p>
        <p>元</p>
      </div>
      <button
        class="text-[#fff] bg-gray-800 hover:bg-black duration-200 px-4 rounded-lg py-2"
        @click="postOrder"
      >
        送出
      </button>
    </div>
  </div>
</template>
<style scoped>
.order-input {
  display: flex;
  flex-direction: column;
}
.order-input > label {
  padding-bottom: 8px;
}
</style>
