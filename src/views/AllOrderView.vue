<script setup lang="ts">
import draggable from 'vuedraggable'
import VLoading from '@/components/utils/VLoading.vue'
import { BASE_API_GET, BASE_API_POST } from '@/components/utils/api'
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/components/utils/debounce'

const userOrderData = ref()
const countFoodData = ref()
const totalMoneny = ref()

const getUserOrder = async () => {
  try {
    const data = await BASE_API_GET({ url: 'getUserOrder' })
    userOrderData.value = sortOrderData(data as [])
    countFoodData.value = countAllOrder(data as [])
  } catch (error) {
    console.log(error)
  }
}

const sortOrderData = (data: []) => {
  const groupByData = data.reduce(
    (group, order) => {
      const { userName } = order

      group[userName] = group[userName] ?? []
      group[userName].push(order)
      return group
    },
    {} as Record<string, []>
  )

  return Object.entries(groupByData)
}

const countAllOrder = (data: []) => {
  const uniqueUserName = new Set()
  let sum = 0

  const countData = data.reduce(
    (group, order) => {
      const { food, count, total, userName } = order

      group[food] = (group[food] || 0) + count
      if (!uniqueUserName.has(userName)) {
        uniqueUserName.add(userName)
        sum += total
      }
      return group
    },
    {} as Record<string, number>
  )

  const resultArray = Object.keys(countData).map((food) => ({
    food,
    count: countData[food]
  }))

  totalMoneny.value = sum

  return resultArray
}

const newUserOrderData = computed(() => {
  if (userOrderData.value) {
    return JSON.parse(JSON.stringify(userOrderData.value))
  }
  return []
})

watch(
  () => newUserOrderData.value,
  debounce((newValue, oldValue) => {
    if (!oldValue.length) return

    for (let i = 0; i < newUserOrderData.value.length; i++) {
      if (newValue[i]?.[1][0].paid !== oldValue[i]?.[1][0].paid) {
        const userName = newValue[i]?.[0]
        const paid = newValue[i]?.[1][0].paid

        const data = {
          user: userName,
          paid
        }
        console.log('Paid has changed:', userName, newValue[i]?.[1][0].paid)

        editUserOrder(data)
        // getUserOrder()  // 這樣會變 dead loop
      }
    }
  }, 500),
  { deep: true }
)

const editUserOrder = async (data: Object) => {
  try {
    await BASE_API_POST({ url: 'editUserPaid', data })
    getUserOrder()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getUserOrder()
})
</script>
<template>
  <div class="py-10">
    <h2 class="pb-5">所有訂單</h2>
    <div class="overflow-x-scroll hidden md:block">
      <table class="table-auto">
        <thead>
          <tr class="">
            <th>訂購人</th>
            <th>餐點</th>
            <th>備註</th>
            <th>價格</th>
            <th>總金額</th>
            <th>已付</th>
            <th>找錢</th>
          </tr>
        </thead>
      </table>
      <draggable v-model="userOrderData" item-key="AllOrders" handle=".handle">
        <template #item="{ element }">
          <tbody class="group">
            <tr>
              <td>
                <p class="flex">
                  <span
                    class="material-symbols-outlined text-transparent group-hover:text-gray-400 group-hover:duration-300 -ml-4 handle cursor-pointer"
                  >
                    more_vert
                  </span>
                  <span class="rounded-lg bg-gray-200 px-2">
                    {{ element[0] }}
                  </span>
                </p>
              </td>
              <td>
                <ul>
                  <li v-for="order in element[1]" :key="order">
                    {{ order.food }}
                  </li>
                </ul>
              </td>
              <td>{{ element[1][0].note }}</td>
              <td>
                <ul>
                  <li v-for="order in element[1]" :key="order">$ {{ order.price }}</li>
                </ul>
              </td>
              <td>$ {{ element[1][0].total }}</td>
              <td>
                <p
                  class="rounded-lg pl-2"
                  :class="{ 'bg-[#28a74664]': element[1][0].paid === element[1][0].total }"
                >
                  <span>$ </span>
                  <input type="text" v-model.number="element[1][0].paid" />
                </p>
              </td>
              <td>
                <p class="rounded-lg px-2" :class="{ 'bg-[#dc354667]': element[1][0].makeChange }">
                  <span>$ </span>{{ element[1][0].makeChange }}
                </p>
              </td>
            </tr>
          </tbody>
        </template>
      </draggable>
    </div>
  </div>
  <div class="py-10 px-8 flex flex-col gap-5">
    <div
      v-for="order in userOrderData"
      :key="order"
      class="flex flex-col shadow-sm p-5 border rounded-md md:hidden md:p-0"
    >
      <div class="flex justify-between border-b pb-2">
        <p class="rounded-lg bg-gray-200 px-2">{{ order[0] }}</p>
        <p>Total：$ {{ order[1][0].total }}</p>
      </div>
      <div class="flex justify-between items-start py-2">
        <ul class="flex flex-col gap-1">
          <li v-for="list in order[1]" :key="list" class="flex gap-2">
            <p>
              {{ list.food }}
            </p>
            <p>$ {{ list.price }}</p>
          </li>
        </ul>
        <div>
          <p>已付：${{ order[1][0].paid || 0 }}</p>
          <p v-show="order[1][0].paid">要找：${{ order[1][0].makeChange }}</p>
        </div>
      </div>
      <p v-show="order[1][0].note !== ''" class="border-t pt-2">備註：{{ order[1][0].note }}</p>
    </div>
    <div class="p-5 border-y md:w-[250px]">
      <ul class="flex flex-col items-end">
        <li
          v-for="order in countFoodData"
          :key="order"
          class="flex justify-between w-full border-b border-dashed py-1"
        >
          <p>{{ order.food }}</p>
          <p>
            {{ order.count }}
            份
          </p>
        </li>
      </ul>
      <p class="text-right pt-2 font-medium">合計：＄{{ totalMoneny }}</p>
    </div>
  </div>

  <VLoading :active="!userOrderData" />
</template>
<style scoped>
thead > tr > th {
  border-bottom: 1px solid rgb(215, 215, 215);
  border-right: 1px solid rgb(215, 215, 215);
  padding: 8px 0;
  min-width: 150px;
}

thead > tr > th:last-child {
  border-right: 0;
}

tr > td {
  border-bottom: 1px solid rgb(215, 215, 215);
  border-right: 1px solid rgb(215, 215, 215);
  padding: 12px;
  min-width: 150px;
}

tr > td:last-child {
  border-right: 0;
}

input {
  border: none;
  background: transparent;
  width: fit-content;
  max-width: 100px;
  height: fit-content;
  padding: 0;
  outline: none;
}
</style>
