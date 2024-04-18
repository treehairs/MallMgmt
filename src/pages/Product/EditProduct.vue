<template>
  <div>
    <Stepper
      :steps="steps"
      :isEmpty="isEmpty"
      @handleSubmitEvent="handleSubmitEvent"
    >
      <template v-slot:default="{ current }">
        <div class="container" :id="current">
          <div class="left">
            <div class="promo-image-box">
              <div class="promo-image-title">宣传图编辑</div>
              <div class="promo-image">
                <UploadImage
                  @imageData="handleUploadImage"
                  :src="formData.promo_image"
                  square="true"
                />
              </div>
              <div class="promo-image-info">
                <span>{{ image_info.name }}</span>
                <span>{{ image_info.size }}</span>
              </div>
            </div>
            <div class="product-status">
              <div class="status-header">
                <span class="status-title">商品状态</span>
                <div class="status-dot" :class="statusColor">
                  <div class="status-dot-point"></div>
                </div>
              </div>
              <div class="status-info">
                <SelectInput
                  :data="product_status_list"
                  filterConditions="status"
                  :default_value="formData.product_status"
                  single_choice="true"
                  @selectedData="selectedData"
                  hide_close_icon="true"
                >
                </SelectInput>
              </div>
            </div>
          </div>
          <div class="right">
            <p class="title">主体商品信息编辑</p>
            <form action="/abc" ref="productForm" @submit.prevent="submitForm">
              <!-- 商品信息编辑 -->
              <ul class="product-info-list">
                <li
                  class="product-info-item"
                  v-for="item in form"
                  :key="item.index"
                >
                  <label :for="item.key" class="product-info-label">{{
                    item.title
                  }}</label>
                  <input
                    type="text"
                    :name="item.key"
                    v-model="formData[item.key]"
                    :required="item.required"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    class="product-info-input"
                    :class="valueChecked && !formData[item.key] ? 'empty' : ''"
                    :placeholder="item.title"
                  />
                  <div class="tips-box">
                    <label
                      :for="item.key"
                      v-if="valueChecked && !formData[item.key]"
                      class="tips"
                      >值不能为空</label
                    >
                  </div>
                </li>
                <li class="product-info-item">
                  <label for="description" class="product-info-label"
                    >商品描述</label
                  >
                  <q-editor
                    v-model="formData.description"
                    placeholder="请输入商品描述"
                    min-height="10rem"
                    :class="
                      valueChecked && !formData.description ? 'empty' : ''
                    "
                  />
                  <div class="tips-box">
                    <label
                      for="description"
                      v-if="valueChecked && !formData.description"
                      class="tips"
                      >值不能为空</label
                    >
                  </div>
                </li>
                <li class="product-info-item">
                  <label for="created-at" class="product-info-label"
                    >创建时间</label
                  >
                  <input
                    type="text"
                    name="created-at"
                    disabled
                    v-model="formData.created_at"
                    class="product-info-input"
                    placeholder="商品编号"
                  />
                  <div class="tips-box"></div>
                </li>
                <li class="product-info-item">
                  <label for="updated-at" class="product-info-label"
                    >最后更新</label
                  >
                  <input
                    type="text"
                    name="updated-at"
                    disabled
                    v-model="formData.updated_at"
                    class="product-info-input"
                    placeholder="商品编号"
                  />
                  <div class="tips-box"></div>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div class="variants-box">
          <div class="header">
            <span class="header-title">商品变体列表</span>
            <q-btn
              size="15px"
              class="all-selected-btn"
              :class="allSelectedStatus ? 'checked' : ''"
              unelevated
              @click="allSelected"
              >全选</q-btn
            >
            <q-btn
              color="accent"
              icon="loyalty"
              size="13px"
              class="btn set-discount-btn"
              :disable="!checkedVariant"
            >
              <!-- <span>折扣</span> -->
              <q-tooltip>批量设置折扣</q-tooltip>
            </q-btn>
            <q-btn
              color="negative"
              icon="delete_sweep"
              size="15px"
              class="btn delete-btn"
              :disable="!checkedVariant"
              @click="
                deleteEventConfirm = true;
                deleteVariantID = 0;
              "
            >
              <!-- <span>删除</span> -->
              <q-tooltip>批量删除</q-tooltip>
            </q-btn>
            <q-btn
              color="primary"
              icon="add"
              size="15px"
              class="btn add-variant-btn"
              @click="updateVariant(0)"
            >
              <q-tooltip>添加商品变体</q-tooltip>
            </q-btn>
          </div>
          <div class="variants" v-if="variants.length">
            <transition-group name="slide">
              <template v-for="variant in variants" :key="variant">
                <VariantCard
                  :variant="variant"
                  @deleteVariant="deleteVariant"
                  @updateVariant="updateVariant"
                  @click="handleClickVariant(variant)"
                />
              </template>
            </transition-group>
          </div>
          <div class="empty-box" v-else>
            <EmptyBox />
          </div>
        </div>
      </template>
    </Stepper>
    <q-dialog v-model="deleteEventConfirm">
      <PromptBox
        @cancel="deleteEventConfirm = false"
        @deleteEvent="deleteEvent"
      ></PromptBox>
    </q-dialog>
    <q-dialog v-model="UpdateVariantCard">
      <UpdateVariant
        @submitEvent="addVariant"
        @cancel="UpdateVariantCard = false"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import Stepper from "src/components/Common/Stepper.vue";
import VariantCard from "src/components/Common/VariantCard.vue";
import UpdateVariant from "src/components/Common/UpdateVariant.vue";
import UploadImage from "src/components/Common/UploadImage.vue";
import EmptyBox from "src/components/Common/EmptyBox.vue";
import SelectInput from "src/components/Common/Form/SelectInput.vue";
import PromptBox from "src/components/Common/Form/PromptBox.vue";
import { isAnyObjectValueEmpty, logger, showNotif } from "src/utils/utils.js";
import { deleteData, fetchData, updateData } from "src/services/api";
import { product_status_list } from "src/data/statusColor";
import { ref, computed, reactive, watch, onMounted, inject } from "vue";
import { Decrypt } from "src/utils/secret";
import { useRoute, useRouter } from "vue-router";

const variants = ref([]);
const allSelectedStatus = ref(false);
const defaultStatus = ref("在售");
const status = ref(defaultStatus.value);
const valueChecked = ref(false);
const deleteEventConfirm = ref(false);
const UpdateVariantCard = ref(false);
const updateVariantInfo = ref({});
const checkedVariant = ref(false);
const deleteVariantID = ref(0);
const route = useRoute();
const router = useRouter();
const image_info = ref({
  name: "",
  size: "",
});
let steps = [
  {
    title: "商品编辑",
    description: "主体商品信息",
    inactive: "home",
  },
  {
    title: "变体编辑",
    description: "变体商品信息",
  },
];

const form = [
  {
    title: "商品编号",
    key: "product_id",
    required: true,
    disabled: true,
  },
  {
    title: "商品名称",
    key: "product_name",
    required: true,
  },
  {
    title: "商品分类",
    key: "category_name",
    required: true,
  },
];

const formData = computed(() => {
  const ciphertext = route.query.p.split(" ").join("+");
  return Decrypt(ciphertext);
});

const statusColor = ref(
  product_status_list.find(
    (item) => item.status === formData.value.product_status
  ).color
);

// 监视数组对象里面的checked属性
watch(
  variants,
  (newItems, oldItems) => {
    const checkedItem = newItems.find((item) => item.checked === true);
    checkedVariant.value = checkedItem;
  },
  { deep: true }
);

// 变体卡片点击事件
const handleClickVariant = (variant) => {
  const clickedVariant = variants.value.find(
    (item) => item.variant_id === variant.variant_id
  );
  clickedVariant.checked = !clickedVariant.checked;
};

// 全选按钮
const allSelected = () => {
  allSelectedStatus.value = !allSelectedStatus.value;

  variants.value.map((item) => {
    item.checked = allSelectedStatus.value;
  });
};

// 获取子组件传递的statu值
const selectedData = (data) => {
  formData.value.product_status = data[0];
  statusColor.value = product_status_list.find(
    (item) => item.status === formData.value.product_status
  ).color;
};

/**
 * 获取数据
 */
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData(`/variants?pid=${+route.params.id}`);
    console.log(data);
    variants.value = data.data;
  } catch (error) {
    console.error("请求失败:", error);
    variants.value = [];
    return false;
  } finally {
    // productsReady.value = true;
  }
  return true;
};

/**
 * 单卡片删除
 */
const deleteVariant = (variant_id) => {
  deleteEventConfirm.value = true;
  deleteVariantID.value = variant_id;
};

// 卡片修改事件
const updateVariant = (variant_id) => {
  UpdateVariantCard.value = true;
  updateVariantInfo.value = variants.value.find(
    (item) => item.variant_id === variant_id
  );
};

// 删除事件
const deleteEvent = () => {
  if (deleteVariantID.value) {
    // 单数据删除
    deleteDataEvent([deleteVariantID.value]);
  } else {
    // 多数据删除
    const checked_data_arr = variants.value
      .filter((item) => item.checked === true)
      .map((item) => item.variant_id);
    deleteDataEvent(checked_data_arr);
  }
};

const deleteDataEvent = async (data) => {
  const result = await deleteData("/variants", data);
  if (result) {
    fetchDataAndSetRows();
    showNotif("positive", "成功删除");
    logger("商品模块", "删除", "删除商品", "DELETE");
  } else {
    showNotif("warning", "删除失败");
  }
  deleteEventConfirm.value = false;
};

// 添加商品
const addVariant = (variant) => {
  variant.product_id = +route.params.id;
  updateData("/variants", variant)
    .then((res) => {
      showNotif("positive", "成功添加", "check");
      logger("商品模块", "添加", "删除变体", "POST");
      fetchDataAndSetRows();
    })
    .catch((err) => {
      showNotif("warning", "添加失败");
    });
  // variants.value.push(variant);
  UpdateVariantCard.value = false;
};

// 判断数据是否为空
const isEmpty = () => {
  if (isAnyObjectValueEmpty(formData.value)) {
    console.log(formData.value);
    showNotif("black", "信息未填写", "warning");
    valueChecked.value = true;
    return false;
  }
  return true;
};

// 处理上传图像数据
const handleUploadImage = (data) => {
  formData.value.promo_image = data.url;
  image_info.value.name = data.name;
  image_info.value.size = data.size;
};

// 完成编辑
const handleSubmitEvent = () => {
  if (updateData("/products/" + formData.value.product_id, formData.value)) {
    showNotif("positive", "修改成功");
    logger("商品模块", "修改", "修改商品", "POST");
    router.push("/product");
  } else {
    showNotif("warning", "修改失败");
  }
};

onMounted(() => {
  fetchDataAndSetRows();
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.slide-enter-active {
  animation: slide-in 0.3s ease-out;
}

.slide-leave-active {
  opacity: 0;
  animation: slide-out 0.3s ease-out;
  /* 这里在离开的时候，需要让这个元素脱离标准流，不然后面的元素动不了 */
  position: absolute;
}

/* 想要让动画平滑一点，需要加v-move的类名，v-可以别name的值 */
// .slide-move {
// transition: all 1s;
// }

@keyframes slide-in {
  from {
    transform: translateY(50px);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(50px);
  }
}

.container {
  // width: 100%;
  padding: 30px 20px;
  display: flex;
  overflow-x: auto;

  .left {
    max-width: 300px;
    min-width: 300px;
    margin: 0 30px;
  }

  .right {
    min-width: 600px;
    margin: 0 30px;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
    border: 1px solid #f1f1f4;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .left,
  .right {
    flex: 1;
  }
}

.title {
  font-size: 20px;
  box-sizing: border-box;
  margin-top: 30px;
  margin-left: 30px;
  font-weight: bold;
}

.product-status {
  width: 100%;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f1f4;
  margin-top: 30px;
  border-radius: 10px;
  height: 120px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  padding: 15px;

  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    $status-dot-size: 11px;

    .status-dot {
      width: $status-dot-size;
      height: $status-dot-size;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @mixin flicker($color) {
      background: $color;

      &::before {
        content: "";
        display: block;
        width: $status-dot-size;
        height: $status-dot-size;
        border-radius: 50%;
        opacity: 0.7;
        background: radial-gradient(
          circle at center,
          $color 0%,
          transparent 100%
        );
        animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
      }
    }

    @keyframes scale {
      0% {
        transform: scale(1);
      }

      40%,
      75% {
        transform: scale(2.5);
      }

      78%,
      100% {
        opacity: 0;
      }
    }

    .status-dot.green {
      @include flicker(#49c617);
    }

    .status-dot.red {
      @include flicker(#f8285a);
    }

    .status-dot.yellow {
      @include flicker(#f8d228);
    }
  }

  .status-info {
    width: 100%;

    .text {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 18px;
      font-family: yuanti;
    }
  }

  .select-list {
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    transform: translateY(-100%);
    position: absolute;
    transition: 0.2s;

    ul {
      height: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 18px;

      li {
        cursor: pointer;
      }
    }
  }
}

.promo-image-box {
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f1f4;
  border-radius: 10px;

  .promo-image-title,
  .promo-image-info {
    width: 100%;
    height: 50px;
    display: flex;
    // justify-content: center;
    align-items: center;
    padding: 0 15px;
  }

  .promo-image {
    width: 100%;
    height: 350px;
  }

  .promo-image-info {
    justify-content: space-between;
  }
}

.product-status:hover {
  .select-list {
    transition-delay: 0.3s;
    transform: translateY(0);
  }
}

.product-info-list {
  width: 100%;
  height: 100%;
  list-style: none;
  margin: 0;
  padding: 10px 40px;

  .product-info-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 10px;
  }
}

.product-info-item {
  label {
    font-size: 14px;
    margin-bottom: 10px;
  }

  input {
    outline: none;
    border: 1px solid #dbdfe9;
    background: transparent;
    height: 45px;
    text-indent: 1em;
    border-radius: 5px;
  }
}

.empty {
  box-shadow: 0 0 3px #610000;
  border: none;
  animation: empty 0.5s ease-in;
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

.variants-box {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  .header {
    width: 100%;
    padding: 0 70px;
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;

    .btn {
      margin-left: 10px;
    }

    .add-variant-btn {
      width: 90px;
      height: 40px;
    }

    // .set-discount-btn {
    // }
    .all-selected-btn {
      background: #fafafa;
      color: #000;
    }

    .all-selected-btn.checked {
      background: var(--primary);
      color: #fff;
    }

    .delete-btn {
      span {
        margin-left: 5px;
      }
    }

    .header-title {
      margin-right: auto;
      font-size: 22px;
      font-weight: bold;
      padding-left: 15px;
      border-left: 4px solid var(--primary);
    }
  }
}

.variants {
  width: 100%;
  max-height: 830px;
  overflow-y: scroll;
  padding: 20px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 5px;
  justify-content: center;
  justify-items: center;
  grid-gap: 50px 0;
  transition: 0.2s;
  grid-auto-flow: dense;
  margin: 20px 0;
}

.empty-box {
  width: 100%;
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
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

@keyframes blink {
  0% {
    opacity: 0.2;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}

.body--dark {
  $border-color: #444;
  $input-bg: #2f2f2f;

  .product-status {
    border: 1px solid $border-color;
  }

  .right {
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
    border: 1px solid $border-color;
  }

  .promo-image-box {
    border: 1px solid $border-color;
  }

  .product-info-item {
    input {
      border: 1px solid $border-color;
    }
  }

  .product-info-item {
    input {
      color: #fff;
    }
  }

  .variants-box .header .all-selected-btn {
    background: #222;
    color: #fff;
  }

  .variants-box .header .checked {
    background: var(--primary);
  }

  .tips-box {
    .tips {
      font-size: 14px;
      color: #c20101;
    }
  }
}
</style>
