<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="step-container">
    <div class="step-items">
      <template v-for="step in steps" :key="step.ID">
        <!-- 步骤项 -->
        <div class="step-item" v-ripple:indigo-11 @click="updateStep(step.ID)">
          <div class="step-index">
            <!-- 已完成步骤 -->
            <div class="step-item-completed bg-primary text-white" v-if="index + 1 > step.ID">
              <!-- 自定义图标 -->
              <q-icon :name="step.completed" class="completed-icon" v-if="step.completed" />
              <q-icon name="done" v-else class="completed-icon" />
            </div>
            <!-- 未完成步骤 -->
            <div class="step-item-inactive" :class="index + 1 === step.ID ? 'bg-primary text-white' : 'bg-grey-12'
              " v-else>
              <q-icon :name="step.inactive" v-if="step.inactive" />
              <span v-else>{{ step.ID }}</span>
            </div>
          </div>
          <div class="step-description">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-title-description">{{ step.description }}</div>
          </div>
        </div>
        <q-icon name="chevron_right" size="25px" class="text-primary" v-if="step.ID !== steps.length" />
      </template>
      <div class="underline bg-primary" :style="{ width: underline_size, left: underline_left }"></div>
    </div>
    <div class="step-content">
      <div class="slot-content" :style="{ transform: slotTransformStyle }">
        <slot :current="index"></slot>
      </div>
    </div>
    <div class="btns">
      <q-btn class="btn bg-primary text-white q-px-lg" v-if="index + 1 !== steps.length" @click="handleNext">继续</q-btn>
      <q-btn class="btn bg-primary text-white q-px-lg" v-else @click="handleSubmitEvent">完成</q-btn>
      <q-btn class="btn text-primary" flat v-if="index !== 0" @click="prev">返回</q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps(["steps", "isEmpty"]);
const emit = defineEmits(["handleSubmitEvent"]);
const steps = props.steps;
const isEmpty = props.isEmpty;
const index = ref(0);
const underline_size = ref(
  `calc((100% - 25px * ${steps.length - 1}) / ${steps.length}`
);
const underline_left = ref(0);

// 计算属性，用于生成 transform 样式
const slotTransformStyle = computed(() => `translateX(${-100 * index.value}%)`);

// 初始化步骤 ID
let id = 1;
steps.forEach((step) => (step.ID = id++));

// 抽象出计算逻辑
const updateStyles = () => {
  underline_left.value = `calc(${underline_size.value} * ${index.value} + 25px * ${index.value})`;
};

const updateStep = (i) => {
  if (!isEmpty()) return;
  index.value = i - 1;
  updateStyles();
};

const handleNext = () => {
  if (!isEmpty()) return;
  next();
};

const next = () => {
  if (index.value < steps.length - 1) {
    index.value++;
    updateStyles();
  }
};

const prev = () => {
  if (index.value > 0) {
    index.value--;
    updateStyles();
  }
};

const handleSubmitEvent = () => {
  emit("handleSubmitEvent");
};

defineExpose({
  next,
});
</script>

<style lang="scss" scoped>
$item-height: auto;
$step-index-width: 25px;

.step-container {
  width: 100%;
  height: $item-height;
  padding: 20px 20px;
  font-family: yuanti;
  margin-bottom: 50px;
}

.step-container .step-items {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .step-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 10px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.5s;
    position: relative;

    &:hover {
      background: #f1f2fc;
    }
  }

  .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    transition: 0.3s;
  }
}

.step-item .step-index {
  width: $step-index-width;
  height: 100%;
  margin: 10px;

  div {
    width: $step-index-width;
    height: $step-index-width;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-item-completed .completed-icon {
    animation: completed 0.4s;
  }
}

.step-content {
  overflow: hidden;

  .slot-content {
    display: flex;
    transition: transform 0.5s ease;
  }
}

::v-deep .slot-content>div {
  width: 100%;
  flex: 0 0 auto;
}

@keyframes completed {
  33% {
    transform: scale(0.4);
  }

  66% {
    transform: scale(1.2);
  }

  99% {
    transform: scale(1);
  }
}

.step-item .step-description {
  height: 100%;
  font-family: yuanti;

  .step-title {
    margin-bottom: 3px;
    font-size: 15px;
  }

  .step-title-description {
    font-size: 13px;
    color: #aaa;
  }
}

.btns {
  display: flex;
  justify-content: center;

  .btn {
    margin: 0 10px;
  }
}

.body--dark {
  .step-item-inactive {
    color: #000;
  }
}
</style>
