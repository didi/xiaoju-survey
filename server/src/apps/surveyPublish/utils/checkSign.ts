import { 
  createHash 
} from 'crypto';
import { CommonError } from '../../../types/index';

const hash256 = (text) => {
  return createHash('sha256').update(text).digest('hex');
};
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
  
const getSignByData = (sourceData, ts) => {
  const data = undefinedToString(sourceData);
  const keysArr = Object.keys(data);
  keysArr.sort();
  const signArr = keysArr.map(key => {
    if (typeof data[key] === 'string') {
      return `${key}=${encodeURIComponent(data[key])}`;
    }
    return `${key}=${JSON.stringify(data[key])}`;
  });
  const sign = hash256(signArr.join('') + ts);
  return `${sign}`;
};

export const checkSign = (sourceData) => {
  const sign = sourceData.sign; 
  if(!sign) {
    throw new CommonError('请求签名不存在');
  }
  delete sourceData.sign;
  const [inSign, ts] = sign.split('.');
  const realSign = getSignByData(sourceData, ts);
  if(inSign!==realSign) {
    throw new CommonError('请求签名异常');
  }
  return true;
};
  