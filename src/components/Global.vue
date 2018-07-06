<script>

// const apiBase = 'http://localhost:9001'

const apiBase = process.env.BASE_API
const userApiBase = process.env.BASE_API_USER ? process.env.BASE_API_USER : process.env.BASE_API
const managerApiBase = process.env.BASE_API_MANAGER ? process.env.BASE_API_MANAGER : process.env.BASE_API
const url = {
  apiBase: apiBase,
  apiWeekDays: apiBase + '/api-time-dominator/1.0.0/week-days',
  apiDailyTimeEntries: apiBase + '/api-time-dominator/1.0.0/time-entries/daily',
  apiTimeEntries: apiBase + '/api-time-dominator/1.0.0/time-entries',
  apiUpdateTimeEntry: apiBase + '/api-time-dominator/1.0.0/time-entry/',
  apiCreateTimeEntry: apiBase + '/api-time-dominator/1.0.0/time-entry',
  apiLogin: userApiBase + '/api-union-user/1.0.0/login',
  apiMenus: userApiBase + '/api-union-user/1.0.0/menus',
  apiPersons: userApiBase + '/api-union-user/1.0.0/persons',
  apiTaskSave: managerApiBase + '/api-super-manager/1.0.0/task',
  apiTaskUpdate: managerApiBase + '/api-super-manager/1.0.0/task',
  apiTaskDelete: managerApiBase + '/api-super-manager/1.0.0/task/week',
  apiTaskWeekCopy: managerApiBase + '/api-super-manager/1.0.0/task/week/copy',
  apiWxLogin: userApiBase + '/api-union-user/1.0.0/wx-login',
  apiGetTasks: managerApiBase + '/api-super-manager/1.0.0/tasks',
  apiGetTask: managerApiBase + '/api-super-manager/1.0.0/task',
  apiGetCommonType: managerApiBase + '/api-super-manager/1.0.0/common/type',
  apiGetTaskParents: managerApiBase + '/api-super-manager/1.0.0/task/parents',
  apiGetTaskParentResource: managerApiBase + '/api-super-manager/1.0.0/task/parent/resource',
  apiGetCodeReviewInfo: managerApiBase + '/api-super-manager/1.0.0/codeReview/codeReviewInfo',
  apiGetCodeReviewDelete: managerApiBase + '/api-super-manager/1.0.0/codeReview/delete',
  apiGetParentResource: managerApiBase + '/api-super-manager/1.0.0/task/parent/resource/',
  apiGetWeekFromYearAndMonth: managerApiBase + '/api-super-manager/1.0.0/common/week/count',
  apiGetWeek: managerApiBase + '/api-super-manager/1.0.0/common/year/month/week',
  apiPutTag: managerApiBase + '/api-super-manager/1.0.0/savetag',
  apiCodeReview: managerApiBase + '/api-super-manager/1.0.0/codeReview',
  apiUpdateCodeReview: managerApiBase + '/api-super-manager/1.0.0/codeReview/codeReviewInfo/update',
  apiGetChildTaskScore: managerApiBase + '/api-super-manager/1.0.0/task/parent/showTaskScore/',
  apiShowConvertedWorkHours: managerApiBase + '/api-super-manager/1.0.0/task/show/converted/workhours',
  apiGetScoreData: managerApiBase + '/api-super-manager/1.0.0/task/week/actualscore',
  apiGetTotalScoreData: managerApiBase + '/api-super-manager/1.0.0/task/week/actualscoreTotal',
  apiPostTrainingContent: managerApiBase + '/api-super-manager/1.0.0/share',
  apiGetShareComments: managerApiBase + '/api-super-manager/1.0.0/shareComment',
  apiGetOpinions: managerApiBase + '/api-super-manager/1.0.0/findShareComment',
  apiGetSharingCommentsList: managerApiBase + '/api-super-manager/1.0.0/share/show',
  apiGetSharingFileDownload: managerApiBase + '/api-super-manager/1.0.0/share/downloadFile',
  apiSharePraise: managerApiBase + '/api-super-manager/1.0.0/sharePraise'
}

const event = {
  timeEntryDateChange: 'e_time_entry_date_change',
  timeEntryWeekDaysGot: 'e_time_entry_week_days_got',
  timeEntrySaved: 'e_time_entry_saved',
  appMounted: 'e_app_mounted',
  subMenuClicked: 'e_submenu_clicked',
  entryTypeMenuClicked: 'e_entry_type_menu_clicked'
}

const timeEntryType = {
  sportsExercise: 1,
  reading: 2,
  itLearning: 3,
  entertainment: 4,
  finance: 5,
  childEducation: 6
}
export default {
  url,
  event,
  timeEntryType,
  name: 'Global'
}
</script>

<style scoped>

</style>
