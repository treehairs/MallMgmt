import { showNotif } from "src/utils/utils"

const whiteList = [] // 不重定向白名单

// 全局路由未登录拦截
export default async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    console.log(to, from);
    if (localStorage.getItem('userInfo')) {
      showNotif("info", "请登录!")
      next({ name: 'login' })
    } else {
      next()
    }
  })
}
