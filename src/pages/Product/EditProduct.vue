<template>
  <div>
    <Stepper :steps="steps" :isEmpty="isEmpty">
      <template v-slot:default="{ current }">
        <div class="container" :id="current">
          <div class="left">
            <div class="promo-image">
              <UploadImage />
            </div>
            <div class="product-status">
              <div class="status-info">
                <span class="text">{{ status }}</span>
                <span class="status-dot" :class="statusColor"></span>
              </div>
              <div class="select-list">
                <ul>
                  <li @click="updateStatus('在售')" :class="{ 'text-green': status === '在售' }">
                    在售<q-icon name="done" v-if="status === '在售'" />
                  </li>
                  <li @click="updateStatus('下架')" :class="{ 'text-red': status === '下架' }">
                    下架<q-icon name="done" v-if="status === '下架'" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="right">
            <p class="title">主体商品信息编辑</p>
            <form action="/abc" ref="productForm" @submit.prevent="submitForm">
              <!-- 商品信息编辑 -->
              <ul class="product-info-list">
                <li class="product-info-item" v-for="item in form" :key="item.index">
                  <label :for="item.key" class="product-info-label">{{
                    item.title
                  }}</label>
                  <input type="text" :name="item.key" v-model="formData[item.key]" :required="item.required"
                    :readonly="item.readonly" :disabled="item.disabled" class="product-info-input"
                    :class="valueChecked && !formData[item.key] ? 'empty' : ''" :placeholder="item.title" />
                  <div class="tips-box">
                    <label :for="item.key" v-if="valueChecked && !formData[item.key]" class="tips">值不能为空</label>
                  </div>
                </li>
                <li class="product-info-item">
                  <label for="description" class="product-info-label">商品描述</label>
                  <q-editor v-model="formData.description" placeholder="请输入商品描述" min-height="10rem"
                    :class="valueChecked && !formData.description ? 'empty' : ''" />
                  <div class="tips-box">
                    <label for="description" v-if="valueChecked && !formData.description" class="tips">值不能为空</label>
                  </div>
                </li>
                <li class="product-info-item">
                  <label for="created-at" class="product-info-label">创建时间</label>
                  <input type="text" name="created-at" disabled class="product-info-input" placeholder="商品编号" />
                  <div class="tips-box"></div>
                </li>
                <li class="product-info-item">
                  <label for="updated-at" class="product-info-label">最后更新</label>
                  <input type="text" name="updated-at" disabled class="product-info-input" placeholder="商品编号" />
                  <div class="tips-box"></div>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div class="variants-box">
          <div class="header">
            <span class="header-title">商品变体列表</span>
            <q-btn size="15px" :class="allSelectedStatus ? 'text-white' : 'text-black'" unelevated @click="allSelected"
              :color="allSelectedStatus ? 'primary' : 'grey-1'">全选</q-btn>
            <q-btn color="accent" icon="loyalty" size="13px" class="btn set-discount-btn" :disable="!checkedVariant">
              <!-- <span>折扣</span> -->
              <q-tooltip>批量设置折扣</q-tooltip>
            </q-btn>
            <q-btn color="negative" icon="delete_sweep" size="15px" class="btn delete-btn" :disable="!checkedVariant"
              @click="
                deleteEventConfirm = true;
              deleteVariantID = 0;
              ">
              <!-- <span>删除</span> -->
              <q-tooltip>批量删除</q-tooltip>
            </q-btn>
            <q-btn color="primary" icon="add" size="15px" class="btn add-variant-btn" @click="updateVariant(0)">
              <q-tooltip>添加商品变体</q-tooltip>
            </q-btn>
          </div>
          <div class="variants">
            <transition-group name="slide">
              <template v-for="variant in variants" :key="variant">
                <VariantCard :variant="variant" @deleteVariant="deleteVariant" @updateVariant="updateVariant"
                  @click="handleClickVariant(variant)" />
              </template>
            </transition-group>
          </div>
        </div>
      </template>
    </Stepper>
    <q-dialog v-model="deleteEventConfirm">
      <PromptBox @cancel="deleteEventConfirm = false" @deleteEvent="deleteEvent"></PromptBox>
    </q-dialog>
    <q-dialog v-model="UpdateVariantCard">
      <UpdateVariant @addVariant="addVariant" @cancel="UpdateVariantCard = false"
        :updateVariantInfo="updateVariantInfo" />
    </q-dialog>
  </div>
</template>

<script setup>
import Stepper from "src/components/Common/Stepper.vue";
import VariantCard from "src/components/Common/VariantCard.vue";
import UpdateVariant from "src/components/Common/UpdateVariant.vue";
import UploadImage from "src/components/Common/UploadImage.vue";
import PromptBox from "src/components/Common/Form/PromptBox.vue";
import { isAnyObjectValueEmpty } from "src/utils/utils.js";
import { deleteData, fetchData } from "src/services/api";
import { ref, computed, reactive, watch, onMounted } from "vue";
import { showNotif } from "src/utils/utils.js";
import { useRoute } from "vue-router";

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
const steps = [
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
    disabled: route.params.id
  },
  {
    title: "商品名称",
    key: "product_name",
    required: true,
  },
  {
    title: "商品分类",
    key: "category",
    required: true,
  }
];

const formData = ref({
  product_id: route.params.id || "",
  product_name: "",
  category: "",
  description: ""
});

// 监视数组对象里面的checked属性
watch(
  variants,
  (newItems, oldItems) => {
    const checkedItem = newItems.find((item) => item.checked === true);
    checkedVariant.value = checkedItem;
  },
  { deep: true }
);

const handleClickVariant = (variant) => {
  const clickedVariant = variants.value.find(
    (item) => item.variant_id === variant.variant_id
  );
  clickedVariant.checked = !clickedVariant.checked;
};

const allSelected = () => {
  allSelectedStatus.value = !allSelectedStatus.value;

  variants.value.map((item) => {
    item.checked = allSelectedStatus.value;
  });
};

/**
 * 获取数据
 */
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/variants");
    variants.value = data.data.filter(
      (item) => item.product_id === +route.params.id
    );
  } catch (error) {
    console.error("请求失败:", error.code);
    variants.value = [];
    return false;
  } finally {
    // productsReady.value = true;
  }
  return true;
};

/**
 * 子组件调用方法
 */
const deleteVariant = (variant_id) => {
  deleteEventConfirm.value = true;
  deleteVariantID.value = variant_id;
};

const updateVariant = (variant_id) => {
  UpdateVariantCard.value = true;
  updateVariantInfo.value = variants.value.find(
    (item) => item.variant_id === variant_id
  );
};

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
  } else {
    showNotif("warning", "删除失败");
  }
  deleteEventConfirm.value = false;
};

const addVariant = (variant) => {
  variants.value.push(variant);
  UpdateVariantCard.value = false;
  showNotif("positive", "成功添加", "check");
};

const isEmpty = () => {
  if (isAnyObjectValueEmpty(formData.value)) {
    showNotif("black", "信息未填写", "warning");
    valueChecked.value = true;
    return false;
  }
  return true;
};

const updateStatus = (newStatus) => {
  status.value = newStatus;
};

const statusColor = computed(() => {
  return status.value === "在售" ? "green" : "red";
});

onMounted(fetchDataAndSetRows);
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
  height: 70px;
  overflow: hidden;
  position: relative;

  .status-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 40px;
    height: 100%;
    position: absolute;

    .text {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 18px;
      font-family: yuanti;
    }

    .status-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      animation: blink 3s infinite;
    }

    .status-dot.green {
      background: radial-gradient(circle,
          #17c653 20%,
          lighten(#17c653, 45%) 60%,
          transparent 90%);
    }

    .status-dot.red {
      background: radial-gradient(circle,
          #f8285a 20%,
          lighten(#f8285a, 45%) 60%,
          transparent 90%);
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

.promo-image {
  width: 100%;
  height: 350px;
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
  .product-status {
    border: 1px solid #444444;
  }
}
</style>
