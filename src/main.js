import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import store from './store'
import Axios from 'axios';

import { cilTrash } from '@coreui/icons'

// import VueSocketIO from 'vue-socket.io';
//
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'ws://localhost:3333/adonis-ws',
// }));

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

Vue.prototype.$http = Axios;

new Vue({
  el: '#app',
  router,
  store,
  icons: { cilTrash },
  template: '<App/>',
  components: {
    App
  }
})
