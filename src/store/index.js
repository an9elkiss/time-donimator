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
    person: {}
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
    }
  },

  getters: {
    userName (state) {
      return state.user.name
    }
  },

  plugins: [createPersistedState()]
})
