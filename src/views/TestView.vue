<script setup lang="ts">
import { ref } from 'vue'
const orderData = ref([200, 50, 300])
</script>
<template>
  <div class="py-10">
    $ {{ orderData }}
    <ul>
      <li v-for="(order, index) in orderData" :key="index">
        <input type="text" v-model="orderData[index]" />
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
