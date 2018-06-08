// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import Root from './Root'
import router from './router'
import Global from '@/components/Global'
import Globals from '@/assets/js/global'
import {http} from '@/assets/js/http'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)
Vue.prototype.$api = http
Vue.prototype.$global = Globals
Vue.config.productionTip = false

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body.token = Global.token
  } else if (request.method === 'GET' || request.method === 'DELETE') {
    request.params.token = Global.token
  }

  next((response) => {
    if (response.data.status === 500) {
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
    if (Global.token) {
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
  router,
  components: { Root },
  template: '<Root rep="app"/>'
})
