import axios from './base';

export const refreshCaptcha = () => {
  return axios.post('/user/captcha');
};
