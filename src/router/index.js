import Vue from 'vue'
import Router from 'vue-router'
import WeekDays from '@/components/WeekDays'

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
