import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import TimeEntryPage from '@/components/pages/TimeEntryPage'
import EntryChartPage from '@/components/pages/EntryChartPage'
import LoginPage from '@/components/pages/LoginPage'
import TaskMangementList from '@/components/pages/TaskMangementList'
import TaskMangementDetail from '@/components/pages/TaskMangementDetail'
import CodeReviewDetail from '@/components/pages/codeReview/CodeReviewDetail'
import CodeReviewForm from '@/components/pages/codeReview/CodeReviewForm'
import CodeReviewList from '@/components/pages/codeReview/CodeReviewList'
import ShowConvertedWorkHour from '@/components/pages/charts/ShowConvertedWorkHour'
import App from '@/APP'
import ScoreCharts from '@/components/pages/charts/ScoreCharts'
import TrainingContent from '@/components/pages/trainingSharing/TrainingContent'
import ShareComments from '@/components/pages/trainingSharing/ShareComments'
import SharingCommentList from '@/components/pages/trainingSharing/SharingCommentList'
import EditContentPage from '@/components/pages/dirAndFile/EditContentPage'
import ReportForm from '@/components/pages/charts/ReportForm'
import ShowReportFormInfo from '@/components/pages/charts/ShowReportFormInfo'
import ProjectPlanTracking from '@/components/pages/projectPlan/ProjectPlanTracking'
import EditProjectPlanTracking from '@/components/pages/projectPlan/EditProjectPlanTracking'

Vue.use(VueResource)
Vue.use(Router)

Vue.http.options.emulateJSON = true

export default new Router({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
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
      redirect: '/task-mangement-list',
      children: [
        {
          path: 'time-entry',
          name: 'TimeEntryPage',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: TimeEntryPage
        },
        {
          path: 'time-chart',
          name: 'EntryChartPage',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: EntryChartPage
        },
        {
          path: 'task-mangement-list',
          name: 'TaskMangementList',
          meta: {
            requireAuth: true,
            keepAlive: true
          },
          component: TaskMangementList
        },
        {
          path: 'task-mangement-detail',
          name: 'TaskMangementDetail',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: TaskMangementDetail
        },
        {
          path: 'code-review-detail/:id',
          name: 'CodeReviewDetail',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: CodeReviewDetail
        },
        {
          path: 'code-review-form',
          name: 'CodeReviewForm',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: CodeReviewForm
        },
        {
          path: 'code-review-list',
          name: 'CodeReviewList',
          meta: {
            requireAuth: true,
            keepAlive: true
          },
          component: CodeReviewList
        },
        {
          path: 'show-converted-work-hour',
          name: 'ShowConvertedWorkHour',
          meta: {
            requireAuth: true,
            keepAlive: true
          },
          component: ShowConvertedWorkHour
        },
        {
          path: 'score-charts',
          name: 'ScoreCharts',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: ScoreCharts
        },
        {
          path: 'training-content',
          name: 'TrainingContent',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: TrainingContent
        },
        {
          path: 'share-comments',
          name: 'ShareComments',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: ShareComments
        },
        {
          path: 'sharing-comment-list',
          name: 'SharingCommentList',
          meta: {
            requireAuth: true,
            keepAlive: true
          },
          component: SharingCommentList
        },
        {
          path: 'edit-content-page',
          name: 'EditContentPage',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: EditContentPage
        },
        {
          path: 'report-form-page',
          name: 'ReportForm',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: ReportForm
        },
        {
          path: 'show-report-info',
          name: 'ShowReportFormInfo',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: ShowReportFormInfo
        },
        {
          path: 'project-plan-tracking',
          name: 'projectPlanTracking',
          meta: {
            requireAuth: true,
            keepAlive: true
          },
          component: ProjectPlanTracking
        },
        {
          path: 'edit-project-plan-tracking',
          name: 'editProjectPlanTracking',
          meta: {
            requireAuth: true,
            keepAlive: false
          },
          component: EditProjectPlanTracking
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
