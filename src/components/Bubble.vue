<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="ball" :style="{ width: diameter + 'px', height: diameter + 'px', top: top + '%', left: left + '%' }">
  </div>
</template>

<script setup>
import { ref } from "vue";

const diameter = ref(Math.random() * 300 + 100)
const top = ref(Math.random() * 80 + 0)
const left = ref(Math.random() * 80 + 0)
</script>

<style>
.ball {
  border-radius: 50%;
  position: absolute;
  background: #e9ffd01a;
  /* box-shadow: 0 0 100px #fff7f7c5; */
}
</style>
