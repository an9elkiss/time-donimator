import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import TimeEntryPage from '@/components/pages/TimeEntryPage'
import EntryChartPage from '@/components/pages/EntryChartPage'
import LoginPage from '@/components/pages/LoginPage'
import App from '@/APP'

Vue.use(VueResource)
Vue.use(Router)

Vue.http.options.emulateJSON = true

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },

    {
      path: '/',
      name: 'App',
      component: App,
      children: [
        {
          path: 'time-entry',
          name: 'TimeEntryPage',
          meta: {
            requireAuth: true
          },
          component: TimeEntryPage
        },

        {
          path: 'time-chart',
          name: 'EntryChartPage',
          meta: {
            requireAuth: true
          },
          component: EntryChartPage
        }
      ]
    }
  ]
})
