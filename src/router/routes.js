const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'IndexPage', meta: { title: '首页', icon: 'home' }, component: () => import('pages/IndexPage.vue') },
      {
        path: 'financial',
        component: () => import('pages/Equalizer/FinancialPage.vue'),
        meta: { title: '收支明细', icon: 'attach_money', module: '统计功能', module_icon: 'equalizer' },
        children: [
          {
            path: 'abc',
            component: () => import('pages/ErrorNotFound.vue'),
            meta: { title: '收支明细2', icon: 'attach_money' },
            children: [{
              path: 'abc',
              component: () => import('pages/ErrorNotFound.vue'),
              meta: { title: '收支明细3', icon: 'attach_money' },
            }]
          }
        ]
      },
      {
        path: 'productList',
        component: () => import('pages/Goods/ProductList.vue'),
        meta: { title: '商品列表', icon: 'local_mall', module: '商品管理', module_icon: 'shopping_cart' },
      },
      {
        path: 'editProduct/:id',
        component: () => import('pages/Goods/EditProduct.vue'),
        meta: { title: '商品编辑', icon: 'edit_square', module: '商品管理', module_icon: 'shopping_cart' },
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
