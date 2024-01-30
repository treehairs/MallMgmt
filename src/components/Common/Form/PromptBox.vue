<template>
  <div class="prompt-box">
    <PromptIcon></PromptIcon>
    <div class="tip">
      <span>删除商品及其下所有规格</span>
      <span>数据删除后<b style="color: brown;">无法恢复</b>，确定批量删除？</span>
    </div>
    <div class="btn">
      <q-btn color="negative" @click="deleteEvent">删除</q-btn>
      <q-btn unelevated @click="cancel">取消</q-btn>
    </div>
  </div>
</template>

<script setup>
import PromptIcon from "src/components/Common/Form/PromptIcon.vue";
import { defineEmits } from "vue";

const emit = defineEmits(['deleteEvent', 'cancel'])

const deleteEvent = () => {
  emit('deleteEvent')
}

const cancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.prompt-box {
  width: 400px;
  background: #fff;
  animation: zoom .5s;
  font-family: yuanti;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tip {
  width: 100%;
  margin: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  span {
    margin: 3px;
  }
}

.btn {
  flex: 1;
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

@keyframes zoom {
  0% {
    transform: scale(.7);
  }

  45% {
    transform: scale(1.05);
  }

  80% {
    transform: scale(.95);
  }

  100% {
    transform: scale(1);
  }
}

.body--dark {
  .prompt-box {
    background: #1D1D1D;
  }
}
</style>
