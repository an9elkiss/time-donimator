// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Root from './Root'
import router from './router'
import axios from 'axios'
import store from './store'
import Globals from '@/assets/js/global'
import {http} from '@/assets/js/http'
import { Field, Picker, Popup, Dialog, Icon } from 'vant'
import 'vant/lib/vant-css/index.css'

Vue.use(Field)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(Dialog)
Vue.use(Icon)
Vue.prototype.$api = http
Vue.prototype.$global = Globals
Vue.config.productionTip = false
Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body.token = store.state.user.token
  } else if (request.method === 'GET' || request.method === 'DELETE') {
    request.params.token = store.state.user.token
  }
  next((response) => {
    if (!store.state.user.token || response.body.code === 500) {
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
axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    config.data = {
      ...config.data,
      token: store.state.user.token
    }
  } else if (config.method === 'get' || config.method === 'delete') {
    config.params = {
      ...config.params,
      token: store.state.user.token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  switch (response.data.code) {
    case 500:
      router.push({
        path: '/login'
      })
      break
    default:
      if (response.data.data !== null && response.data.data.parentId !== undefined && response.data.data.parentId === null) {
        response.data.data.parentId = ''
      }
  }
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 500:
        router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
        break
      default: console.log('cannot handle response status %d', error.response.status)
    }
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
