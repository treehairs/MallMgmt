<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container q-pa-lg">
    <table border="1">
      <thead>
        <tr class="table-header">
          <th>
            <Checkbox v-model="selectAll" @change="toggleAll"></Checkbox>
          </th>
          <th v-for="item in columnName" :key="item.index" @click="!item.unsorted ? sort_data(`${item.class}`) : null"
            :class="item.class">
            <TableHeader :isAscending="isAscending" :unsorted="item.unsorted || false">
              <span>{{ item.name }}</span>
            </TableHeader>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.product_id">
          <td>
            <Checkbox v-model="item.selected" :productId="item.product_id" @change="handleChange(item)" />
          </td>
          <td v-for="rows in columnName" :key="rows.product_id">
            <slot :name="rows.class" :props="{ item }">
              <span v-if="!$slots[rows.class]">{{ item[rows.class] }}</span>
            </slot>
          </td>
          <td>
            <q-btn-dropdown class="dropdown" unelevated label="操作" transition-show="jump-up" transition-hide="jump-down">
              <q-list class="list">
                <q-item clickable v-close-popup @click="handleEditProduct(item.product_id)">
                  <q-item-section class="section">
                    <q-item-label>详情</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="deleteItem(item.product_id)">
                  <q-item-section class="section">
                    <q-item-label>删除</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" :max-pages="6" boundary-numbers />
    </div>
    <div v-if="!data || !data.length">
      <EmptyBox></EmptyBox>
    </div>
    <q-dialog v-model="deleteItemConfirm">
      <PromptBox @deleteEvent="deleteEvent" @cancel="deleteItemConfirm = false"></PromptBox>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import Checkbox from '../Common/Checkbox.vue';
import EmptyBox from '../Common/EmptyBox.vue';
import PromptBox from '../Common/Form/PromptBox.vue';
import TableHeader from '../Common/TableHeader.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps(['rows', 'columnName', 'closePromptBox']);
const data = ref(props.rows.value);
const columnName = ref(props.columnName);
const closePromptBox = ref(props.closePromptBox);
const selectAll = ref(false);
const deleteItemConfirm = ref(false);
const tempProductID = ref();
const emit = defineEmits(['checkboxChangeInTable', 'closePromptBox'])
let pagesNumber, paginatedData, selectedArr = [];

watch(() => props.columnName, (newVal, oldVal) => {
  // console.log("columnName 在 Drawer 中发生变化:", newVal);
  // 更新任何本地数据或触发必要的操作
  columnName.value = newVal
});
watch(() => props.rows.value, (newVal, oldVal) => {
  // console.log("rows 在 Drawer 中发生变化:");
  // 更新任何本地数据或触发必要的操作
  data.value = newVal
});
watch(() => props.closePromptBox, (newVal, oldVal) => {
  deleteItemConfirm.value = false
  emit('closePromptBox')
  // console.log("closePromptBox 在 Drawer 中发生变化:");
  // 更新任何本地数据或触发必要的操作
});


const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1, // 从第一页开始
  rowsPerPage: 10 // 设置每页的行数
});

// 分页操作
if (data.value) {
  pagesNumber = computed(() => Math.ceil(data.value.length / pagination.value.rowsPerPage));

  paginatedData = computed(() => {
    const startIndex = (pagination.value.page - 1) * pagination.value.rowsPerPage;
    const endIndex = startIndex + pagination.value.rowsPerPage;
    return data.value.slice(startIndex, endIndex);
  });
}

// 在组件渲染完成后监听全选的状态
watch(selectAll, (newVal, oldVal) => {
  // 在这里执行你想要的全选状态变化后的逻辑
  console.log('全选状态变化:', newVal);
});

// 全选按钮
const toggleAll = () => {
  selectAll.value = !selectAll.value;
  data.value.forEach((item) => {
    item.selected = selectAll.value;
  });
  selectedArr = selectAll.value ? paginatedData.value.map(item => item.product_id) : []
  checkbox_emit()
};

// 复选框选中事件
const handleChange = (item) => {
  item.selected = item.selected === undefined ? true : !item.selected
  if (item.selected) {
    // 选中时的逻辑，将 productId 添加到数组
    selectedArr.push(item.product_id);
  } else {
    // 取消选中时的逻辑，从数组中移除 productId
    const index = selectedArr.indexOf(item.product_id);
    if (index !== -1) {
      selectedArr.splice(index, 1);
    }
  }
  checkbox_emit()
};

// 告知是否有复选框被选中
const checkbox_emit = () => {
  // if (selectedArr.length > 0)
  //   emit('checkboxChangeInTable', false)
  // else
  emit('checkboxChangeInTable', selectedArr)
}

// 排序
const sortOrders = {
  'asc': 'desc',
  'desc': 'asc',
};

let isAscending = true;

const sort_data = (columnName) => {
  data.value.sort((a, b) => {
    const columnA = a[columnName];
    const columnB = b[columnName];

    if (typeof columnA === 'number' && typeof columnB === 'number') {
      // 如果是数字，直接比较
      return isAscending ? columnA - columnB : columnB - columnA;
    } else {
      // 如果是字符串，使用 localeCompare
      return isAscending ? columnA.localeCompare(columnB) : columnB.localeCompare(columnA);
    }
  });

  // 切换排序方式
  isAscending = !isAscending;
}

const deleteItem = product_id => {
  tempProductID.value = product_id
  deleteItemConfirm.value = true
}

const deleteEvent = () => {
  emit('deleteEvent', tempProductID.value)
}

/**
 * 跳转到商品编辑页面
 * @param {int} PID - 商品id
 */
const handleEditProduct = PID => {
  router.push(`/editProduct/${PID}`)
}

</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Merriweather&family=Noto+Sans+SC&display=swap');

.container {

  table {
    width: 100%;
    min-width: 1000px;
    border-collapse: separate;
    border-spacing: 0;
    border: none;

    tr {
      transition: .2s;
    }

    th,
    td {
      border: none;
      border-bottom: 1px dashed #F1F1F4;
      padding: 17px 10px;
      color: #78829D;
      text-align: center;
      font-family: 'Merriweather', serif;
      font-family: 'Noto Sans SC', sans-serif;

      &:first-child {
        min-width: 30px;
      }
    }

    th {
      color: #99A1B7;
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

.section {
  color: #78829D;
  font-size: 13px;
  font-weight: bold;
}

.list {
  box-shadow: 10px 10px 10px #ccc;
}

.dropdown {
  background: #FAFAFA;
  color: #848BA3;
}

.body--dark {
  table {

    th,
    td {
      border-bottom: 1px dashed #26272F;
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
  position: sticky;
  top: 0;
}
</style>

