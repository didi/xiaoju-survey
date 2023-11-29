import axios from 'axios';
import sha256 from 'crypto-js/sha256';

// 生成axios实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 3000,
});

// 对数据进行过滤，将undefined转成空字符串
const undefinedToString = (data) => {
  const res = {};
  for (const key in data) {
    if (data[key] === undefined) {
      res[key] = '';
    } else {
      res[key] = data[key];
    }
  }
  return res;
};

// 根据数据生成签名
const getSignByData = (sourceData) => {
  const data = undefinedToString(sourceData);
  const keysArr = Object.keys(data);
  keysArr.sort();
  let signArr = keysArr.map((key) => {
    if (typeof data[key] === 'string') {
      return `${key}=${encodeURIComponent(data[key])}`;
    }
    return `${key}=${JSON.stringify(data[key])}`;
  });
  const ts = Date.now();
  const sign = sha256(signArr.join('') + ts);
  return `${sign}.${ts}`;
};

// 请求中间件，对所有请求都生成签名
instance.interceptors.request.use((request) => {
  let data = {};
  if (request.method === 'get') {
    data = request.params || data;
  } else if (request.method === 'post') {
    data = request.data || data;
  }
  const sign = getSignByData(data);
  data.sign = sign;
  return request;
});

// 对响应的数据，取data
instance.interceptors.response.use((response) => {
  if (response.status !== 200) {
    throw new Error('http请求出错');
  }
  return response.data;
});

export default instance;
