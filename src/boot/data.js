import { boot } from 'quasar/wrappers'
import { ref } from 'vue'

export default boot(({ app }) => {
  const category_list = null
  app.provide('category_list', category_list)
})
