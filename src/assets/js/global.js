import { Toast } from 'vant'

const apiBase = process.env.BASE_API
const userApiBase = process.env.BASE_API_USER ? process.env.BASE_API_USER : process.env.BASE_API

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
  apiAllProgramProgress: 'http://10.88.91.194:9006' + '/api-super-manager/1.0.0/common/type'
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

const projectPlanPhaseType = {
  1: '开发',
  2: 'sta测试',
  3: 'pro测试'
}

const projectPlanPhaseCheckStatusType = {
  1: '30%',
  2: '50%',
  3: '80%',
  4: '100%',
  5: '完成自测'
}

export const goNext = (t, x) => {
  t.$router.push({name: x})
}

export const format = (data) => {
  if (data) {
    // data = data.replace(/[\r\n]/g, '<br/>')
    // data = data.replace(/[\n]/g, '<br/>')
    return data.replace(/\r?\n/g, '<br />')
  }
}

export const transformDateString = (val) => {
  if (val === null) {
    return null
  }
  let date = val
  if (typeof val === 'string' || typeof val === 'number') {
    date = new Date(val)
  }
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
}

export const showResult = (result) => {
  var title = false
  var message = ''
  if (!result || !result.hasOwnProperty('code') || result.code === '') {
    title = false
    message = '获取数据失败'
  } else if (result.code === 200) {
    title = true
    message = '操作成功'
  } else {
    title = false
    message = result.message
  }
  if (title) {
    Toast.success(message)
  } else {
    Toast.fail(message)
  }
}

export const showMessage = (message) => {
  Toast(message)
}

export const updateSelect2OptionsTitle = (arr, attr, attrs) => {
  arr.map(ele => {
    let attrArray = attrs.split(',')
    ele[attr] = attrArray.map(attr => {
      return ele[attr]
    }).join(' - ')
  })
}

export default {
  url,
  event,
  timeEntryType,
  projectPlanPhaseType,
  projectPlanPhaseCheckStatusType,
  transformDateString,
  format,
  goNext,
  showResult,
  showMessage,
  updateSelect2OptionsTitle,
  name: 'Global'
}
