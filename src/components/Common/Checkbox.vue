<!-- eslint-disable vue/multi-word-component-names -->
<!-- checkbox 组件 -->
<template>
  <div class="checkbox">
    <div class="null"></div>
    <input
      type="checkbox"
      class="checkbox-btn"
      v-model="checked"
      @change="handleChange"
    />
    <q-icon name="done" class="done-icon"></q-icon>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, watch } from "vue";

const emit = defineEmits(["change"]);
const props = defineProps(["modelValue", "id"]);

const checked = computed({
  get: () => props.modelValue,
  set: (value) => value,
});

const handleChange = () => {
  // 在这里执行 checkbox 被选中时的逻辑
  emit("change", props.id, checked.value);
};
</script>

<style lang="scss" scoped>
$side: 18px;

.checkbox {
  width: $side;
  height: $side;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  .null,
  .checkbox-btn,
  .done-icon {
    position: absolute;
  }

  .null {
    width: $side;
    height: $side;
    border-radius: 5px;
    background: #1b84ff;
    z-index: 1;
  }

  .checkbox-btn {
    z-index: 3;
  }

  .done-icon {
    z-index: 2;
    color: white;
  }
}

/* 未选中状态 */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #f1f1f4;
  border: none;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

/* 选中状态 */
input[type="checkbox"]:checked {
  background: transparent;
  transition: 0.2s;
}

.body--dark {
  input[type="checkbox"] {
    background: #414141;
  }

  /* 选中状态 */
  input[type="checkbox"]:checked {
    background: transparent;
    transition: 0.2s;
  }
}
</style>
