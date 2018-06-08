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
  apiGetTask: managerApiBase + '/api-super-manager/1.0.0/tasks',
  apiGetTaskSave: managerApiBase + '/api-super-manager/1.0.0/task/save',
  apiGetCommonType: managerApiBase + '/api-super-manager/1.0.0/common/type',
  apiGetTaskParents: managerApiBase + '/api-super-manager/1.0.0/task/parents',
  apiGetParentResource: managerApiBase + '/api-super-manager/1.0.0/task/parent/resource/'
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
