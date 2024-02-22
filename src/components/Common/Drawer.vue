<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-dialog
    v-model="dialog"
    position="right"
    @hide="emit('dialogEventListener')"
  >
    <q-card class="card">
      <div class="header"><span>筛选条件</span></div>
      <div class="container">
        <ul class="filter-item">
          <li>
            <span>列：</span>
            <SelectInput
              :data="column"
              filterConditions="name"
              @selectedChanged="columnsChanged"
            />
          </li>
          <li>
            <span>类别：</span>
            <SelectInput
              :data="rows"
              filterConditions="category_name"
              @selectedChanged="selectedChanged"
            />
          </li>
          <li>
            <span>状态：</span>
            <SelectInput
              :data="rows"
              filterConditions="product_status"
              @selectedChanged="selectedChanged"
            />
          </li>
          <li>
            <span>创建日期：</span>
            <DatePicker @dateChange="dateChange" />
          </li>
        </ul>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import SelectInput from "src/components/Common/Form/SelectInput.vue";
import DatePicker from "src/components/Common/Form/DatePicker.vue";

const props = defineProps(["dialog", "column", "rows"]);
const emit = defineEmits([
  "hideDialog",
  "selectedColumnsChanged",
  "selectedRowsChanged",
  "dateChange",
]);
const dialog = ref(props.dialog);
const column = ref(props.column);
const rows = ref(props.rows);

watchEffect(() => {
  dialog.value = props.dialog;
});

const columnsChanged = (value) => {
  emit("selectedColumnsChanged", value);
};

const selectedChanged = (value, filterConditions) => {
  emit("selectedRowsChanged", value, filterConditions.value);
};

const dateChange = (value) => {
  emit("dateChange", value);
};
</script>

<style lang="scss" scoped>
.card {
  width: 350px;
  height: 100vh;
}

.header {
  height: 60px;
  line-height: 60px;
  color: #454d64;
  font-family: yuanti;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding: 0 30px;
  margin-bottom: 30px;
}

.filter-item {
  list-style: none;
  padding: 0;
  margin: 0;

  & > li {
    min-height: 100px;
    padding: 0 30px;

    span {
      display: block;
      margin-bottom: 10px;
      color: #454d64;
      font-family: yuanti;
    }
  }
}

.body--dark {
  .header,
  .filter-item span {
    color: #fff;
  }
}
</style>
