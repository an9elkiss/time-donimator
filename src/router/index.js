import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import TimeEntryPage from '@/components/pages/TimeEntryPage'
import EntryChartPage from '@/components/pages/EntryChartPage'

Vue.use(VueResource)
Vue.use(Router)

Vue.http.options.emulateJSON = true

export default new Router({
  routes: [
    {
      path: '/time-entry',
      name: 'TimeEntryPage',
      component: TimeEntryPage
    },

    {
      path: '/time-chart',
      name: 'EntryChartPage',
      component: EntryChartPage
    }
  ]
})
