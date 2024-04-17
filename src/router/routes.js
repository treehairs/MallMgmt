const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Equalizer/FinancialPage.vue'),
        meta: { title: '数据统计', icon: 'attach_money', module: '统计功能', module_icon: 'equalizer' },
      },
      { path: 'IndexPage', meta: { title: '首页', icon: 'home' }, component: () => import('pages/IndexPage.vue') },
      {
        path: 'financial',
        component: () => import('pages/Equalizer/FinancialPage.vue'),
        meta: { title: '数据统计', icon: 'attach_money', module: '统计功能', module_icon: 'equalizer' },
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
        path: 'order',
        component: () => import('pages/OrderPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/Order/OrderList.vue'),
            meta: { title: '订单列表', icon: 'topic', module: '订单管理', module_icon: 'vertical_split' },
          },
          {
            path: '/unfinished',
            component: () => import('pages/Order/UnfinishedOrders.vue'),
            meta: { title: '待签收订单', icon: 'local_shipping', module: '订单管理', module_icon: 'vertical_split' },
          },
          {
            path: '/completed',
            component: () => import('pages/Order/CompletedOrders.vue'),
            meta: { title: '已完成订单', icon: 'checklist', module: '订单管理', module_icon: 'vertical_split' },
          },
        ]
      },
      {
        path: 'log',
        component: () => import('pages/LogPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/Log/LogList.vue'),
            meta: { title: '日志列表', icon: 'assignment', module: '日志管理', module_icon: 'description' },
          }
        ]
      },
      {
        path: 'chat',
        component: () => import('pages/ChatPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/Chat/Chat.vue'),
            meta: { title: '用户聊天', icon: 'assignment', module: '日志管理', module_icon: 'description' },
          }
        ]
      },

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
