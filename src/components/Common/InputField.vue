<template>
  <div class="search-box">
    <form @submit.prevent="handleSubmit">
      <q-icon name="search" class="icon" />
      <input type="text" placeholder="请输入关键字..." v-model="keyword" />
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["searchEvent"]);
const keyword = ref("");

const handleSubmit = () => {
  emit("searchEvent", keyword.value);
};
</script>

<style lang="scss" scoped>
.search-box {
  width: 220px;
  height: 40px;
  background: #f9f9f9;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  margin-left: 10px;
  color: #99a1b7;
  transition: 0.2s;

  .icon {
    font-size: 20px;
    margin-left: 20px;
    margin-right: 5px;
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    letter-spacing: 1px;

    &::placeholder {
      color: #99a1b7;
      font-family: yuanti;
      font-size: 13px;
    }
  }

  &:focus-within {
    background-color: #f0f0f0;
  }
}

.body--dark {
  .search-box {
    background: #2f2f2f;

    &:focus-within {
      background-color: #272727;
    }
  }

  input {
    color: #fff;
  }
}
</style>
