<template>
  <div class="header">
    <slot></slot>
    <q-icon v-if="!unsorted" :name="isAscending ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" class=" sort-icon" />
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'

const { isAscending, unsorted } = defineProps(['isAscending', 'unsorted'])

</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;

  .sort-icon {
    opacity: 0;
    transition: .2s;
    width: 0;
  }

  &:hover {
    .sort-icon {
      opacity: 1;
      width: auto;
      padding-left: 3px;
    }
  }
}
</style>
