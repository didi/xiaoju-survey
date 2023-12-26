import axios from './base';

export const refreshCaptcha = ({ captchaId }) => {
  return axios.post('/user/captcha', { captchaId });
};
