import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import WeekDays from '@/components/WeekDays'

Vue.use(VueResource)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WeekDays',
      component: WeekDays
    }
  ]
})
