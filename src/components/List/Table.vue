<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container q-pa-lg">
    <table border="1">
      <thead>
        <tr class="table-header">
          <th class="checkbox">
            <Checkbox v-model="selectAll" @change="toggleAll"></Checkbox>
          </th>
          <th
            v-for="item in columnName"
            :key="item.index"
            @click="!item.unsorted ? sort_data(`${item.class}`) : null"
            :class="item.class"
          >
            <TableHeader
              :isAscending="isAscending"
              :unsorted="item.unsorted || false"
            >
              <span>{{ item.name }}</span>
            </TableHeader>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item[primaryKeyClass]">
          <td class="checkbox">
            <Checkbox
              v-model="item.selected"
              :id="item[primaryKeyClass]"
              @change="handleChange(item)"
            />
          </td>
          <td v-for="rows in columnName" :key="rows.product_id">
            <slot :name="rows.class" :props="{ item }">
              <span v-if="!$slots[rows.class]">{{ item[rows.class] }}</span>
            </slot>
          </td>
          <td class="op-btns">
            <q-btn-dropdown
              class="dropdown"
              unelevated
              label="操作"
              transition-show="jump-up"
              transition-hide="jump-down"
            >
              <q-list class="list">
                <slot name="op" :props="{ item }"></slot>
              </q-list>
            </q-btn-dropdown>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="pagination.page"
        color="primary"
        :max="pagesNumber"
        :max-pages="6"
        boundary-numbers
      />
    </div>
    <div v-if="!data || !data.length" class="empty-box">
      <EmptyBox></EmptyBox>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import Checkbox from "../Common/Checkbox.vue";
import EmptyBox from "../Common/EmptyBox.vue";
import TableHeader from "../Common/TableHeader.vue";

const props = defineProps(["rows", "columnName", "closePromptBox"]);
let data = props.rows || [];
let columnName = props.columnName || [];

const primaryKeyColumn = columnName.find(
  (column) => column.primary_key === true
);
const primaryKeyClass = primaryKeyColumn.class;

const closePromptBox = props.closePromptBox;
const selectAll = ref(false);
const deleteItemConfirm = ref(false);
const emit = defineEmits(["checkboxChangeInTable", "closePromptBox"]);
let pagesNumber,
  paginatedData,
  selectedArr = [];

watch(
  () => props.columnName,
  (newVal, oldVal) => {
    console.log("columnName 在 Drawer 中发生变化:", newVal);
    // 更新任何本地数据或触发必要的操作
    columnName = newVal;
  }
);
watch(
  () => props.rows,
  (newVal, oldVal) => {
    console.log("rows 在 Drawer 中发生变化:");
    // 更新任何本地数据或触发必要的操作
    data = newVal;
    paginatedData = data;
  }
);
watch(
  () => props.closePromptBox,
  (newVal, oldVal) => {
    deleteItemConfirm.value = false;
    emit("closePromptBox");
    // console.log("closePromptBox 在 Drawer 中发生变化:");
    // 更新任何本地数据或触发必要的操作
  }
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1, // 从第一页开始
  rowsPerPage: 6, // 设置每页的行数
});

// 分页操作
if (data) {
  pagesNumber = computed(() =>
    Math.ceil(data.length / pagination.value.rowsPerPage)
  );

  paginatedData = computed(() => {
    const startIndex =
      (pagination.value.page - 1) * pagination.value.rowsPerPage;
    const endIndex = startIndex + pagination.value.rowsPerPage;
    return data.slice(startIndex, endIndex);
  });
}

// 在组件渲染完成后监听全选的状态
watch(selectAll, (newVal, oldVal) => {
  // 在这里执行你想要的全选状态变化后的逻辑
  // console.log("全选状态变化:", newVal);
});

// 全选按钮
const toggleAll = () => {
  selectAll.value = !selectAll.value;
  data.forEach((item) => {
    item.selected = selectAll.value;
  });
  selectedArr = selectAll.value
    ? paginatedData.value.map((item) => item[primaryKeyClass])
    : [];
  checkbox_emit();
};

// 复选框选中事件
const handleChange = (item) => {
  item.selected = item.selected === undefined ? true : !item.selected;
  if (item.selected) {
    // 选中时的逻辑，将 productId 添加到数组
    selectedArr.push(item[primaryKeyClass]);
  } else {
    // 取消选中时的逻辑，从数组中移除 productId
    const index = selectedArr.indexOf(item[primaryKeyClass]);
    if (index !== -1) {
      selectedArr.splice(index, 1);
    }
  }
  checkbox_emit();
};

// 告知是否有复选框被选中
const checkbox_emit = () => {
  // if (selectedArr.length > 0)
  //   emit('checkboxChangeInTable', false)
  // else
  emit("checkboxChangeInTable", selectedArr);
};

// 排序
const sortOrders = {
  asc: "desc",
  desc: "asc",
};

let isAscending = true;

const sort_data = (columnName) => {
  data.sort((a, b) => {
    const columnA = a[columnName];
    const columnB = b[columnName];

    if (typeof columnA === "number" && typeof columnB === "number") {
      // 如果是数字，直接比较
      return isAscending ? columnA - columnB : columnB - columnA;
    } else {
      // 如果是字符串，使用 localeCompare
      return isAscending
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    }
  });

  // 切换排序方式
  isAscending = !isAscending;
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Merriweather&family=Noto+Sans+SC&display=swap");

.container {
  overflow-x: auto;
  box-sizing: border-box;
  /* 添加这一行使得表格水平滚动 */

  table {
    width: 100%;
    min-width: 1000px;
    border-collapse: separate;
    border-spacing: 0;
    border: none;

    tr {
      transition: 0.2s;
    }

    th,
    td {
      min-width: 150px;
      border: none;
      border-bottom: 1px dashed #f1f1f4;
      padding: 17px 10px;
      color: #78829d;
      text-align: center;
      font-family: "Merriweather", serif;
      font-family: "Noto Sans SC", sans-serif;

      &:first-child {
        min-width: 30px;
      }
    }

    // /* 确保第一列和第二列固定 */
    // th:first-child,
    // td:first-child,
    // th:nth-child(2),
    // td:nth-child(2) {
    //   position: sticky;
    //   z-index: 1;
    //   background-color: white;
    //   /* 为了避免被其他列覆盖，添加白色背景 */
    // }

    // /* 修复第一列和第二列的样式 */
    // th:first-child,
    // td:first-child {
    //   min-width: 80px;
    //   left: 0;
    //   /* 调整第一列宽度以适应内容 */
    // }

    // th:nth-child(2),
    // td:nth-child(2) {
    //   min-width: 150px;
    //   left: 80px;
    //   /* 调整第二列宽度以适应内容 */
    // }

    // /* 确保表头和第一列、第二列对齐 */
    // .table-header th:first-child,
    // tbody tr td:first-child,
    // .table-header th:nth-child(2),
    // tbody tr td:nth-child(2) {
    //   z-index: 2;
    // }

    // .table-header th:first-child,
    // tbody tr td:first-child {
    //   left: 0;
    // }

    // .table-header th:nth-child(2),
    // tbody tr td:nth-child(2) {
    //   left: 80px;
    // }

    th {
      color: #99a1b7;
      font-size: 14px;
    }
  }

  thead {
    .product {
      text-align: left;
      padding: 0 30px;
    }
  }

  tbody {
    tr:last-child {
      td {
        border: none;
      }
    }
  }
}

.list {
  box-shadow: 10px 10px 10px #ccc;
}

.op-btns {
  max-width: 5%;
}

.dropdown {
  background: #fafafa;
  color: #848ba3;
}

.empty-box {
  margin-bottom: 100px;
}

.body--dark {
  table {
    th,
    td {
      border-bottom: 1px dashed #26272f;
    }

    th {
      color: #636674;
    }
  }

  .dropdown {
    background: #272727;
    color: #fff;
  }
}

.table-header {
  width: 100%;
  position: sticky;
  top: 0;
}
</style>
