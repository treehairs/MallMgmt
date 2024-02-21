<template>
  <div class="login-container bg-neutral">
    <div class="login-box">
      <form action="">
        <input type="text" v-model="username" class="login-ipt">
        <input type="password" v-model="password" class="login-ipt">
        <div class="login-operation">
          <div class="remember">
            <Checkbox />
            <span>记住我</span>
          </div>
          <div class="forget">
            <span>忘记密码?</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Checkbox from "src/components/Common/Checkbox.vue";
import { ref } from "vue";

const username = ref()
const password = ref()
</script>

<style lang="scss" scoped>
.login-container {
  /* 背景渐变 */
  width: 100vw;
  height: 99vh;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box form {
    width: 300px;
    display: flex;
    flex-direction: column;
  }

  .login-operation {
    display: flex;
  }

  .remember {
    display: flex;
  }

  .remember,
  .forget {
    width: 50%;
  }

}
</style>
