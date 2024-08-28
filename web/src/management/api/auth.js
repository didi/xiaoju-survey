import axios from './base'

export const register = (data) => {
  return axios.post('/auth/register', data)
}

export const login = (data) => {
  return axios.post('/auth/login', data)
}

/** 获取密码强度 */
export const getPasswordStrength = (password) => {
  return axios.get('/auth/register/password/strength', {
    params: {
      password
    }
  })
}
