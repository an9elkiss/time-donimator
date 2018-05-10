import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import TimeEntryPage from '@/components/pages/TimeEntryPage'

Vue.use(VueResource)
Vue.use(Router)

Vue.http.options.emulateJSON = true

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TimeEntryPage',
      component: TimeEntryPage
    }
  ]
})
