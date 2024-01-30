<template>
  <div>
    <Stepper :steps="steps" ref="StepperRef" @submitForm="submitForm">
      <template v-slot:default="{ current }">
        <div class="container" :id="current">
          <div class="left">
            <div class="promo-image">
              <div class="upload-btn" v-if="!image.url">
                <label for="upload">
                  <img src="/icons/add-image.png" class="image-icon" alt="">
                  <img src="/icons/add.png" alt="" class="add-icon">
                </label>
                <input type="file" name="upload" id="upload" @change="handleUpload" accept="image/png, image/jpeg">
              </div>
              <div class="image-box" v-else>
                <img class="image" :src="image.url" alt="">
                <div class="close-btn" @click="clearImage">
                  <div class="bg"></div>
                  <img src="/icons/add.png" alt="">
                </div>
              </div>
            </div>
            <div class="product-status">
              <div class="status-info">
                <span class="text">{{ status }}</span>
                <span class="status-dot" :class="statusColor"></span>
              </div>
              <div class="select-list">
                <ul>
                  <li @click="updateStatus('在售')" :class="{ 'text-green': status === '在售' }">在售<q-icon name="done"
                      v-if="status === '在售'" /></li>
                  <li @click="updateStatus('下架')" :class="{ 'text-red': status === '下架' }">下架<q-icon name="done"
                      v-if="status === '下架'" /></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="right">
            <p class="title">主体商品信息编辑</p>
            <form action="/abc" ref="productForm" @submit.prevent="submitForm">
              <!-- 商品信息编辑 -->
              <ul class="product-info-list">
                <li class="product-info-item">
                  <label for="pid" class="product-info-label">商品编号</label>
                  <input type="text" name="pid" value="1001" disabled class="product-info-input" placeholder="商品编号">
                  <div class="tips-box"></div>
                </li>
                <li class="product-info-item" v-for="item in form" :key="item.index">
                  <label :for="item.key" class="product-info-label">{{ item.title }}</label>
                  <input type="text" :name="item.key" v-model="formData[item.key]" :required="item.required"
                    :readonly="item.readonly" class="product-info-input"
                    :class="valueChecked && !formData[item.key] ? 'empty' : ''" :placeholder="item.title">
                  <div class="tips-box"><label :for="item.key" v-if="valueChecked && !formData[item.key]"
                      class="tips">值不能为空</label></div>
                </li>
                <li class="product-info-item">
                  <label for="description" class="product-info-label">商品描述</label>
                  <q-editor v-model="editor" min-height="10rem" />
                  <div class="tips-box"></div>
                </li>
                <li class="product-info-item">
                  <label for="created-at" class="product-info-label">创建时间</label>
                  <input type="text" name="created-at" disabled class="product-info-input" placeholder="商品编号">
                  <div class="tips-box"></div>
                </li>
                <li class="product-info-item">
                  <label for="updated-at" class="product-info-label">最后更新</label>
                  <input type="text" name="updated-at" disabled class="product-info-input" placeholder="商品编号">
                  <div class="tips-box"></div>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup>
import Stepper from "src/components/Common/Stepper.vue";
import { isAnyObjectValueEmpty } from "src/utils/utils.js";
import { ref, computed, reactive } from "vue";

const steps = [
  {
    title: '商品编辑',
    description: '主体商品信息',
    inactive: 'home'
  },
  {
    title: '变体编辑',
    description: '变体商品信息'
  }
]

const form = [
  {
    title: '商品名称',
    key: 'productName',
    required: true
  },
  {
    title: '商品分类',
    key: 'category',
    required: true
  }
]

const defaultStatus = ref('在售')
const options = ['在售', '下架']
const StepperRef = ref()
const status = ref(defaultStatus.value)
const step = ref(1)
const image = ref({ url: '', name: '', size: 0 })
const valueChecked = ref(false)
const formData = reactive({
  productID: '',
  productName: '',
  category: ''
});

const handleUpload = (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    image.value.url = e.target.result
  }
  image.value.name = file.name.slice(0, file.name.lastIndexOf('.'))
  image.value.size = file.size
  reader.readAsDataURL(file)
}

const submitForm = () => {
  valueChecked.value = true
  // 在这里执行父组件表单提交逻辑
  console.log('父组件表单提交', formData);
  // 执行表单提交的其他逻辑...
  if (isAnyObjectValueEmpty(formData)) {
    alert("不能有空值")
    return
  }
  StepperRef.value.next()
};

const clearImage = () => {
  image.value.url = ''
}

const updateStatus = (newStatus) => {
  status.value = newStatus
}

const statusColor = computed(() => {
  return status.value === '在售' ? 'green' : 'red'
})
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

input[type="file"] {
  display: none;
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
    border: 1px solid #F1F1F4;
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

.promo-image {
  width: 100%;
  height: 350px;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F1F4;
  background-color: #fdfdfd;
  border-radius: 10px;
  transition: .2s;

  .upload-btn {
    width: 100%;
    height: 100%;
    padding: 10px 20px;

    &:hover {
      background: #f5f5f5;

      .add-icon {
        opacity: 1;
        animation: add .5s ease-in;
      }

      .image-icon {
        opacity: 0;
        animation: scale .3s ease-in;
      }
    }

    .image-icon {
      width: 200px;
    }
  }

  .image-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    transition: .3s;

    &:hover {
      .close-btn {
        opacity: 1;

        img {
          animation: close .3s ease-in;
        }

        .bg {
          opacity: 1;
        }
      }
    }

    img {
      width: 60%;
      border-radius: 5px;
      margin: 25px 0;
      position: absolute;
    }

    .close-btn {
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .bg {
        opacity: 0;
        background: rgba($color: #f5f5f5, $alpha: .7);
        width: 100%;
        height: 100%;
        position: absolute;
        transition: 1s;
      }

      img {
        width: 40%;
        position: absolute;
        transform: rotate(45deg);
      }
    }

    .name {
      font-size: 18px;
      font-family: yuanti;
    }

    .size {
      font-size: 12px;
      color: #bbb
    }
  }

  label {
    display: block;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    cursor: pointer;
    align-items: center;
    position: relative;

    img {
      width: 100px;
      position: absolute;
      transition: .2s;
    }

    .add-icon {
      opacity: 0;
    }
  }


}

.product-status {
  width: 100%;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F1F4;
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
      background: radial-gradient(circle, #17C653 20%, lighten(#17C653, 45%) 60%, transparent 90%);
    }

    .status-dot.red {
      background: radial-gradient(circle, #F8285A 20%, lighten(#F8285A, 45%) 60%, transparent 90%);
    }
  }

  .select-list {
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    transform: translateY(-100%);
    position: absolute;
    transition: .2s;

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

.product-status:hover {
  .select-list {
    transition-delay: .3s;
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
    border: 1px solid #DBDFE9;
    height: 45px;
    text-indent: 1em;
    border-radius: 5px;
  }
}

.empty {
  box-shadow: 0 0 3px #610000;
  border: none;
  animation: empty .5s ease-in;
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

@keyframes scale {
  to {
    transform: scale(0);
  }
}

@keyframes add {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1) rotate(180deg);
  }
}

@keyframes close {
  from {
    transform: scale(0) translateY(100px);
  }

  to {
    transform: scale(1) rotate(135deg) translateY(0);
  }
}
</style>
