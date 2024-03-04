export default [
  {
    icon: 'equalizer',
    label: '统计功能',
    default_opened: true,
    item: [
      {
        link: 'financial',
        label: '数据统计',
        to: '/financial'
      },
    ]
  },
  {
    icon: 'perm_identity',
    label: '日志功能',
    default_opened: false,
    item: [
      {
        link: 'description',
        label: '系统日志',
        to: '/log'
      }
    ],
    item_active_class: 'text-primary'
  },
  {
    icon: 'shopping_cart',
    label: '商品管理',
    default_opened: false,
    item: [
      {
        link: 'local_mall',
        label: '商品列表',
        to: '/product'
      },
      // {
      //   link: 'category',
      //   label: '类别列表',
      //   // to: '/category'
      // },
      {
        link: 'add_shopping_cart',
        label: '添加商品',
        to: '/product/add'
      },
      // {
      //   link: 'assignment_add',
      //   label: '添加类别'
      // },
      // {
      //   link: 'add_business',
      //   label: '商品入库'
      // }
    ]
  },
  {
    icon: 'vertical_split',
    label: '订单管理',
    default_opened: false,
    item: [
      {
        link: 'topic',
        label: '总订单',
        to: '/order',
      },
      {
        link: 'feedback',
        label: '售后订单'
      },
      {
        link: 'local_shipping',
        label: '待签收订单'
      },
      {
        link: 'checklist',
        label: '已完成订单'
      }
    ]
  },
  // {
  //   icon: 'vertical_split',
  //   label: '促销活动',
  //   default_opened: false,
  //   item: [
  //     {
  //       link: 'topic',
  //       label: '待完成订单'
  //     },
  //     {
  //       link: 'feedback',
  //       label: '售后订单'
  //     },
  //     {
  //       link: 'local_shipping',
  //       label: '待签收订单'
  //     },
  //     {
  //       link: 'checklist',
  //       label: '已完成订单'
  //     }
  //   ]
  // }
]
