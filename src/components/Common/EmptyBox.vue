<template v-slot:no_data>
  <div class="no-data">
    <img src="pages/empty-box.png" alt="空数据">
    <span>空数据</span>
  </div>
</template>

<style lang="scss" scoped>
.no-data {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    width: 200px;
    margin: 20px 0;
  }

  span {
    font-weight: bold;
    color: #ccc;
  }
}
</style>
