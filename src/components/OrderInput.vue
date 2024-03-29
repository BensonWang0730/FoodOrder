<script setup lang="ts">
import router from '@/router'
import AutoInput from './utils/AutoInput.vue'
import VLoading from './utils/VLoading.vue'
import { BASE_API_POST } from './utils/api'
import { ref, watch } from 'vue'

interface PostOrderData<T> {
  user: string
  food: T[]
  price: T[]
  count: T[]
  total: number
  date: string
  [key: string]: string | number | T[]
}

interface FoodsList {
  name: string
  price: number
}

const isLoading = ref(false)
const form = ref<HTMLFormElement | null>(null)
const props = defineProps({
  foodsList: Array as () => FoodsList[][]
})

const userOrder = ref<PostOrderData<number | string>>({
  user: '',
  food: [''],
  price: [],
  count: [1],
  total: 0,
  note: '',
  date: ''
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
  userOrder.value.food.splice(orderInputId, 1, value.name)
  userOrder.value.price.splice(orderInputId, 1, value.price)
}

const postOrder = async () => {
  try {
    isLoading.value = true
    // 直接加 excel 位置會錯亂
    // userOrder.value.date = new Date().toISOString()
    const data = await BASE_API_POST({ url: 'postUserOrder', data: userOrder.value })

    if (form.value) {
      ;(form.value as HTMLFormElement).reset()
    }
    if (data.status) {
      router.push({ path: '/all-orders' })
    }
  } catch (error) {
    console.log(error)
  }
  isLoading.value = false
}

const addNewInputBox = () => {
  const index = userOrder.value.count.length - 1
  if (!userOrder.value.food[index]) {
    return
  }
  userOrder.value.count.push(1)
  userOrder.value.food.push('')
}

const deleteInputBox = (id: number) => {
  userOrder.value.food.splice(id, 1)
  userOrder.value.price.splice(id, 1)
  userOrder.value.count.splice(id, 1)
}
</script>
<template>
  <form class="py-8 px-2 flex flex-col gap-5" id="form">
    <div class="order-input">
      <label for="user">訂購人</label>
      <input type="text" id="user" name="user" v-model="userOrder.user" />
    </div>
    <div class="flex flex-row gap-4 -mb-4">
      <div class="order-input w-full">
        <label for="meal">餐點</label>
        <div v-for="(item, id) in userOrder.food" :key="'item' + id" class="mb-2">
          <AutoInput
            :foods-list="props.foodsList"
            :update-food="item"
            @food-emit="setFood($event, id)"
          />
        </div>
      </div>
      <div class="order-input w-[30%]">
        <label for="count">數量</label>
        <div
          v-for="(item, id) in userOrder.food"
          :key="'item' + id"
          class="mb-2 flex items-center gap-3"
        >
          <input
            type="number"
            min="1"
            id="count"
            name="count"
            class="w-full"
            v-model.number="userOrder.count[id]"
          />
          <button
            v-show="userOrder.count.length > 1"
            @click.prevent="deleteInputBox(id)"
            class="flex items-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 duration-200"
          >
            <span class="material-symbols-outlined text-[16px]"> close </span>
          </button>
        </div>
      </div>
    </div>
    <button
      type="button"
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
        @click.prevent="postOrder"
      >
        送出
      </button>
    </div>
  </form>
  <VLoading :active="isLoading" />
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
