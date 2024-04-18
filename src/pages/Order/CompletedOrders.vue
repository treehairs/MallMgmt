<template>
  <div class="header q-px-lg q-pt-lg">
    <InputField class="input" @searchEvent="searchEvent"></InputField>
    <q-btn class="header-btn refresh-btn" unelevated @click="updateTable">
      <span v-if="refreshed">更新</span>
      <q-icon v-else name="refresh" class="header-icon refreshing"></q-icon>
    </q-btn>
    <!-- <q-btn class="header-btn filter-btn" unelevated @click="dialog = true">
      <q-icon name="tune" class="header-icon"></q-icon>
      筛选
    </q-btn>
    <q-btn class="header-btn delete-btn" color="negative" unelevated :disable="deleteDisabled" @click="deleteItems">
      <q-icon name="delete_sweep" class="header-icon"></q-icon>
      删除
    </q-btn> -->
  </div>
  <Table
    :rows="rows"
    :columnName="columnName"
    v-if="ready"
    :closePromptBox="closePromptBox"
    @closePromptBox="closePromptBox = false"
  >
    <template v-slot:op="{ props }">
      <q-item clickable v-close-popup @click="handleEvent(props.item)">
        <q-item-section class="section">
          <q-item-label>完成订单</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </Table>
</template>

<script setup>
import Table from "src/components/List/Table.vue";
import InputField from "src/components/Common/InputField.vue";
import { orderTableFields } from "src/data/columnName";
import { onMounted, ref } from "vue";
import { deleteData, fetchData, updateData } from "src/services/api";
import { debounce, throttle, useQuasar } from "quasar";
import moment from "moment";

const rows = ref([]);
const originalRows = ref([]);
const ready = ref(false);
const refreshed = ref(true);
const $q = useQuasar();
const closePromptBox = ref(false);
const columnName = ref(orderTableFields);

// 获取数据
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/orders");
    data.data.map((item) => {
      item.created_at = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
      // item.payment_time = moment(item.payment_time).format("YYYY-MM-DD HH:mm:ss");
      // item.modify_time = moment(item.modify_time).format("YYYY-MM-DD HH:mm:ss");
    });
    data.data = data.data.filter((item) => item.order_status === "已完成");
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

/**
 * 更新数据
 */
const updateTable = async () => {
  if (!refreshed.value) return;
  debounce(updateTable, 5000);
  throttle(updateTable, 5000);
  refreshed.value = false;

  if (await fetchDataAndSetRows()) {
    showNotif("positive", "更新成功");
    refreshed.value = true;
  } else {
    showNotif("negative", "更新失败");
    refreshed.value = true;
  }
};

/**
 * 搜索数据
 * @param {string} keyword - 搜索关键字
 */
const searchEvent = (keyword) => {
  if (keyword === "") {
    rows.value = originalRows.value;
  } else {
    rows.value = originalRows.value.filter((item) => {
      let id = String(item.order_id);
      return id.includes(keyword);
    });
  }
};

const handleEvent = async (item) => {
  showNotif("positive", "订单已完成");
};

/**
 * 顶部通知F
 * @param {Type} type    - 图标
 * @param {string} message - 消息
 * @typedef {'positive' | 'negative' | 'warning' | 'info' | 'ongoing'} Type
 */
const showNotif = (type, message) => {
  const notif = $q.notify({
    type,
    message,
    position: "top",
  });
};
onMounted(fetchDataAndSetRows);
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 50px;
  min-width: 1000px;
  // position: relative;

  .input {
    margin-right: auto;
  }

  .header-btn {
    margin: 0 7px;
    border-radius: 8px;
    font-family: yuanti;
    letter-spacing: 1px;

    .header-icon {
      font-size: 20px;
      margin-right: 3px;
    }
  }

  .refreshing {
    animation: refreshing 1s infinite linear;
  }

  @keyframes refreshing {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
.section {
  color: #78829d;
  font-size: 13px;
  font-weight: bold;
}
</style>
