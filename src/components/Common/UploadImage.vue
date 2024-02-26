<template>
  <div class="promo-image" v-bind:class="{ shadow: shadow, square: square }">
    <div class="upload-btn" v-if="!image.url">
      <label for="upload">
        <img src="/icons/add-image.png" class="image-icon" alt="" />
        <img src="/icons/add.png" alt="" class="add-icon" />
      </label>
      <input type="file" name="upload" id="upload" @change="handleUpload" accept="image/png, image/jpeg" />
    </div>
    <div class="image-box" v-else>
      <img class="image" :src="image.url" alt="" />
      <div class="close-btn" @click="clearImage">
        <div class="bg"></div>
        <img src="/icons/add.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { upload } from "src/services/api";
import { showNotif, size2Str } from "src/utils/utils.js";
import { ref } from "vue";
import { url } from "boot/axios";

const props = defineProps(["src", "shadow", "square"]);
const emit = defineEmits(["imageData"]);
const image = ref({
  url: props.src ? url + props.src : "",
  name: "",
  size: "",
});
const shadow = props.shadow;
const square = props.square;

const clearImage = () => {
  image.value.url = "";
  image.value.name = "";
  image.value.size = "";
  emit("imageData", image.value);
};

const handleUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    // image.value.url = e.target.result;
  };
  image.value.name = file.name.slice(0, file.name.lastIndexOf("."));
  image.value.size = size2Str(file.size);
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append("file", file);

  upload("/upload/1001/1002", formData)
    .then((result) => {
      // 上传成功，接收图片地址
      image.value.url = result;
      emit("imageData", image.value);

      image.value.url = url + result;
    })
    .catch((err) => showNotif("negative", "上传失败", "error")); // 上传失败
};
</script>

<style lang="scss" scoped>
.promo-image {
  width: 100%;
  height: 100%;
  border: 1px solid #f1f1f4;
  background-color: #fdfdfd;
  border-radius: 10px;
  transition: 0.2s;
  overflow: hidden;

  input[type="file"] {
    display: none;
  }

  .upload-btn {
    width: 100%;
    height: 100%;
    padding: 10px 20px;

    &:hover {
      background: #fafafa;

      .add-icon {
        opacity: 1;
        animation: add 0.5s ease-in;
      }

      .image-icon {
        opacity: 0;
        animation: scale 0.3s ease-in;
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
    transition: 0.3s;

    &:hover {
      .close-btn {
        opacity: 1;

        img {
          animation: close 0.3s ease-in;
        }

        .bg {
          opacity: 1;
        }
      }
    }

    img {
      width: 70%;
      border-radius: 5px;
      margin: 25px 0;
      position: absolute;
      max-height: 100%;
      object-fit: contain;
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
        backdrop-filter: blur(8px);
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
      color: #bbb;
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
      transition: 0.2s;
    }

    .add-icon {
      opacity: 0;
    }
  }
}

.shadow {
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.03);
}

.square {
  border-radius: 0;
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

.body--dark {
  .promo-image {
    background-color: #222222;
    border: 1px solid #444444;
  }

  .upload-btn {
    &:hover {
      background: rgb(39, 39, 39);
    }
  }
}
</style>
