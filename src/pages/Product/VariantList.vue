<template>
  <div class="variants-box">
    <div class="header">
      <span class="header-title">商品变体列表</span>
      <q-btn size="15px" :class="allSelectedStatus ? 'text-white' : 'text-black'" unelevated @click="allSelected"
        :color="allSelectedStatus ? 'primary' : 'grey-1'">全选</q-btn>
      <q-btn color="accent" icon="loyalty" size="13px" class="btn set-discount-btn" :disable="!checkedVariant">
        <q-tooltip>批量设置折扣</q-tooltip>
      </q-btn>
      <q-btn color="negative" icon="delete_sweep" size="15px" class="btn delete-btn" :disable="!checkedVariant" @click="
        deleteEventConfirm = true;
      deleteVariantID = 0;
      ">
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

    <q-dialog v-model="UpdateVariantCard">
      <UpdateVariant @addVariant="addVariant" @cancel="UpdateVariantCard = false"
        :updateVariantInfo="updateVariantInfo" />
    </q-dialog>
  </div>
</template>

<script setup>
import VariantCard from "src/components/Common/VariantCard.vue";
import { deleteData, fetchData } from "src/services/api";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const variants = ref([]);
const allSelectedStatus = ref(false);
const deleteEventConfirm = ref(false);
const checkedVariant = ref(false);
const deleteVariantID = ref(0);
const param = ref();
const route = useRoute();

/**
 * 获取数据
 */
const fetchDataAndSetRows = async () => {
  try {
    const data = await fetchData("/variants");
    console.log(data);
    variants.value = data.data.filter(
      (item) => item.product_id === +param.value
    );
  } catch (error) {
    console.error("请求失败:", error);
    variants.value = [];
    return false;
  } finally {
    // productsReady.value = true;
  }
  return true;
};

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

const deleteEvent = () => {
  if (deleteVariantID.value) {
    deleteDataEvent([deleteVariantID.value]);
  } else {
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

const updateVariant = (variant_id) => {
  UpdateVariantCard.value = true;
  updateVariantInfo.value = variants.value.find(
    (item) => item.variant_id === variant_id
  );
};

const addVariant = (variant) => {
  variants.value.push(variant);
  UpdateVariantCard.value = false;
  showNotif("positive", "成功添加", "check");
};

onMounted(() => {
  fetchDataAndSetRows();
  param.value = route.params.id;
});
</script>

<style lang="scss" scoped>
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
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 5px;
  justify-content: center;
  justify-items: center;
  grid-gap: 50px 0;
  transition: 0.2s;
  grid-auto-flow: dense;
}
</style>
