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
