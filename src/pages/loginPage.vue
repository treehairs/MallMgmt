<script setup>
import { api } from "src/boot/axios";
import { userStore } from "src/stores/user";
import { showNotif } from "src/utils/utils";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = userStore();

const username = ref("");
const password = ref("");
const ongoing = ref(false);

const login = async () => {
  if (username.value === "" || password.value === "") {
    showNotif("warning", "账号或密码不能为空！");
    return;
  }

  if (ongoing.value) return;

  ongoing.value = true;

  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const result = await api.post("/login", data);
    if (result.status === 200) {
      showNotif("positive", "登录成功");
      // store.updateUserInfo(result.data.data[0]);
      localStorage.setItem("userInfo", JSON.stringify(result.data.data[0]));
      console.log(result.data.data[0]);
      router.push("/");
    } else if (result.status === 201) {
      showNotif("warning", "账号或密码错误");
    } else {
      console.log("Meiwan");
    }
  } catch (e) {
    showNotif("info", "连接出错");
  } finally {
    ongoing.value = false;
  }

  // const user = userStore.data.find(user => user.username === username.value)
  // const isValidUser = user && user.password === password.value;
  // isValidUser ? showMessage("success", "登录成功！") : user ? showMessage("error", "密码错误!") : showMessage("error", "账号不存在!");
  // if (isValidUser) {
  //   authStore.login()
  //   router.back(1)
  // }
};
</script>

<template>
  <div>
    <div class="login-box">
      <ul>
        <li class="title">登录</li>
        <li class="username">
          <input
            type="text"
            placeholder="用户名"
            id="username"
            v-model="username"
          />
        </li>
        <li class="password">
          <input
            type="password"
            placeholder="密码"
            id="password"
            v-model="password"
          />
        </li>
        <!-- <li class="op">
          <div class="left"><input type="checkbox">记住我</div>
          <div class="right">忘记密码？</div>
        </li> -->
        <li class="submit" v-if="!ongoing">
          <input
            type="submit"
            value="登录"
            id="login"
            @click="login"
            :disabled="ongoing"
          />
        </li>
        <li class="submit" v-else>
          <div class="loading">
            <q-icon name="refresh" class="icon"></q-icon>
          </div>
        </li>
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
  border-radius: 10px;
  background: var(--primary);
}

.login-box .submit input {
  width: 320px;
  height: 40px;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-size: 18px;
  letter-spacing: 5px;
  cursor: pointer;
  transition: 0.2s;
  background: transparent;
}

.login-box .submit input:hover {
  background: #434cfd;
}

.login-box .submit input:focus {
  outline: none;
}

.loading {
  width: 320px;
  height: 40px;
  border-radius: 10px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading .icon {
  font-size: 25px;
  animation: refreshing 1s infinite linear;
}

@keyframes refreshing {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.login-box .toReg {
  color: #aaa;
}
</style>
