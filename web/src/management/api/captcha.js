import axios from './base';

export const refreshCaptcha = ({ captchaId }) => {
  return axios.post('/auth/captcha', { captchaId });
};
