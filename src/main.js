// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import Root from './Root'
import router from './router'

import store from './store'

Vue.config.productionTip = false

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body.token = store.state.user.token
  } else if (request.method === 'GET' || request.method === 'DELETE') {
    request.params.token = store.state.user.token
  }

  next((response) => {
    if (response.body.code === 500) {
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
    return response
  })
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user.token) {
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { Root },
  template: '<Root rep="app"/>'
})
