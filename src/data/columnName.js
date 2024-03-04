export const orderTableFields = [
  {
    name: "订单ID",
    class: "order_id",
    primary_key: true
  },
  {
    name: "用户ID",
    class: "user_id",
  },
  {
    name: "订单金额",
    class: "total_amount",
  },
  {
    name: "订单状态",
    class: "order_status",
  },
  {
    name: "创建日期",
    class: "created_at",
  },
  {
    name: "联系方式",
    class: "tel",
  },
  {
    name: "地址",
    class: "address",
  },

];

export const logTableFields = [
  {
    name: "日志ID",
    class: "id",
    primary_key: true
  },
  {
    name: "管理员ID",
    class: "admin_id",
  },
  {
    name: "操作模块",
    class: "module",
  },
  {
    name: "操作类型",
    class: "action_type",
  },
  {
    name: "请求方法",
    class: "request_method",
  },
  {
    name: "详细",
    class: "detail",
  },
  {
    name: "创建时间",
    class: "create_time",
  },

];
// export const orderTableFields = [
//   {
//     name: "订单ID",
//     class: "id",
//     primary_key: true
//   },
//   {
//     name: "会员ID",
//     class: "member_id"
//   },
//   {
//     name: "优惠券ID",
//     class: "coupon_id"
//   },
//   {
//     name: "订单编号",
//     class: "order_sn"
//   },
//   {
//     name: "提交时间",
//     class: "create_time",
//     unsorted: true
//   },
//   {
//     name: "订单总金额",
//     class: "total_amount"
//   },
//   {
//     name: "应付金额",
//     class: "pay_amount"
//   },
//   {
//     name: "运费金额",
//     class: "freight_amount"
//   },
//   {
//     name: "促销优化金额",
//     class: "promotion_amount"
//   },
//   {
//     name: "优惠券抵扣金额",
//     class: "coupon_amount"
//   },
//   {
//     name: "管理员后台调整订单使用的折扣金额",
//     class: "discount_amount"
//   },
//   {
//     name: "订单状态",
//     class: "status"
//   },
//   {
//     name: "物流公司",
//     class: "delivery_company"
//   },
//   {
//     name: "物流单号",
//     class: "delivery_sn"
//   },
//   {
//     name: "收货人姓名",
//     class: "receiver_name"
//   },
//   {
//     name: "收货人电话",
//     class: "receiver_phone"
//   },
//   {
//     name: "收货人邮编",
//     class: "receiver_post_code"
//   },
//   {
//     name: "省份/直辖市",
//     class: "receiver_province"
//   },
//   {
//     name: "城市",
//     class: "receiver_city"
//   },
//   {
//     name: "区",
//     class: "receiver_region"
//   },
//   {
//     name: "详细地址",
//     class: "receiver_detail_address"
//   },
//   {
//     name: "订单备注",
//     class: "note"
//   },
//   {
//     name: "确认收货状态",
//     class: "confirm_status"
//   },
//   {
//     name: "支付时间",
//     class: "payment_time"
//   },
//   {
//     name: "发货时间",
//     class: "delivery_time"
//   },
//   {
//     name: "确认收货时间",
//     class: "receive_time"
//   },
//   {
//     name: "评价时间",
//     class: "comment_time"
//   },
//   {
//     name: "修改时间",
//     class: "modify_time"
//   }
// ];
