<!-- eslint-disable vue/multi-word-component-names -->
<!-- checkbox 组件 -->
<template>
  <div class="checkbox">
    <div class="null"></div>
    <input type="checkbox" class="checkbox-btn" v-model="checked" @change="handleChange" />
    <q-icon name="done" class="done-icon"></q-icon>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, watch } from 'vue';

const emit = defineEmits(['change'])
const props = defineProps(['modelValue', 'productId']);

const checked = computed({
  get: () => props.modelValue,
  set: (value) => value
});

const handleChange = () => {
  // 在这里执行 checkbox 被选中时的逻辑
  emit('change', props.productId, checked.value);
}

</script>



<style lang="scss" scoped>
.checkbox {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;

  .null,
  .checkbox-btn,
  .done-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .null {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background: #1B84FF;
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
  background: #F1F1F4;
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
  transition: .2s;
}

.body--dark {
  input[type="checkbox"] {
    background: #414141;
  }

  /* 选中状态 */
  input[type="checkbox"]:checked {
    background: transparent;
    transition: .2s;
  }
}
</style>
