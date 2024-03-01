<template>
  <Table :rows="rows" :columnName="orderTableFields" v-if="ready"></Table>
</template>

<script setup>
import Table from "src/components/List/Table.vue";
import { orderTableFields } from "src/data/columnName"
import { fetchData } from "src/services/api"
import { onMounted, ref } from "vue";

const rows = ref([])
const originalRows = ref([])
const ready = ref(false)

// 获取数据
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/orders");
    originalRows.value = data.data;
    rows.value = [...originalRows.value];
  } catch (error) {
    console.error("请求失败:", error.code);
    rows.value = [];
    return false;
  } finally {
    ready.value = true;
  }
  return true;
};

onMounted(fetchDataAndSetRows)
</script>

<style></style>
