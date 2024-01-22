<script setup lang="ts">
import draggable from 'vuedraggable'
import VLoading from '@/components/utils/VLoading.vue'
import { onMounted, ref } from 'vue'

const userOrderData = ref()

const getUserOrder = async () => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbwqbKz1YNJb7fD9natf39rBYXAp_9gS_F4xgEoJPmJxxRZkTxPuzXfgnJbCBOws-wQKBQ/exec?method=getUserOrder`
    )
    const data = await response.json()
    userOrderData.value = sortOrderData(data)
  } catch (error) {
    console.log(error)
  }
}

const sortOrderData = (data: []) => {
  const groupByData = data.reduce((group, order) => {
    const { userName } = order

    group[userName] = group[userName] ?? []
    group[userName].push(order)
    return group
  }, {})

  return Object.entries(groupByData)
}

onMounted(() => {
  getUserOrder()
})
</script>
<template>
  <div class="pt-10 overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="grid grid-cols-12">
          <th>訂購人</th>
          <th>餐點</th>
          <th>價格</th>
          <th>總金額</th>
          <th>已付</th>
          <th>找錢</th>
          <th>備註</th>
        </tr>
      </thead>
    </table>
    <draggable v-model="userOrderData" item-key="AllOrders" handle=".handle" -->
      >
      <template #item="{ element }">
        <tbody class="group">
          <tr class="grid grid-cols-12">
            <td class="flex items-center">
              <span
                class="material-symbols-outlined text-transparent group-hover:text-gray-400 group-hover:duration-300 -ml-4 handle cursor-pointer"
              >
                more_vert
              </span>
              {{ element[0] }}
            </td>
            <td>
              <ul v-for="order in element[1]" :key="order">
                <li>
                  {{ order.food }}
                </li>
              </ul>
            </td>
            <td>
              <ul v-for="order in element[1]" :key="order">
                <li>$ {{ order.price }}</li>
              </ul>
            </td>
            <td>$ {{ element[1][0].total }}</td>
            <td>$ {{ element[1][0].paid }}</td>
            <td>$ {{ element[1][0].makeChange }}</td>
            <td>{{ element[1][0].note }}</td>
          </tr>
        </tbody>
      </template>
    </draggable>
  </div>
  <!-- <div class="pt-10">
    <div
      v-for="(order, key) in userOrderData"
      :key="order"
      class="flex flex-col shadow-sm mb-2 p-5 border rounded-md"
    >
      <div>
        <div class="flex justify-between border-b pb-2">
          <p>{{ key }}</p>
          <p>Total：$ {{ order[0].total }}</p>
        </div>
        <ul v-for="list in order" :key="list" class="flex gap-2 py-2">
          <li>{{ list.food }}</li>
          <li>{{ list.price }}</li>
        </ul>
        <p v-show="order[0].note !== ''" class="border-t pt-2">備註：{{ order[0].note }}</p>
      </div>
    </div>
  </div> -->

  <VLoading :active="!userOrderData" />
</template>
<style scoped>
thead > tr > th {
  border: 1px solid whitesmoke;
  padding: 8px 0;
}

tr > td {
  border-bottom: 1px solid whitesmoke;
  padding: 12px;
}
</style>
