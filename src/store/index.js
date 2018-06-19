import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: null,
      token: null
    },
    person: {},
    selectedDate: '',
    selectedMonth: null,
    selectedWeek: null
  },
  mutations: {
    login (state, data) {
      state.user.name = data.userName
      state.user.token = data.token
    },

    logout (state) {
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
    }
  },

  getters: {
    userName (state) {
      return state.user.name
    },

    getSelectedDate (state) {
      return state.selectedDate
    },
    getSelectedMonth (state) {
      return state.selectedMonth
    },
    getSelectedWeek (state) {
      return state.selectedWeek
    }
  },

  plugins: [createPersistedState()]
})
