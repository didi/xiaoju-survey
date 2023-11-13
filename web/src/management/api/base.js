import axios from 'axios';
import store from '@/management/store/index';
import router from '@/management/router/index';
import _get from 'lodash/get';
import { Message } from 'element-ui';

const instance = axios.create({
  baseURL: '/api',
  timeout: 3000,
});

instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      throw new Error('http请求出错');
    }
    const res = response.data;
    if (res.code === 403) {
      router.replace({
        name: 'login',
      });
      return res;
    } else {
      return res;
    }
  },
  (err) => {
    Message.error(err || 'http请求出错');
    throw new Error(err);
  }
);

instance.interceptors.request.use((config) => {
  const hasLogined = _get(store, 'state.user.hasLogined');
  const token = _get(store, 'state.user.userInfo.token');
  if (hasLogined && token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

export const CODE_MAP = {
  SUCCESS: 200,
  ERROR: 500,
  NOTAUTH: 403,
};
