<template>
  <ul class="card-item" :class="variant.checked ? 'checked' : ''">
    <li class="btns">
      <div class="btn discount-btn" @click.prevent="">
        <q-icon name="loyalty" />
      </div>
      <div class="btn update-btn" @click.prevent="UpdateVariantCard = true">
        <q-icon name="edit" />
      </div>
      <div class="btn delete-btn" @click.prevent="deleteVariant(variant.variant_id)">
        <q-icon name="close" />
      </div>
    </li>
    <li class="product-image">
      <img :src="url + variant.variant_image" alt="" />
    </li>
    <li class="product-name">{{ variant.variant_name }}</li>
    <li class="product-price">{{ variant.price }}</li>
    <li class="product-stock_quantity">
      <span class="in-stock" v-if="variant.stock_quantity">{{
        variant.stock_quantity
      }}</span>
      <span class="sold-out" v-else>售罄</span>
    </li>
    <li class="product-style">{{ variant.style }}+{{ variant.specs }}</li>
    <q-dialog v-model="UpdateVariantCard">
      <UpdateVariant @submitEvent="updateVariant" @cancel="UpdateVariantCard = false" :updateVariantInfo="variant" />
    </q-dialog>
  </ul>
</template>

<script setup>
import { url } from "boot/axios";
import { ref } from "vue";
import UpdateVariant from "src/components/Common/UpdateVariant.vue";
import { updateData } from "src/services/api";
import { showNotif } from "src/utils/utils.js";

const props = defineProps(["variant"]);
const emit = defineEmits(["deleteVariant"]);
const UpdateVariantCard = ref(false);
const variant = props.variant;

const deleteVariant = (variant_id) => {
  emit("deleteVariant", variant_id);
  variant.checked = true;
};

const updateVariant = (variant) => {
  console.log(variant);
  variant.checked = true;
  if (updateData(`/variants/${variant.variant_id}`, variant))
    showNotif("positive", "修改成功");
  UpdateVariantCard.value = false;
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

.card-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style: none;
  width: 230px;
  height: 300px;
  background: #fdfdfd;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
  overflow: hidden;

  $border-color: #f0f0f0;
  $border-width: 2px;

  &::before {
    content: "";
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px;
    border-left: $border-width solid $border-color;
    border-top: $border-width solid $border-color;
    transition: 0.3s;
    z-index: 1;
  }

  &::after {
    content: "";
    width: 60px;
    height: 60px;
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: 8px;
    border-right: $border-width solid $border-color;
    border-bottom: $border-width solid $border-color;
    transition: 0.3s;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-10px);

    .btns {
      top: 0;
      right: 0;
    }
  }
}

.checked {

  &::before,
  &::after {
    width: 100%;
    height: 100%;
    border-color: var(--primary);
    box-shadow: 0 0 10px #eee;
  }

  .btns div {
    background: var(--primary);
    transition-delay: 0.2s;
    color: #fff;

    &:hover {
      background: #313bf8;
    }
  }
}

.btns {
  position: absolute;
  top: -30px;
  right: 0;
  transition: 0.2s;
  display: flex;
  z-index: 999;

  div {
    font-size: 15px;
    // background: #f0f0f0;
    padding: 4px 7px;
    color: rgb(134, 134, 134);
    transition: 0.2s;

    &:first-child {
      // border-top-right-radius: 8px;
      border-bottom-left-radius: 8px;
    }
  }

  @mixin set-btn-color($color) {

    // background: $bg;
    &:hover {
      background: darken($color, $amount: 10%);
      color: #fff;
    }
  }

  .discount-btn {
    $bg: #dba8e4;
    @include set-btn-color($bg);
  }

  .delete-btn {
    $bg: #ff7474;
    @include set-btn-color($bg);
  }

  .update-btn {
    $bg: #bcbffc;
    @include set-btn-color($bg);
  }
}

.product-image {
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    border-radius: 8px;
  }
}

.product-name {
  margin-top: 10px;
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: yuanti;
  font-weight: bold;
}

.product-price {
  height: 30px;
  display: flex;
  align-items: center;
  color: red;
  font-weight: bold;
  font-size: 25px;

  &::before {
    content: "￥";
    font-size: 16px;
    align-self: end;
  }
}

.product-stock_quantity {
  margin-top: 5px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;

  .sold-out {
    color: red;
  }
}

.product-style {
  margin-top: 5px;
  font-size: 14px;
}

.body--dark {
  .card-item {
    background: rgb(31, 31, 31);
    $border-color: #333;
    $border-width: 2px;

    &::before {
      border-left: $border-width solid $border-color;
      border-top: $border-width solid $border-color;
    }

    &::after {
      border-right: $border-width solid $border-color;
      border-bottom: $border-width solid $border-color;
    }
  }

  .checked {

    &::before,
    &::after {
      border-color: var(--primary);
      box-shadow: 0 0 10px rgb(31, 31, 31);
    }

    .btns div {
      background: var(--primary);
    }
  }
}
</style>
