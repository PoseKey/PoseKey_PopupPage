import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
//theme
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
//OAuth + vuex + router-sync
import router from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import FirebaseAuthPlugin from './FirebaseAuthPlugin'

// Vue.use(Vuetify)
Vue.use(FirebaseAuthPlugin)
Vue.config.productionTip = false

sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export {router, store} 