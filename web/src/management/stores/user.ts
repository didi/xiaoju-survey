import { defineStore } from 'pinia'
import { ref } from 'vue'

type IUserInfo = {
  username: string
  token: string
}

const USER_INFO_KEY = 'surveyUserInfo'
export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IUserInfo | null>({
    username: '',
    token: ''
  })
  const hasLogined = ref(false)
  const loginTime = ref<number | null>(null)
  const initialized = ref(false)

  const init = () => {
    const localData = localStorage.getItem(USER_INFO_KEY)
    if (localData) {
      try {
        const { userInfo: info, loginTime: time } = JSON.parse(localData)
        if (Date.now() - time > 7 * 3600000) {
          localStorage.removeItem(USER_INFO_KEY)
        } else {
          login(info)
        }
      } catch (error) {
        console.log(error)
      }
    }
    initialized.value = true
  }
  const login = (data: IUserInfo) => {
    userInfo.value = data
    hasLogined.value = true
    loginTime.value = Date.now()
    localStorage.setItem(
      USER_INFO_KEY,
      JSON.stringify({
        userInfo: data,
        loginTime: loginTime
      })
    )
  }
  const logout = () => {
    userInfo.value = null
    hasLogined.value = false
    localStorage.removeItem(USER_INFO_KEY)
  }

  return { userInfo, hasLogined, loginTime, initialized, init, login, logout }
})
