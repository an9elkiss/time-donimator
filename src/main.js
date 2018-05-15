// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Global from '@/components/Global'
import Bus from '@/components/EventBus'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App rep="app"/>',

  mounted () {
    window.$(document).ready(function () {
      window.App.init()

      Bus.$emit(Global.event.appMounted)
    })
  }
})
