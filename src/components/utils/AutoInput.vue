<script setup lang="ts">
import { onBeforeUnmount, onMounted, computed, ref, watch } from 'vue'

interface FoodsList {
  name: string
  price: number
}

const fullForm = ref<HTMLElement | null>(null)
const userFoodInput = ref()
const dropFoodList = ref()

// const foodInputStatus = ref(false)
const showAddPirceStatus = ref(false)
const addNewPrice = ref()

const emit = defineEmits(['foodEmit'])
const props = defineProps<{
  foodsList?: FoodsList[][]
  updateFood?: string
}>()

watch(
  () => props.updateFood,
  () => {
    userFoodInput.value = props.updateFood
  }
)

const foodsList = computed(() => {
  if (props.foodsList) {
    return props.foodsList[1].map((item: FoodsList, index: number) => {
      return { ...item, id: index }
    })
  }
  return []
})

const showAutoList = () => {
  let filterList = null
  dropFoodList.value = null
  showAddPirceStatus.value = false

  if (userFoodInput.value) {
    filterList = foodsList.value.filter((food) => {
      return food.name.toLowerCase().includes(userFoodInput.value.toLowerCase())
    })
    dropFoodList.value = filterList.length > 0 ? filterList : { name: userFoodInput.value }
  }

  if (filterList?.length === 0) {
    showAddPirceStatus.value = true
  }
}

const foodSelected = (id: number) => {
  if (!showAddPirceStatus.value) {
    userFoodInput.value = foodsList.value[id].name
    emit('foodEmit', foodsList.value[id])
    dropFoodList.value = null
  }

  if (addNewPrice.value) {
    let foodsList = {
      name: userFoodInput.value,
      price: addNewPrice.value
    }
    emit('foodEmit', foodsList)
    dropFoodList.value = null
    addNewPrice.value = null
  }
}

const showAllList = (() => {
  let status = false
  return () => {
    showAddPirceStatus.value = false

    status = !status
    status ? (dropFoodList.value = foodsList.value) : (dropFoodList.value = null)
  }
})()

const handleClickOutside = (event: any) => {
  let targetElement = event.target
  if (fullForm.value && !fullForm.value.contains(targetElement)) {
    dropFoodList.value = null
  }
}

onMounted(() => {
  document.body.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.body.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="relative">
    <!-- 不太了解為什麼是關閉 -->
    <form ref="fullForm" autocomplete="off" action="">
      <div class="relative">
        <!-- 因為注音輸入時 userFoodInput 沒有值，需要等到 Enter 才能控制顯示 -->
        <!-- <span
          v-show="!userFoodInput"
          class="material-symbols-outlined absolute top-0 bottom-0 flex items-center left-2 text-gray-400"
        >
          search
        </span> -->
        <input
          type="text"
          id="meal"
          placeholder=" type your order here ..."
          class="w-full"
          v-model="userFoodInput"
          @keyup="showAutoList"
        />
        <div
          class="absolute right-0 px-2 top-0 bottom-0 flex items-center cursor-pointer"
          @click="showAllList()"
        >
          <span class="material-symbols-outlined bg-white"> expand_more </span>
        </div>
      </div>
      <ul
        v-show="dropFoodList"
        class="absolute w-full z-10 shadow-lg bg-white h-max-[200px] overflow-y-auto flex-col border rounded-lg mt-1"
      >
        <li
          v-for="food in dropFoodList"
          :key="food.id"
          class="py-2 px-2 cursor-pointer flex flex-wrap items-center justify-between border-b last:border-b-0 hover:bg-gray-100 duration-200"
          @click="foodSelected(food.id)"
        >
          <p>
            {{ food.name || food }}
          </p>
          <p v-show="!showAddPirceStatus">＄{{ food.price }} 元</p>
          <div v-show="showAddPirceStatus">
            <input type="text" id="fill-price" class="mr-2 w-14 h-8" v-model.number="addNewPrice" />
            <label for="fill-price">元</label>
          </div>
        </li>
      </ul>
    </form>
  </div>
</template>
<style scoped></style>
