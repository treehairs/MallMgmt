import { Notify } from 'quasar'

/**
 * 防抖函数
 * @param {Function} fn 执行函数
 * @param {number} wait 等待时间
 * @returns {Function}
 */
const debounce = (fn, wait) => {
  let timer = null
  return function () {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, wait)
  }
}

/**
 *
 * @param {*} fn
 * @param {*} wait
 */
const throttle = (fn, wait) => {

}

/**
 * 对象判空函数
 * @param {Object} obj - 判空的对象
 * @returns {Boolean} 为真表示有空值
 */
export const isAnyObjectValueEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === undefined || obj[key] === '')) {
      return true;
    }
  }
  return false;
}

/**
 * 顶部通知
 * @param {Type} type    - 消息类型
 * @param {string} message - 消息文本
 * @param {string} icon - 可选，提示图标
 * @typedef {'positive' | 'negative' | 'warning' | 'info' | 'ongoing'} Type
 */
export const showNotif = (type, message, icon) => {
  // 检查是否传入了图标参数
  const defaultIcons = {
    positive: 'check',
    negative: 'warning',
    warning: 'priority_high',
    info: 'info',
    ongoing: 'autorenew'
  };

  const selectedIcon = icon || defaultIcons[type];

  Notify.create({
    type,
    message,
    position: 'top',
    icon: selectedIcon
  });
}

/**
 * 计算文件大小
 * @param {number} size 文件大小
 * @return {number}                   文件大小（字节）
 */
export function size2Str(size) {
  if (size < 1024) {
    return size + 'B';
  } else if (size >= 1024 && size < Math.pow(1024, 2)) {
    return parseFloat(size / 1024).toFixed(2) + 'KB';
  } else if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
    return parseFloat(size / Math.pow(1024, 2)).toFixed(2) + 'MB';
  } else if (size > Math.pow(1024, 3)) {
    return parseFloat(size / Math.pow(1024, 3)).toFixed(2) + 'GB';
  } else {
    return 0 + 'B';
  }
}

/**
 * 生成PID
 * @returns {int}
 */
import { customAlphabet } from "nanoid";
import moment from "moment";
import { updateData } from 'src/services/api'

export const generate_pid = () => {
  const alphabet = "0123456789";
  const nanoid = customAlphabet(alphabet, 9);
  return nanoid();
};


/**
 * 记录日志
 * @param {string} module 操作模块
 * @param {Action} action_type 操作类型
 * @param {string} detail 操作详情
 * @param {Method} request_method 请求方法
 * @typedef {'POST' | 'DELETE' } Method
 * @typedef {'修改' | '添加' | '删除' } Action
 * @returns {Number} 请求结果
 */
export const logger = (module, action_type, detail, request_method) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return updateData("/logs", {
    admin_id: userInfo.admin_id,
    module,
    action_type,
    detail,
    request_method,
  });
}

/**
 *
 * @returns moment
 */
export const CN_moment = () => {
  moment.defineLocale("zh-cn", {
    relativeTime: {
      future: "%s内",
      past: "%s前",
      s: "几秒",
      m: "1分钟",
      mm: "%d分钟",
      h: "1小时",
      hh: "%d小时",
      d: "1天",
      dd: "%d天",
      M: "1个月",
      MM: "%d个月",
      y: "1年",
      yy: "%d年",
    },
  });

  return moment
}

