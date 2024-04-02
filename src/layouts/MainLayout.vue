<template>
  <div>
    <q-layout
      view="lHh Lpr lff"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated class="header">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <div class="avatar">
            <img
              src="/images/products/Ragdolls/可爱柴犬布偶/可爱柴犬布偶.png"
              alt=""
            />
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :width="230" :breakpoint="500">
        <q-toolbar class="absolute-top shadow-3 toolbar">
          <q-toolbar-title class="text-white"
            ><img src="/images/logo.png" class="logo"
          /></q-toolbar-title>
        </q-toolbar>
        <q-scroll-area style="height: calc(100% - 70px); margin-top: 70px">
          <q-list>
            <q-expansion-item
              v-for="m in expansion_item"
              class="text-grey-7 q-py-xs"
              active-class="text-white"
              group="module"
              :key="m.index"
              :icon="m.icon"
              :label="m.label"
              :default-opened="m.default_opened"
            >
              <div>
                <q-list class="rounded-borders text-grey-6">
                  <q-item
                    clickable
                    v-ripple
                    v-for="i in m.item"
                    :key="i.index"
                    :active="link === i.link"
                    :to="i.to"
                    @click="link = i.link"
                  >
                    <q-item-section>{{ i.label }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-expansion-item>
          </q-list>
          <div class="bottom">
            <div class="change">
              <span>切换模式</span>
              <div>
                <q-toggle
                  v-model="visible"
                  @click="$q.dark.toggle()"
                ></q-toggle>
              </div>
            </div>
            <div class="log-out">
              <span>退出登录</span>
              <div class="log-out-icon">
                <q-icon name="logout"></q-icon>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page class="q-px-lg q-py-md bg">
          <Breadcrumbs></Breadcrumbs>
          <div class="page-container">
            <router-view></router-view>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import moduleData from "../data/moduleData.js";
import Breadcrumbs from "src/components/Common/Breadcrumbs.vue";

export default {
  components: {
    Breadcrumbs: Breadcrumbs,
  },
  setup() {
    const $q = useQuasar();

    return {
      expansion_item: reactive(moduleData),
      link: ref("financial"),
      visible: ref(false),
      drawer: ref(false),
    };
  },
};
</script>

<style lang="scss" scoped>
$dark-color: #1d1d1d;

.q-item {
  padding-left: 50px;
  font-size: 13px;
}

.q-expansion-item,
.q-item {
  font-family: "title";
}

.logo {
  width: 90%;
  margin-top: 15px;
}

.page-container {
  margin-top: 15px;
  border-radius: 8px;
}

.body--light {
  .bg {
    background-color: #eef0f6;
  }

  .toolbar {
    background-color: #535be9;
  }

  .page-container {
    background: #fff;
  }
}

.body--dark {
  .header {
    background: $dark-color;
  }

  .page-container {
    background: $dark-color;
  }
}

.toolbar {
  height: 50px;
  text-align: center;
}

.bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  flex-direction: column;
  padding: 0 15px;

  & > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    font-family: "title";
    color: #757575;
  }

  .log-out {
    cursor: pointer;
    transition: 0.2s;
    color: #630f0f;
    &:hover {
      color: #535be9;
    }
  }

  .log-out-icon {
    width: 20px;
    font-size: 25px;
    margin-right: 20px;
  }
}
.avatar {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 20px;
  border-radius: 6px;
  img {
    border-radius: 6px;
    width: 30px;
    height: 30px;
  }
}
</style>
