<template>
  <div class="select-input-container">
    <div class="input-box" @click="show = !show">
      <input
        type="text"
        class="input"
        :class="hide"
        :placeholder="default_value"
        readonly
        v-model="filterData"
      />
      <q-icon
        name="close"
        class="icon close-icon"
        v-show="selectedData.length !== 0 && !hide_close_icon"
        @click.stop="clearSelected"
      ></q-icon>
      <q-icon
        name="expand_more"
        class="icon expand-icon"
        :class="show ? 'hideList' : ''"
        @click.stop="show = !show"
      />
    </div>
    <transition name="fade">
      <div class="select-box" v-show="show">
        <ul>
          <li
            class="select-item"
            :class="item[hide] ? 'checked' : ''"
            v-for="item in data"
            :key="item.index"
            @click.stop="handleItemClick(item)"
          >
            <span>{{ item[filterConditions] }}</span>
            <q-icon name="check" v-show="item[hide]" />
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect, watch } from "vue";

const show = ref(false);
const props = defineProps([
  "data",
  "filterConditions",
  "single_choice",
  "default_value",
  "hide_close_icon",
]);
const emit = defineEmits(["selectedChanged", "selectedData"]);
let data = props.data;
const single_choice = props.single_choice || false;
const default_value = props.default_value || "请选择";
const hide_close_icon = props.hide_close_icon || false;
const filterConditions = ref(props.filterConditions);
const hide = filterConditions.value + "-hide";
const dataCopy = ref([...props.data]);
// 获取被选中的列名
const selectedData = computed(() => data.filter((item) => item[hide] === true));

// 选中的数据
const filterData = computed(() =>
  selectedData.value.map((item) => item[filterConditions.value])
);

// 监听 selectedData 变化
watch(selectedData, () => {
  // 通知父组件
  emit("selectedChanged", filterData.value, filterConditions);
});

// 数据去重
function removeDuplicates(arr, uniId) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

// 监听列名选项点击事件
const handleItemClick = (item) => {
  // 单选
  if (single_choice) data.map((item) => (item[hide] = false));
  // 多选
  item[hide] = item[hide] === undefined ? true : !item[hide];

  emit("selectedData", filterData.value);
};

// 清除已选中的选项
const clearSelected = () => {
  dataCopy.value.forEach((item) => (item[hide] = false));
  show.value = false;
};

// 点击外部关闭
const handleClickOutside = (e) => {
  if (!e.target.className.includes(hide)) show.value = false;
};

// 对data数据中相同的类别进行去重
data = removeDuplicates(data, filterConditions.value);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
$input-height: 42px;

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s; // 设置过渡时间
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.select-input-container {
  display: flex;
  flex-direction: column;

  .input-box {
    width: 100%;
    height: $input-height;
    background: var(--bg-grey);
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    transition: 0.2s;
    cursor: pointer;

    &:focus-within {
      background: #eeedf1;
    }

    .input {
      border: none;
      outline: none;
      height: 100%;
      width: 100%;
      background: transparent;
      box-sizing: border-box;
      font-family: "微软雅黑";
      letter-spacing: 1px;
      cursor: pointer;
      color: #7a849e;

      &::placeholder {
        color: #7a849e;
      }
    }

    .icon {
      cursor: pointer;
      margin-left: 5px;
      color: #7a849e;
      transition: 0.3s;
      z-index: 0;

      &:hover {
        color: #6f77fc;
      }
    }

    .expand-icon {
      font-size: 20px;
    }

    .hideList {
      transform: rotate(180deg);
      transform-origin: center center;
    }
  }

  .select-box {
    position: relative;
    z-index: 100;

    ul {
      transition: 0.3s; // 添加 transition 属性
      list-style: none;
      padding: 5px 5px 15px 5px;
      margin: 0;
      position: absolute;
      width: 100%;
      border-radius: 7px;
      box-shadow: 0px 0px 20px #e4e3e7;
      background: #fff;

      .select-item {
        height: 38px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
        color: #525252;
        transition: 0.2s;
        cursor: pointer;
        font-family: "yuanti";

        &:hover {
          background: var(--bg-grey);
          color: #6f77fc;
        }
      }

      .checked {
        background: var(--bg-grey);
        color: #6f77fc;
      }
    }
  }
}

.body--dark {
  .input-box {
    background: #2f2f2f;

    &:focus-within {
      background: #252525;
    }
  }

  .select-box {
    ul {
      background: #2f2f2f;
      box-shadow: 0px 0px 20px #2f2f2f;

      .select-item {
        color: #d6d6d6;

        &:hover {
          background: #434343;
          color: #6f77fc;
        }
      }
    }
  }
}
</style>
