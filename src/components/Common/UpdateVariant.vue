<template>
  <div class="update-variant-container">
    <div class="update-variant-box-title">
      <q-icon name="edit_calendar" /><span>商品变体信息</span>
    </div>
    <form action="" class="variant-info-form" @submit="submit">
      <ul class="variant-info-list">
        <li class="image-box">
          <UploadImage
            :src="variantInfo.variant_image"
            shadow="true"
            @imageData="imageData"
          />
        </li>
        <li class="variant-info-item name-box">
          <label for="name">变体名称</label>
          <input
            type="text"
            name="name"
            placeholder="变体名称"
            v-model="variantInfo.variant_name"
            :class="submitForm && !variantInfo.variant_name ? 'empty' : ''"
          />
          <div class="tips-box">
            <label
              :for="variantInfo.variant_name"
              v-if="submitForm && !variantInfo.variant_name"
              class="tips"
              >值不能为空</label
            >
          </div>
        </li>
        <li class="variant-info-item">
          <div>
            <label for="name">变体价格</label>
            <input
              type="text"
              name="name"
              placeholder="变体价格"
              v-model="variantInfo.price"
              :class="submitForm && !variantInfo.price ? 'empty' : ''"
            />
            <div class="tips-box">
              <label
                :for="variantInfo.price"
                v-if="submitForm && !variantInfo.price"
                class="tips"
                >值不能为空</label
              >
            </div>
          </div>
          <div>
            <label for="name">变体库存</label>
            <input
              type="text"
              name="name"
              placeholder="变体库存"
              v-model="variantInfo.stock_quantity"
              :class="submitForm && !variantInfo.stock_quantity ? 'empty' : ''"
            />
            <div class="tips-box">
              <label
                :for="variantInfo.stock_quantity"
                v-if="submitForm && !variantInfo.stock_quantity && !0"
                class="tips"
                >值不能为空</label
              >
            </div>
          </div>
        </li>
        <li class="variant-info-item">
          <div>
            <label for="name">变体类型</label>
            <input
              type="text"
              name="name"
              placeholder="变体类型"
              v-model="variantInfo.style"
              :class="submitForm && !variantInfo.style ? 'empty' : ''"
            />
            <div class="tips-box">
              <label
                :for="variantInfo.style"
                v-if="submitForm && !variantInfo.style"
                class="tips"
                >值不能为空</label
              >
            </div>
          </div>
          <div>
            <label for="name">变体规格</label>
            <input
              type="text"
              name="name"
              placeholder="变体规格"
              v-model="variantInfo.specs"
              :class="submitForm && !variantInfo.specs ? 'empty' : ''"
            />
            <div class="tips-box">
              <label
                :for="variantInfo.specs"
                v-if="submitForm && !variantInfo.specs"
                class="tips"
                >值不能为空</label
              >
            </div>
          </div>
        </li>
        <li class="variant-info-item btn-box">
          <q-btn color="primary" class="btn" @click="submit">提交</q-btn>
          <q-btn class="btn cancel-btn" @click="emit('cancel')">取消</q-btn>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import UploadImage from "./UploadImage.vue";
import { isAnyObjectValueEmpty } from "src/utils/utils.js";

const props = defineProps(["updateVariantInfo"]);
const emit = defineEmits(["cancel", "submitEvent"]);

const submitForm = ref(false);
const emptyInfo = reactive({
  variant_name: "",
  price: 0,
  stock_quantity: 0,
  style: "",
  specs: "",
  variant_image: "",
  checked: false,
});
const variantInfo = props.updateVariantInfo || emptyInfo;

const imageData = (data) => {
  variantInfo.variant_image = data.url;
};

const submit = () => {
  console.log(variantInfo);
  if (isAnyObjectValueEmpty(variantInfo)) {
    submitForm.value = true;
  } else {
    emit("submitEvent", variantInfo);
  }
};
</script>

<style scoped lang="scss">
.update-variant-container {
  width: 550px;
  height: 780px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fff;
}

.variant-info-form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.update-variant-box-title {
  width: 85%;
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 23px;
  margin-top: 40px;
  margin-bottom: 10px;
  font-family: yuanti;
  font-weight: bold;

  span {
    margin: 0 10px;
  }
}

.variant-info-list {
  height: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 85%;

  .image-box {
    width: 100%;
    height: 200px;
    margin: 20px auto;
  }

  .variant-info-item {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;

    div {
      display: flex;
      width: 48%;
      flex-direction: column;
    }
  }

  .name-box,
  .btn-box {
    flex-direction: column;
  }

  .btn {
    margin-top: 10px;
    height: 45px;
  }
}

.variant-info-item {
  label {
    font-size: 15px;
    margin-bottom: 5px;
    font-family: yuanti;
  }

  input {
    outline: none;
    border: 1px solid #dbdfe9;
    height: 45px;
    text-indent: 1em;
    border-radius: 5px;
    background: transparent;
  }
}

.tips-box {
  height: 10px;
  margin-top: 5px;
  margin-left: 5px;

  .tips {
    font-size: 14px;
    color: #610000;
  }
}

.empty {
  transition: 0.2s;
  box-shadow: 0 0 3px #610000;
  border: none;
  animation: empty 0.5s ease-in;
}

@keyframes empty {
  0% {
    transform: translateX(0);
  }

  10% {
    transform: translateX(-4px);
  }

  20% {
    transform: translateX(4px);
  }

  50% {
    transform: translateX(-8px);
  }

  60% {
    transform: translateX(8px);
  }

  80% {
    transform: translateX(-4px);
  }

  90% {
    transform: translateX(4px);
  }

  100% {
    transform: translateX(0);
  }
}

.body--dark {
  .update-variant-container {
    background: rgb(26, 26, 26);
  }

  .variant-info-item {
    input {
      border: 1px solid #444;
      color: #fff;
    }
  }

  .cancel-btn {
    color: #fff;
  }

  .tips-box {
    .tips {
      font-size: 14px;
      color: #c20101;
    }
  }
}

.body--light {
  .cancel-btn {
    color: #000;
  }
}
</style>
