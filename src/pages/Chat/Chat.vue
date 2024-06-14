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
    <div class="chat-box" v-if="select_user">
      <header class="chat-box__header">
        <q-icon name="wifi_calling_3" class="chat-box__header-icon" />
        <p class="chat-box__header-text">联系用户：{{ select_user }}</p>
      </header>
      <div class="chat-box__message--list">
        <template v-for="message in messageList" :key="message.id">
          <ChatMessage
            :sendTime="message.send_time"
            :message="message.message"
            :self="state.username === message.from_user"
          />
        </template>
        <!-- <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage /> -->
      </div>

      <div class="chat-box__message--input">
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
    <div class="chat-box chat-box--empty" v-else>
      <img
        src="/icons/no-news.png"
        alt="暂无消息"
        class="chat-box--empty__image"
      />
      <p class="chat-box--empty__title">请选择用户</p>
    </div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import UserItem from "src/components/List/UserItem.vue";
import ChatMessage from "src/components/ChatMessage.vue";
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";
import moment, { now } from "moment";
import { showNotif } from "src/utils/utils";

const route = useRoute();
const message_text = ref();
const select_user = ref();
const state = reactive({
  username: route.query.username,
  userList: [],
  messageList: [],
});

// 过滤消息
const messageList = computed(() =>
  state.messageList.filter(
    (message) =>
      (message.from_user === state.username &&
        message.to_user === select_user.value) ||
      (message.from_user === select_user.value &&
        message.to_user === state.username)
  )
);

const selectUser = (user) => {
  console.log(user);
  select_user.value = user.username;

  console.log(messageList.value);
};

const socket = io("ws://localhost:4000", {
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
  if (!message_text.value) {
    showNotif("negative", "请输入信息");
    return;
  }
  const message_recording = {
    from_user: state.username,
    to_user: select_user.value,
    message: message_text.value,
    send_time: new Date(),
  };
  socket.emit("send", message_recording);
  state.messageList.push(message_recording);

  message_text.value = null;
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // 在这里添加回车键按下后要执行的操作
    send();
  }
});

socket.on("receive", (data) => {
  state.messageList.push(data);
  console.log(state.messageList);
});
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
    flex-direction: column;

    &--empty {
      display: flex;
      justify-content: center;
      align-items: center;

      &__image {
        width: 400px;
      }

      &__title {
        color: #9e9e9e;
        letter-spacing: 2px;
        font-family: yuanti;
      }
    }
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

.chat-box__message--input {
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

.chat-box__message--list {
  width: 100%;
  max-height: 600px;
  padding: 20px 80px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.chat-box__header {
  font-family: yuanti;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &-icon {
    margin-right: 8px;
  }

  p {
    margin: 0;
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
