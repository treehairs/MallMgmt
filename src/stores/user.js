import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
  state: () => ({
    userInfo: [],
  }),
  actions: {
    // 更新用户信息
    updateUserInfo(newUserInfo) {
      this.userInfo = newUserInfo;
    }
  },
  persist: true

})
