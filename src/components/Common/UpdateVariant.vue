<template>
  <div class="update-variant-container bg-white">
    <div class="update-variant-box-title">
      <q-icon name="edit_calendar" /><span>商品变体信息</span>
    </div>
    <form action="" class="variant-info-form" @submit="submit">
      <ul class="variant-info-list">
        <li class="image-box">
          <UploadImage :src="variantInfo.image" />
        </li>
        <li class="variant-info-item name-box">
          <label for="name">变体名称</label>
          <input type="text" name="name" placeholder="变体名称" v-model="variantInfo.name"
            :class="submitForm && !variantInfo.name ? 'empty' : ''" />
          <div class="tips-box">
            <label :for="variantInfo.name" v-if="submitForm && !variantInfo.name" class="tips">值不能为空</label>
          </div>
        </li>
        <li class="variant-info-item">
          <div>
            <label for="name">变体价格</label>
            <input type="text" name="name" placeholder="变体价格" v-model="variantInfo.price"
              :class="submitForm && !variantInfo.price ? 'empty' : ''" />
            <div class="tips-box">
              <label :for="variantInfo.price" v-if="submitForm && !variantInfo.price" class="tips">值不能为空</label>
            </div>
          </div>
          <div>
            <label for="name">变体库存</label>
            <input type="text" name="name" placeholder="变体库存" v-model="variantInfo.inventory"
              :class="submitForm && !variantInfo.inventory ? 'empty' : ''" />
            <div class="tips-box">
              <label :for="variantInfo.inventory" v-if="submitForm && !variantInfo.inventory && !0"
                class="tips">值不能为空</label>
            </div>
          </div>
        </li>
        <li class="variant-info-item">
          <div>
            <label for="name">变体类型</label>
            <input type="text" name="name" placeholder="变体类型" v-model="variantInfo.style"
              :class="submitForm && !variantInfo.style ? 'empty' : ''" />
            <div class="tips-box">
              <label :for="variantInfo.style" v-if="submitForm && !variantInfo.style" class="tips">值不能为空</label>
            </div>
          </div>
          <div>
            <label for="name">变体规格</label>
            <input type="text" name="name" placeholder="变体规格" v-model="variantInfo.options"
              :class="submitForm && !variantInfo.options ? 'empty' : ''" />
            <div class="tips-box">
              <label :for="variantInfo.options" v-if="submitForm && !variantInfo.options" class="tips">值不能为空</label>
            </div>
          </div>
        </li>
        <li class="variant-info-item btn-box">
          <q-btn color="primary" class="btn" @click="submit">提交</q-btn>
          <q-btn class="btn text-black" @click="emit('cancel')">取消</q-btn>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive } from "vue";
import UploadImage from "./UploadImage.vue";
import { isAnyObjectValueEmpty } from "src/utils/utils.js";

const props = defineProps(["updateVariantInfo"]);
const emit = defineEmits(["cancel", "addVariant"]);

const submitForm = ref(false);
const emptyInfo = reactive({
  name: "",
  price: 0,
  inventory: 0,
  style: "",
  options: "",
  checked: false,
});
const variantInfo = props.updateVariantInfo || emptyInfo;

const submit = () => {
  if (isAnyObjectValueEmpty(variantInfo)) {
    submitForm.value = true;
    console.log("有为空");
  } else {
    emit("addVariant", variantInfo);
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
</style>
