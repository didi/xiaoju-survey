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
      console.error('HTTP请求非200状态码:', response.status)
      throw new Error(`HTTP请求出错: ${response.status}`)
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
    console.error('HTTP请求失败:', err)
    
    // 提取更详细的错误信息
    if (err.response) {
      console.error('错误响应:', err.response)
      
      // 如果服务器返回了错误信息
      if (err.response.data && err.response.data.errmsg) {
        console.error('服务器错误信息:', err.response.data.errmsg)
        err.message = err.response.data.errmsg
      } else {
        err.message = `请求失败 (${err.response.status}): ${err.message}`
      }
    }
    
    throw err
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
