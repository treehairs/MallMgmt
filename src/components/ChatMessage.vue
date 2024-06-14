<template>
  <section class="chat-message" :class="self ? 'chat-message--right' : ''">
    <img class="chat-message__avatar" src="/images/avatar.jpg" />
    <p class="chat-message__text">
      {{ message }}
    </p>
    <span class="chat-message__time">{{ from_now }}</span>
  </section>
</template>

<script>
import moment from "moment";
import { ref } from "vue";

moment.defineLocale("zh-cn", {
  relativeTime: {
    future: "%s内",
    past: "%s前",
    s: "几秒",
    m: "1分钟",
    mm: "%d分钟",
    h: "1小时",
    hh: "%d小时",
    d: "1天",
    dd: "%d天",
    M: "1个月",
    MM: "%d个月",
    y: "1年",
    yy: "%d年",
  },
});

export default {
  props: {
    sendTime: {
      type: Date,
      default: "",
    },
    self: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const send_time = ref(props.sendTime);
    const from_now = moment(send_time.value).fromNow();

    return {
      send_time,
      from_now,
    };
  },
};
</script>

<style lang="scss" scoped>
$avatar-size: 50px;
$message-box__color--myself: #95ec69;
$message-box__color--orders: #f5f5f5;
$message-box__color--dark: #303030;

.chat-message {
  max-width: 600px;
  min-height: 50px;
  display: flex;
  margin-bottom: 20px;
  // align-items: center;
  // background: #ccc;

  &__avatar {
    width: $avatar-size;
    height: $avatar-size;
    border-radius: 8px;
  }

  &__text {
    background: $message-box__color--orders;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 15px;
    font-size: 18px;
    font-family: yuanti;
    border-radius: 8px;
    margin: 0 15px;
    position: relative;

    &::before {
      content: ""; /* 必须要有 content 属性 */
      width: 10px; /* 正确的宽度单位 */
      height: 10px; /* 正确的高度单位 */
      border-width: 10px; /* 三角形大小 */
      border-style: solid;
      border-color: transparent transparent $message-box__color--orders
        transparent;
      position: absolute;
      top: 15px; /* 可以调整伪元素位置 */
      left: 0; /* 可以调整伪元素位置 */
      transform: translateX(-50%); /* 通过 transform 属性水平居中 */
    }
  }

  &__time {
    display: flex;
    align-items: flex-end;
    color: #b9b9b9;
    font-size: 10px;
    font-family: yuanti;
  }

  &--right {
    margin-left: auto;
    flex-direction: row-reverse;
    .chat-message__avatar {
      order: 1;
    }
    .chat-message__text {
      background: $message-box__color--myself;
      order: 2;

      &::before {
        right: -20px; /* 可以调整伪元素位置 */
        left: auto;
        border-color: transparent transparent $message-box__color--myself
          transparent;
      }
    }
    .chat-message__time {
      order: 3;
    }
  }
}

.body--dark {
  .chat-message__text {
    background: $message-box__color--dark;

    &::before {
      border-color: transparent transparent $message-box__color--dark
        transparent;
    }
  }
}
</style>
