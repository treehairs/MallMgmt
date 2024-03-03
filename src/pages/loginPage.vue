<script setup>
import { api } from "src/boot/axios";
import { showNotif } from "src/utils/utils";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref("")
const password = ref("")

const login = async () => {
  if (username.value === "" || password.value === "") {
    showNotif("warning", "账号或密码不能为空！")
    return
  }
  const data = {
    username: username.value,
    password: password.value
  }

  const result = await api.post('/login', data)
  if (result.status === 200) {
    showNotif("positive", "登录成功")
    router.push('/')
  }
  else if (result.status === 201) {
    showNotif("warning", "账号或密码错误")
  }

  // const user = userStore.data.find(user => user.username === username.value)
  // const isValidUser = user && user.password === password.value;
  // isValidUser ? showMessage("success", "登录成功！") : user ? showMessage("error", "密码错误!") : showMessage("error", "账号不存在!");
  // if (isValidUser) {
  //   authStore.login()
  //   router.back(1)
  // }

}


</script>

<template>
  <div>
    <div class="login-box">
      <ul>
        <li class="title">登录</li>
        <li class="username"><input type="text" placeholder="用户名" id="username" v-model="username"></li>
        <li class="password"><input type="password" placeholder="密码" id="password" v-model="password"></li>
        <!-- <li class="op">
          <div class="left"><input type="checkbox">记住我</div>
          <div class="right">忘记密码？</div>
        </li> -->
        <li class="submit"><input type="submit" value="登录" id="login" @click="login"></li>
        <!-- <li class="toReg">还没账号？<router-link to="/register">去注册</router-link></li> -->
      </ul>
    </div>
  </div>
</template>

<style scoped>
.login-box {
  width: 100%;
  height: 98vh;
  background: #f5f5f5;
}

.login-box ul {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  list-style: none;
}

.login-box .title {
  font-size: 30px;
  color: var(--primary);
  margin-bottom: 30px;
  font-weight: bold;
}

.login-box .username input,
.login-box .password input {
  width: 320px;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 5px #ddd;
  text-indent: 1em;
}

.login-box .username input:focus,
.login-box .password input:focus {
  outline: none;
}

.login-box .op {
  width: 320px;
}

.login-box .op .left {
  float: left;
  color: #aaa;
}

.login-box .op .right {
  float: right;
  text-align: right;
  color: #aaa;
}

.login-box .submit {
  margin-top: 20px;
  margin-bottom: 20px;
}

.login-box .submit input {

  width: 320px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--primary);
  color: #fff;
  font-size: 18px;
  letter-spacing: 5px;
  cursor: pointer;
  transition: .2s;
}

.login-box .submit input:hover {
  background: #434cfd;
}

.login-box .submit input:focus {
  outline: none;
}

.login-box .toReg {
  color: #aaa;
}
</style>
