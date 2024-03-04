<template>
  <div class="header q-px-lg q-pt-lg">
    <InputField class="input" @searchEvent="searchEvent"></InputField>
    <q-btn class="header-btn refresh-btn" unelevated @click="updateTable">
      <span v-if="refreshed">更新</span>
      <q-icon v-else name="refresh" class="header-icon refreshing"></q-icon>
    </q-btn>
    <q-btn class="header-btn filter-btn" unelevated @click="dialog = true">
      <q-icon name="tune" class="header-icon"></q-icon>
      筛选
    </q-btn>
    <q-btn class="header-btn delete-btn" color="negative" unelevated :disable="deleteDisabled" @click="deleteItems">
      <q-icon name="delete_sweep" class="header-icon"></q-icon>
      删除
    </q-btn>
  </div>
  <Table :rows="rows" :columnName="columnName" v-if="ready" :closePromptBox="closePromptBox"
    @checkboxChangeInTable="checkboxChange" @deleteEvent="deleteItem" @closePromptBox="closePromptBox = false">
    <template v-slot:request_method="{ props }">
      <div class="status" :class="request_method.find(
      (item) => item.status === props.item.request_method
    ).color
      ">
        <span>{{ props.item.request_method }}</span>
      </div>
    </template>
  </Table>
</template>

<script setup>
import Table from "src/components/List/Table.vue";
import InputField from "src/components/Common/InputField.vue";
import { logTableFields } from "src/data/columnName"
import { onMounted, ref } from "vue";
import { deleteData, fetchData } from "src/services/api";
// import { showNotif } from 'src/utils/utils.js'
import { Encrypt, Decrypt } from "src/utils/secret";
import { request_method } from "src/data/statusColor";
import { debounce, throttle, useQuasar } from "quasar";
import { useRouter } from "vue-router";
import moment from "moment";

const rows = ref([])
const originalRows = ref([])
const ready = ref(false)
const refreshed = ref(true)
const $q = useQuasar();
const router = useRouter();
const dialog = ref(false);
const deleteDisabled = ref(true);
const selectedArr = ref([]);
const deleteEventConfirm = ref(false);
const closePromptBox = ref(false);
const tempID = ref(null);
const columnName = ref(logTableFields)

// 获取数据
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/logs");
    data.data.map((item) => {
      item.create_time = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss");
    });
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
 * 删除数据
 */
const deleteDataEvent = async (data) => {
  const result = await deleteData("/products", data);
  if (result) {
    fetchDataAndSetRows();
    showNotif("positive", "成功删除");
  } else {
    showNotif("warning", "删除失败");
  }
  deleteEventConfirm.value = false;
  closePromptBox.value = true;
};

/**
 * 选项框状态监听
 * @param {Array} arr - 被选中数据
 */
const checkboxChange = (arr) => {
  // 设置删除按钮状态
  deleteDisabled.value = arr.length ? false : true;
  selectedArr.value = arr;
};

// 创建数据副本用于筛选
const originalColumnNameValue = [...columnName.value];

/**
 * 监听子组件列名过滤
 * @param {Array} columns - 选中的列名
 */
const columnsChanged = (columns) => {
  columnName.value = originalColumnNameValue.filter(
    (item) => !columns.some((ele) => item.name === ele)
  );
};

/**
 * 监听数据字段过滤
 * @param {Array} data         - 选中的类别
 * @param {string} filterConditions - 需要筛选的字段
 */
const rowsChanged = (data, filterConditions) => {
  rows.value = data.length
    ? originalRows.value.filter((item) =>
      data.some((ele) => item[filterConditions] === ele)
    )
    : originalRows.value;
};

/**
 * 搜索数据
 * @param {string} keyword - 搜索关键字
 */
const searchEvent = (keyword) => {
  if (keyword === "") {
    rows.value = originalRows.value;
  } else {
    rows.value = originalRows.value.filter((item) =>
      item.product_name.includes(keyword)
    );
  }
};

/**
 * 删除多条数据
 */
const deleteItems = () => {
  deleteEventConfirm.value = true;
  tempID.value = null;
};

/**
 * 删除单条数据
 * @param {string} id
 */
const deleteItem = (id) => {
  deleteEventConfirm.value = true;
  tempID.value = id;
};

const deleteEvent = () => {
  if (tempID.value === null) {
    deleteDataEvent(selectedArr.value);
  } else {
    deleteDataEvent([tempID.value]);
  }
};

const handleEdit = (item) => {
  const ciphertext = Encrypt(item); //加密商品数据
  router.push(`/product/edit/${item.product_id}?p=${ciphertext}`);
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
onMounted(fetchDataAndSetRows)
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

.status {
  span {
    border-radius: 15px;
    padding: 5px 12px;
    font-weight: bold;
  }
}

.green span {
  background: var(--bg-green);
  color: var(--text-green);
}

.red span {
  background: var(--bg-grey);
  color: var(--text-grey);
}

.blue span {
  background: var(--bg-blue);
  color: var(--text-blue);
}
</style>
