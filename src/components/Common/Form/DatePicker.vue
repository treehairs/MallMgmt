<template>
  <div class="container">
    <div class="input-box" @click="show = !show">
      <div class="data-picker">
        <span v-if="!date" class="data-picker">请选择</span>
        <span v-else-if="date.from" class="data-picker">{{ date.from }} - {{ date.to }}</span>
        <span v-else class="data-picker">{{ date }}</span>
      </div>
      <q-icon name="close" class="icon close-icon" v-show="date" @click="date = ''" />
      <q-icon name="event" class="icon event-icon" @click.stop="show = !show" />
    </div>
    <transition name="fade">
      <q-card v-show="show">
        <q-date v-model="date" range @click.stop />
      </q-card>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted, watch } from "vue";
const show = ref(false)
const date = ref()
const emit = defineEmits(['dateChange'])

watch(date, (newVal, oldVal) => {
  dateEventListener(date.value)
})

// 点击外部关闭
const handleClickOutside = (e) => {
  if (!e.target.className.includes("data-picker"))
    show.value = false;
}

const dateEventListener = (data) => {
  emit('dateChange', data)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<style lang="scss" scoped>
$input-height: 42px;

.fade-enter-active,
.fade-leave-active {
  transition: .3s; // 设置过渡时间
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.container {
  width: 100%;

  .input-box {
    width: 100%;
    height: $input-height;
    background: var(--bg-grey);
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    transition: .2s;
    cursor: pointer;

    &:focus-within {
      background: #EEEDF1;
    }

    div {
      border: none;
      outline: none;
      height: 100%;
      width: 100%;
      background: transparent;
      box-sizing: border-box;
      font-family: '微软雅黑';
      letter-spacing: 1px;
      cursor: pointer;
      color: #7A849E;
      display: flex;
      align-items: center;
    }

    .icon {
      cursor: pointer;
      margin-left: 5px;
      color: #7A849E;
      transition: .3s;
      z-index: 0;

      &:hover {
        color: #6f77fc;
      }
    }

    .event-icon {
      font-size: 20px;
    }

    .hideList {
      transform: rotate(180deg);
      transform-origin: center center;
    }
  }
}

.body--dark {
  .input-box {
    background: #2F2F2F;

    &:focus-within {
      background: #252525;
    }
  }

}
</style>
