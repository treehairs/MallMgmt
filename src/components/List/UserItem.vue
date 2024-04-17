<template>
  <div class="user-item-box relative-position" v-ripple>
    <div class="user-avatar">{{ data.username }}</div>
    <div class="user-name">{{ data.username }}</div>
  </div>
</template>

<script setup>
const props = defineProps(["data"]);
const data = props.data;
</script>

<style scoped lang="scss">
.user-item-box {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 10px;
  padding: 28px 15px;
  transition: 0.2s;

  &:hover {
    background: #6f76fc1e;
  }
}
.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #25c401ab;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
  margin-right: 15px;
  overflow: hidden;
}

.user-name {
  font-size: 16px;
  font-family: yuanti;
}
</style>
