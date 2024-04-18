<template>
  <div class="container">
    <div class="header q-px-lg q-pt-lg">
      <InputField class="input" @searchEvent="searchEvent"></InputField>
      <q-btn class="header-btn refresh-btn" unelevated @click="updateTable">
        <span v-if="refreshed">更新</span>
        <q-icon v-else name="refresh" class="header-icon refreshing"></q-icon>
      </q-btn>
      <q-btn
        class="header-btn delete-btn"
        color="negative"
        unelevated
        :disable="deleteDisabled"
        @click="deleteItems"
      >
        <q-icon name="delete_sweep" class="header-icon"></q-icon>
        删除
      </q-btn>
    </div>

    <Table
      :rows="rows"
      :columnName="columnName"
      :closePromptBox="closePromptBox"
      v-if="productsReady"
      @checkboxChangeInTable="checkboxChange"
      @closePromptBox="closePromptBox = false"
    >
      <template v-slot:category_id="{ props }">
        <div class="category_id">
          <span>{{ props.item.category_id }}</span>
        </div>
      </template>
      <template v-slot:category_name="{ props }">
        <div class="category_name">
          <span>{{ props.item.category_name }}</span>
        </div>
      </template>
      <template v-slot:product_count="{ props }">
        <div class="product_count">
          <span>{{ props.item.product_count }}</span>
        </div>
      </template>
      <template v-slot:op="{ props }">
        <q-item
          clickable
          v-close-popup
          @click="handleEdit(props.item.category_id)"
        >
          <q-item-section class="section">
            <q-item-label>修改</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          @click="deleteItem(props.item.category_id)"
        >
          <q-item-section class="section">
            <q-item-label>删除</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </Table>

    <div v-else class="relative-position loading">
      <q-inner-loading showing
        ><q-spinner-facebook color="primary" size="30px"
      /></q-inner-loading>
    </div>

    <!-- 数据删除提示框 -->
    <q-dialog v-model="deleteEventConfirm">
      <PromptBox
        @deleteEvent="deleteEvent"
        @cancel="deleteEventConfirm = false"
      ></PromptBox>
    </q-dialog>
  </div>
</template>

<script setup>
import Table from "src/components/List/Table.vue";
import InputField from "src/components/Common/InputField.vue";
import PromptBox from "src/components/Common/Form/PromptBox.vue";
import { fetchData } from "src/services/api";
import { deleteData } from "src/services/api";
// import { showNotif } from 'src/utils/utils.js'
import { computed, onMounted, reactive, ref, watch } from "vue";
import { debounce, throttle, useQuasar } from "quasar";
import { logger } from "src/utils/utils";

const $q = useQuasar();
const rows = ref([]);
const productsReady = ref(false);
const deleteDisabled = ref(true);
const originalRows = ref([]);
const selectedArr = ref([]);
const deleteEventConfirm = ref(false);
const closePromptBox = ref(false);
const refreshed = ref(true);
const tempID = ref(null);
const columnName = ref([
  {
    name: "编号",
    class: "category_id",
    unsorted: true,
    primary_key: true,
  },
  {
    name: "类名",
    class: "category_name",
  },
  {
    name: "商品数",
    class: "product_count",
  },
]);

/**
 * 获取数据
 */
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/categories");
    originalRows.value = data.data;
    rows.value = [...originalRows.value];
  } catch (error) {
    console.log(error);
    console.error("请求失败:", error.code);
    rows.value = [];
    return false;
  } finally {
    productsReady.value = true;
  }
  productsReady.value = true;
  return true;
};

/**
 * 删除数据
 */
const deleteDataEvent = async (data) => {
  console.log(data);
  const result = await deleteData("/categories", data);
  if (result) {
    fetchDataAndSetRows();
    showNotif("positive", "成功删除");
    logger("分类模块", "删除", "删除分类", "DELETE");
  } else {
    showNotif("warning", "删除失败");
  }
  deleteEventConfirm.value = false;
  closePromptBox.value = true;
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
 * 选项框状态监听
 * @param {Array} arr - 被选中数据
 */
const checkboxChange = (arr) => {
  // 设置删除按钮状态
  deleteDisabled.value = arr.length ? false : true;
  selectedArr.value = arr;
  console.log(arr);
};

/**
 * 搜索数据
 * @param {string} keyword - 搜索关键字
 */
const searchEvent = (keyword) => {
  if (keyword === "") rows.value = originalRows.value;
  else
    rows.value = originalRows.value.filter((item) =>
      item.category_name.includes(keyword)
    );
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

const handleEdit = (category_id) => {
  console.log(category_id);
};

/**
 * 顶部通知
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
@import url("https://fonts.googleapis.com/css2?family=Merriweather&family=Noto+Sans+SC&display=swap");

.loading {
  width: 100%;
  height: 300px;
}

.section {
  color: #78829d;
  font-size: 13px;
  font-weight: bold;
}

.container {
  padding-bottom: 25px;
  overflow: hidden;

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

  .category_name {
    width: 200px;
    max-width: 50%;
    margin: 0 auto;
  }

  .product_count {
    width: 50px;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
