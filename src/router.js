import Vue from 'vue'
import Router from 'vue-router'
import Setting from './views/Setting.vue'
import Login from './views/Login.vue'
import Main from './views/Main.vue'
import Mirror from './views/Mirror.vue'

import store from './store'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/setting',
      name: 'setting',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      component: Setting,
      meta: {
        authRequired: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/Mirror',
      name: "Mirror",
      component: Mirror,
    },
    {
      path: '/',
      name: 'main',
      component: Main,
      meta: {
        authRequired: true
      }
    },
  ]
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.state.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router