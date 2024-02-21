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
        path: 'product',
        component: () => import('pages/ProductPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/Product/ProductList.vue'),
            meta: { title: '商品列表', icon: 'local_mall', module: '商品管理', module_icon: 'shopping_cart' },
          },
          {
            path: 'edit/:id',
            component: () => import('pages/Product/EditProduct.vue'),
            meta: { title: '商品编辑', icon: 'edit_square', module: '商品管理', module_icon: 'shopping_cart' },
          },
          {
            path: 'add',
            component: () => import('pages/Product/AddProduct.vue'),
            meta: { title: '商品添加', icon: 'add_shopping_cart', module: '商品管理', module_icon: 'shopping_cart' },
          },
        ]
      },
      {
        path: 'category',
        component: () => import('pages/Category/CategoryList.vue'),
        meta: { title: '类别列表', icon: 'category', module: '商品管理', module_icon: 'shopping_cart' },
      }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: '/login',
    component: () => import('pages/loginPage.vue')
  },
]

export default routes
