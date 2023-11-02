import axios from './base';

export const register = ({ username, password }) => {
  return axios.post('/user/register', {
    username,
    password,
  });
};

export const login = ({ username, password }) => {
  return axios.post('/user/login', {
    username,
    password,
  });
};
