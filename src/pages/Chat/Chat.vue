<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="chat-container">
    <div class="user-list-box">
      <div class="title">
        <q-icon name="playlist_play" class="icon"></q-icon>
        <span>用户列表</span>
      </div>
      <div class="user-list">
        <template v-for="user in state.userList" :key="user.id">
          <UserItem
            :data="user"
            v-if="user.username !== state.username"
            @click="selectUser(user)"
          />
        </template>
      </div>
    </div>
    <div class="chat-box">
      <div class="message-box">
        <input
          type="text"
          v-model="message_text"
          :placeholder="
            select_user ? `发送给用户：${select_user}` : '未选择用户...'
          "
        />
        <q-icon name="send" class="send-btn" @click="send" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import UserItem from "src/components/List/UserItem.vue";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const message_text = ref();
const select_user = ref();
const state = reactive({
  username: route.query.username,
  userList: [],
});

const getData = () => {};

const socket = io("http://localhost:4000", {
  query: {
    username: state.username,
  },
});

socket.on("onLine", (data) => {
  state.userList = data;
  console.log(state.userList);
});

socket.on("leaving", (data) => {});

const send = () => {
  socket.emit("send", {
    fromUsername: state.username,
    targetUsername: select_user.value,
    msg: message_text.value,
  });
};

socket.on("receive", (data) => {
  console.log(data);
});

const selectUser = (user) => {
  console.log(user);
  select_user.value = user.username;
};
</script>

<style lang="scss" scoped>
.chat-container {
  width: 100%;
  min-width: 800px;
  height: 79vh;
  border-radius: 10px;
  background: #eef0f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  .user-list-box {
    width: 20%;
    min-width: 250px;
    height: 100%;
    border-radius: 10px;
    background: #fff;
  }

  .chat-box {
    width: 79%;
    height: 100%;
    border-radius: 10px;
    background: #fff;
    display: flex;
  }
}

.user-list-box {
  .title {
    font-family: yuanti;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
  }
  .icon {
    font-size: 30px;
    margin-left: 5px;
    margin-right: 2px;
  }
}

.message-box {
  width: 60%;
  height: 45px;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px #eee;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;
  margin-top: auto;
  margin-bottom: 30px;
  transition: 0.2s;

  &:focus-within {
    box-shadow: 0 0 2px #6f77fc;
  }

  input {
    outline: none;
    border: none;
    height: 100%;
    width: 88%;
    background: transparent;
    padding: 0 10px;
    font-family: yuanti;
  }
  .send-btn {
    font-size: 20px;
    transform: rotate(-40deg);
    color: #bbb;
    padding: 6px;
    transition: 0.2s;
    border-radius: 15px;
    cursor: pointer;

    &:hover {
      background: #eee;
      color: #797979;
    }

    &:active {
      background: #e0e0e0;
      color: #575757;
    }
  }
}
.user-list {
  padding: 0 10px;
}
.body--dark {
  .chat-container {
    background: #121212;
  }
  .user-list-box,
  .chat-box {
    background: #1d1d1d;
  }
}
</style>
