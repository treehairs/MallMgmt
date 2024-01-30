<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container q-pa-md">
    <q-breadcrumbs class="active-color" active-color="primary">
      <template v-slot:separator>
        <q-icon size="1.5em" name="chevron_right" color="primary" />
      </template>
      <q-breadcrumbs-el :label="crumbs[0].module" :icon="crumbs[0].module_icon" :to="crumbs[0].path" />
      <q-breadcrumbs-el v-for="(crumb, i) in crumbs" :key="i" :label="crumb.label" :icon="crumb.icon" :to="crumb.path" />
    </q-breadcrumbs>

    <div class="title q-px-sm">{{ crumbs[crumbs.length - 1].label }}</div>
  </div>
</template>

<script>
export default {
  computed: {
    crumbs() {
      let pathArray = this.$route.path.split('/');
      pathArray.shift()
      const key = Object.keys(this.$route.params)
      const value = "/" + this.$route.params[key]

      let breadcrumbs = pathArray.map((path, i) => {
        let route = this.$router.resolve({ path: '/' + pathArray.slice(0, i + 1).join('/') });
        return {
          path: route.fullPath,
          label: route.meta.title,
          icon: route.meta.icon,
          module: route.meta.module,
          module_icon: route.meta.module_icon
        };
      });
      if (value !== '/undefined') {
        breadcrumbs[breadcrumbs.length - 2] = breadcrumbs[breadcrumbs.length - 1]
        breadcrumbs.length--
      }
      return breadcrumbs;
    }
  }
}

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  // height: 10vh;
  box-sizing: border-box;
  border-radius: 8px;
}

.active-color {
  color: #3b42ff;
  font-family: "title";
}

.title {
  font-family: "title2";
  margin-top: 10px;
  font-size: 24px;
  // font-weight: bold;
}

.body--light {
  .container {
    background: #fff;
  }

}

.body--dark {
  .container {
    background: #1D1D1D;
  }

}
</style>

