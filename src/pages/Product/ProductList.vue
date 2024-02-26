<template>
  <div class="container">
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
      @deleteEvent="deleteItem"
      @closePromptBox="closePromptBox = false"
    >
      <template v-slot:product="{ props }">
        <div class="product">
          <q-img
            :src="url + props.item.promo_image"
            :ratio="1"
            width="50px"
            class="promo-image"
          />
          <span class="product_name">{{ props.item.product_name }}</span>
        </div>
      </template>
      <template v-slot:product_status="{ props }">
        <div
          :class="
            props.item.product_status === '在售' ? 'on-sale' : 'out-of-stock'
          "
        >
          <span>{{ props.item.product_status }}</span>
        </div>
      </template>
      <template v-slot:total_stock="{ props }">
        <div class="total_stock">
          <div v-if="props.item.total_stock" class="in-stock">
            <span>{{ props.item.total_stock }}</span>
          </div>
          <div v-else class="sold-out">
            <span>已售罄</span>
          </div>
        </div>
      </template>
      <template v-slot:created_at="{ props }">
        <div class="created_at">
          <span>{{ props.item.created_at }}</span>
        </div>
      </template>
      <template v-slot:updated_at="{ props }">
        <div class="updated_at">
          <span>{{ props.item.updated_at }}</span>
        </div>
      </template>
      <template v-slot:op="{ props }">
        <q-item clickable v-close-popup @click="handleEdit(props.item)">
          <q-item-section class="section">
            <q-item-label>详情</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          @click="deleteItem(props.item.product_id)"
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

    <Drawer
      :dialog="dialog"
      @dialogEventListener="dialog = false"
      :column="columnName"
      :rows="originalRows"
      @selectedColumnsChanged="columnsChanged"
      @selectedRowsChanged="rowsChanged"
      @dateChange="dateChange"
    ></Drawer>

    <!-- 数据删除提示框 -->
    <q-dialog v-model="deleteEventConfirm">
      <PromptBox
        @deleteEvent="deleteEvent"
        @cancel="deleteEventConfirm = false"
      ></PromptBox>
    </q-dialog>
  </div>
  <router-view></router-view>
</template>

<script setup>
import Table from "src/components/List/Table.vue";
import InputField from "src/components/Common/InputField.vue";
import Drawer from "src/components/Common/Drawer.vue";
import PromptBox from "src/components/Common/Form/PromptBox.vue";
import { deleteData, fetchData } from "src/services/api";
// import { showNotif } from 'src/utils/utils.js'
import { Encrypt, Decrypt } from "src/utils/secret";
import { onMounted, ref } from "vue";
import { debounce, throttle, useQuasar } from "quasar";
import { url } from "boot/axios";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const rows = ref([]);
const productsReady = ref(false);
const dialog = ref(false);
const deleteDisabled = ref(true);
const originalRows = ref([]);
const selectedArr = ref([]);
const deleteEventConfirm = ref(false);
const closePromptBox = ref(false);
const refreshed = ref(true);
const tempID = ref(null);
const columnName = ref([
  {
    name: "产品",
    class: "product",
    unsorted: true,
    primary_key: true,
  },
  {
    name: "类别",
    class: "category_name",
  },
  {
    name: "状态",
    class: "product_status",
  },
  {
    name: "总库存",
    class: "total_stock",
  },
  {
    name: "创建时间",
    class: "created_at",
    unsorted: true,
  },
  {
    name: "更新时间",
    class: "updated_at",
  },
]);

/**
 * 获取数据
 */
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/products");
    data.data.map((product) => {
      product.created_at = product.created_at.slice(0, 10);
      product.updated_at = product.updated_at.slice(0, 10);
    });
    originalRows.value = data.data;
    rows.value = [...originalRows.value];
  } catch (error) {
    console.error("请求失败:", error.code);
    rows.value = [];
    return false;
  } finally {
    productsReady.value = true;
  }
  return true;
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
 * 筛选日期
 * @param {*} date - 日期，可以是对象、空值、字符串
 */
const dateChange = (date) => {
  // 日期被选中
  if (date !== null) {
    // 范围日期
    if (date.from) {
      rows.value = originalRows.value.filter((item) => {
        const from = new Date(date.from);
        const to = new Date(date.to);
        const created_at = new Date(item.created_at.replace("-", "/"));
        if (
          Math.round(from) <= Math.round(created_at) &&
          Math.round(to) >= Math.round(created_at)
        ) {
          return item;
        }
      });
    }
    // 选项框数据被删除
    else if (date === "") {
      rows.value = originalRows.value;
    }
    // 单个日期
    else {
      rows.value = originalRows.value.filter((item) => {
        if (
          Math.round(new Date(date)) ===
          Math.round(new Date(item.created_at.replace("-", "/")))
        ) {
          return item;
        }
      });
    }
  }
  // 日期未选择
  else {
    rows.value = originalRows.value;
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

  .product {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .promo-image {
      margin: 0 20px;
      border-radius: 10px;
    }

    .product_name {
      color: #01071a;
    }
  }

  .sold-out,
  .on-sale,
  .out-of-stock {
    span {
      border-radius: 15px;
      padding: 5px 12px;
    }
  }

  .on-sale span {
    background: var(--bg-green);
    color: var(--text-green);
  }

  .out-of-stock span {
    background: var(--bg-grey);
    color: var(--text-grey);
  }

  .total_stock {
    .in-stock {
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
    }

    .sold-out span {
      background: var(--bg-red);
      color: var(--text-red);
    }
  }

  .created_at,
  .updated_at {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
  }
}

.body--light {
  .filter-btn,
  .refresh-btn {
    color: #000;
    background: #fafafa;
  }
}

.body--dark {
  .filter-btn,
  .refresh-btn {
    background: #272727;
  }

  .product {
    .product_name {
      font-weight: bold;
      color: #b5b7c8;
    }
  }

  .on-sale span {
    color: var(--deep--text-green);
    background: var(--deep--bg-green);
  }

  .out-of-stock span {
    color: var(--deep--text-grey);
    background: var(--deep-bg-grey);
  }

  .total_stock {
    .sold-out span {
      color: var(--deep--text-red);
      background: var(--deep-bg-red);
    }
  }
}
</style>
