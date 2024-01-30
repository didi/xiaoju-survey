import { createHash } from 'crypto';
import { cloneDeep } from 'lodash';
import { EXCEPTION_CODE } from '../enums/exceptionCode';
import { HttpException } from '../exceptions/httpException';

const hash256 = (text) => {
  return createHash('sha256').update(text).digest('hex');
};

const getSignByData = (sourceData, ts) => {
  const data = cloneDeep(sourceData);
  const keysArr = Object.keys(data);
  keysArr.sort();
  const signArr = keysArr.map((key) => {
    if (typeof data[key] === 'string') {
      return `${key}=${encodeURIComponent(data[key])}`;
    }
    return `${key}=${JSON.stringify(data[key])}`;
  });
  const sign = hash256(signArr.join('') + ts);
  return `${sign}`;
};

export const checkSign = (sourceData) => {
  const data = cloneDeep(sourceData);
  const sign = data.sign;
  if (!sign) {
    throw new HttpException(
      '请求签名不存在',
      EXCEPTION_CODE.RESPONSE_SIGN_ERROR,
    );
  }
  delete data.sign;
  const [inSign, ts] = sign.split('.');
  const realSign = getSignByData(data, ts);
  if (inSign !== realSign) {
    throw new HttpException('请求签名异常', EXCEPTION_CODE.RESPONSE_SIGN_ERROR);
  }
  return true;
};
