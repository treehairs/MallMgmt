<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <q-table :rows="rows" :columns="columns" class="table my-sticky-column-table" row-key="product_id"
      v-model:pagination="pagination" hide-pagination selection="multiple" v-model:selected="selected" :loading="loading">
      <q-space />
      <!-- 表头 -->
      <template v-slot:header-cell="props">
        <q-th :props="props" class="th">
          {{ props.col.label }}
        </q-th>
      </template>

      <!-- 行插槽 -->
      <template v-slot:body-cell="props">
        <q-td :props="props" class="td">
          {{ props.value }}
        </q-td>
      </template>
      <!-- 图片 -->
      <template v-slot:body-cell-promo_image="props">
        <q-td :props="props">
          <q-img :src="props.value" alt="" :ratio="1" width="60px" class="promo-image" />
        </q-td>
      </template>
      <!-- 状态 -->
      <template v-slot:body-cell-product_status="props">
        <q-td :props="props">
          <div class="text-center" :class="props.value ? 'on-sale' : 'out-of-stock'">
            <span>{{ props.value ? '在售' : '下架' }}</span>
          </div>
        </q-td>
      </template>
      <!-- 库存 -->
      <template v-slot:body-cell-total_stock="props">
        <q-td :props="props" class="total_stock">
          <div v-if="props.value" class="in-stock">
            {{ props.value }}
          </div>
          <div v-else class="sold-out">
            <span>已售罄</span>
          </div>
        </q-td>
      </template>
      <!-- 创建时间 -->
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          <q-chip icon="schedule" class="time text-caption">{{ props.value }}</q-chip>
        </q-td>
      </template>
      <!-- 修改时间 -->
      <template v-slot:body-cell-updated_at="props">
        <q-td :props="props">
          <q-chip icon="schedule" class="time text-caption">{{ props.value }}</q-chip>
        </q-td>
      </template>


      <!-- 标题 -->
      <template v-slot:top="props">
        <div class="col-2 q-table__title">
          <!-- <q-btn color="negative" label="批量删除" :disable="selected.length === 0" /> -->
        </div>
        <q-space />
        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen" class="q-ml-md" />
      </template>

      <!-- 加载状态 -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <!-- 空数据 -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm">
          <div v-if="loading" class="text-grey no-data text-subtitle2 q-py-xs">正在加载中...</div>
          <div v-else class="q-py-md">
            <q-img src="/public/pages/empty-box.png" width="250px" />
            <p class="text-subtitle1 text-center q-py-sm text-grey no-data">数据为空</p>
          </div>
        </div>
      </template>
    </q-table>

    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" :max-pages="6" boundary-numbers />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { fetchData } from '../../services/api.js'

const columns = [
  // { name: 'product_id', label: '编号', field: 'product_id', align: 'left', required: true, sortable: true, style: 'text-align: left;width:50px', },
  { name: 'promo_image', label: '图片', field: 'promo_image', align: 'center' },
  { name: 'product_name', label: '名称', field: 'product_name', align: 'left', sortable: true, style: 'text-align: left;' },
  { name: 'category_name', label: '类别', field: 'category_name', align: 'center' },
  { name: 'product_status', label: '商品状态', field: 'product_status', align: 'center' },
  { name: 'total_stock', label: '总库存', field: 'total_stock', align: 'center' },
  { name: 'created_at', label: '创建时间', field: 'created_at', align: 'center' },
  { name: 'updated_at', label: '更新时间', field: 'updated_at', align: 'center' },
]

const rows = ref([])

export default {
  setup() {

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 2,
      rowsPerPage: 5
      // rowsNumber: xx if getting data from a server
    })
    const selected = ref([])
    const loading = ref(true)

    const fetchDataAndSetRows = async () => {
      try {
        const data = await fetchData('/products');
        data.data.map(product => {
          product.created_at = product.created_at.slice(0, 10) + " " + product.created_at.slice(11, 16)
          product.updated_at = product.updated_at.slice(0, 10) + " " + product.updated_at.slice(11, 16)
        })
        rows.value = data.data
      } catch (error) {
        console.error('请求失败:', error);
      }
      loading.value = false
    };

    onMounted(fetchDataAndSetRows);

    return {
      pagination,
      columns,
      rows,
      selected,
      loading,

      pagesNumber: computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage)),
    }

  }
}
</script>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Merriweather&family=Noto+Sans+SC&display=swap');

.q-table__card {
  box-shadow: none;
}

.time {
  // font-size: 14px;
  // margin-left: 5px;
  font-weight: bold;
  font-family: 'Merriweather', serif;
}

.no-data {
  font-family: "微软雅黑";
}

.body--light {
  .time {
    background: #F5F5F5;
    color: #757575;
  }

  table {
    border-color: red;
  }

  .th {
    color: #BDBDBD;
  }

  .td {
    color: #616161;
  }

  .total_stock {
    .in-stock {
      font-weight: bold;
    }

    .sold-out span {
      background: var(--bg-red);
      color: var(--text-red);
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

}

.sold-out,
.on-sale,
.out-of-stock {
  span {
    font-weight: bold;
    border-radius: 15px;
    padding: 7px 15px;
  }
}

.th {
  font-size: 16px;
  font-family: title;
}

.td {
  font-size: 16px;
  font-family: 'Merriweather', serif;
  font-family: 'Noto Sans SC', sans-serif;
}

.promo-image {
  border-radius: 10px;
}
</style>

<style lang="sass">
.my-sticky-column-table
  /* 为了在任何浏览器窗口上都正确的突出显示固定的列，我们需要声明 max-width 属性 */
  max-width: 100%

  /** 固定第一列 */
  th:nth-child(1),
  td:nth-child(1),
  th:nth-child(2),
  td:nth-child(2)
    position: sticky
    left: 0
    z-index: 1
</style>
