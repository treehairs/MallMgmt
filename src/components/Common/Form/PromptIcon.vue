<template>
  <div class="container">
    <div class="prompt-icon">
      <!-- <q-icon name="priority_high" class="q-icon" /> -->
      <span>!</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .prompt-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3.5px solid #f1cd68;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      animation: swing .4s;
      font-size: 50px;
      color: #f5b913;
    }

  }
}

@keyframes swing {
  0% {
    transform: rotate(-20deg);
  }

  30% {
    transform: rotate(20deg);
  }

  60% {
    transform: rotate(-15deg);
  }

  90% {
    transform: rotate(15deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>
