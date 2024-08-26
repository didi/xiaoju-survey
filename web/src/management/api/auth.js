import axios from './base'

export const register = (data) => {
  return axios.post('/auth/register', data)
}

export const login = (data) => {
  return axios.post('/auth/login', data)
}

export const getUserInfo = () => {
  return axios.get('/user/getUserInfo')
}