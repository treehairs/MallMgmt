const { boot } = require("quasar/wrappers");
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

export default boot(({ app }) => {
  app.use(new VueSocketIO({
    debug: true,
    connection: 'ws://127.0.0.1:4000'
  }))
})
