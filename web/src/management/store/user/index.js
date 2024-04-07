const USER_INFO_KEY = 'surveyUserInfo'

export default {
  namespaced: true,
  state: {
    userInfo: {
      token: '',
      username: '',
    },
    hasLogined: false,
    loginTime: null,
    initialized: false,
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setHsLogined(state, data) {
      state.hasLogined = data
    },
    setLoginTime(state, data) {
      state.loginTime = data
    },
    setInitialized(state, data) {
      state.initialized = data
    },
  },
  actions: {
    init({ dispatch, commit }) {
      const localData = localStorage.getItem(USER_INFO_KEY)
      if (localData) {
        try {
          const { userInfo, loginTime } = JSON.parse(localData)
          if (Date.now() - loginTime > 7 * 3600000) {
            localStorage.removeItem(USER_INFO_KEY)
          } else {
            dispatch('login', userInfo)
          }
        } catch (error) {
          console.log(error)
        }
      }
      commit('setInitialized', true)
    },
    login({ commit }, data) {
      const loginTime = Date.now()
      commit('setUserInfo', data)
      commit('setHsLogined', true)
      commit('setLoginTime', loginTime)
      localStorage.setItem(
        USER_INFO_KEY,
        JSON.stringify({
          userInfo: data,
          loginTime: loginTime,
        })
      )
    },
    logout({ commit }) {
      commit('setUserInfo', null)
      commit('setHsLogined', false)
      localStorage.removeItem(USER_INFO_KEY)
    },
  },
}
