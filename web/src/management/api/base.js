import axios from 'axios'
import router from '@/management/router/index'
import { get as _get } from 'lodash-es'
import { useUserStore } from '../stores/user'

export const CODE_MAP = {
  SUCCESS: 200,
  ERROR: 500,
  NO_AUTH: 403,
  ERR_AUTH: 1001
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      throw new Error('http请求出错')
    }
    const res = response.data
    if (res.code === CODE_MAP.NO_AUTH || res.code === CODE_MAP.ERR_AUTH) {
      router.replace({
        name: 'login'
      })
      return res
    } else {
      return res
    }
  },
  (err) => {
    throw new Error(err)
  }
)

instance.interceptors.request.use((config) => {
  const userStore = useUserStore()
  const hasLogin = _get(userStore, 'hasLogin')
  const token = _get(userStore, 'userInfo.token')
  if (hasLogin && token) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
