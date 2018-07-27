import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      name: null,
      token: null
    },
    person: {},
    selectedDate: '',
    selectedMonth: null,
    selectedWeek: null,
    codeReviewPerson: {},
    codeReview: {},
    codeReviewDetail: {},
    temporaryCodeReview: {
      submitType: '',
      codeReviewPerson: {},
      codeReview: {}
    },
    taskList: [],
    sharingComment: {},
    forwordInformation: {}
  },
  mutations: {
    login (state, data) {
      state.user.id = data.id
      state.user.name = data.userName
      state.user.token = data.token
    },

    logout (state) {
      state.user.id = null
      state.user.name = null
      state.user.token = null
    },

    GetPersonMsg (state, data) {
      state.person = data
    },

    setSelectedDate (state, dateString) {
      state.selectedDate = dateString
    },
    setSelectedMonth (state, month) {
      state.selectedMonth = month
    },
    setSelectedWeek (state, week) {
      state.selectedWeek = week
    },
    setCodeReviewPerson (state, person) {
      state.codeReviewPerson = person
    },
    setCodeReview (state, codeReview) {
      state.codeReview = codeReview
    },
    setCodeReviewDetail (state, codeReviewDetail) {
      state.codeReviewDetail = codeReviewDetail
    },
    setTaskList (state, taskList) {
      state.taskList = taskList
    },
    setSharingComment (state, sharingComment) {
      state.sharingComment = sharingComment
    },
    setTemporaryCodeReviewType (state, type) {
      state.temporaryCodeReview.submitType = type
    },
    setTemporaryCodeReviewPerson (state, person) {
      state.temporaryCodeReview.codeReviewPerson = person
    },
    setTemporaryCodeReviewContent (state, content) {
      state.temporaryCodeReview.codeReview = content
    },
    setForwordInformation (state, forwordInformation) {
      state.forwordInformation = forwordInformation
    }
  },

  getters: {
    userName (state) {
      return state.user.name
    },
    getUser (state) {
      return state.user
    },
    getSelectedDate (state) {
      return state.selectedDate
    },
    getSelectedMonth (state) {
      return state.selectedMonth
    },
    getSelectedWeek (state) {
      return state.selectedWeek
    },
    getCodeReviewPerson (state) {
      return state.codeReviewPerson
    },
    getCodeReview (state) {
      return state.codeReview
    },
    getTaskList (state) {
      return state.taskList
    },
    getSharingComment (state) {
      return state.sharingComment
    },
    getForwordInformation (state) {
      return state.forwordInformation
    }
  },

  plugins: [createPersistedState()]
})
