import { load } from 'cheerio';
import * as CryptoJS from 'crypto-js';

const phoneRegex = /^1[3456789]\d{9}$/; // 手机号码正则表达式
const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 身份证号码正则表达式
const addressRegex = /.*省|.*自治区|.*市|.*区|.*镇|.*县/; // 地址正则表达式
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱正则
const genderArr = ['男', '女']; // 性别

const isPhone = (data: string) => phoneRegex.test(data);

const isIdCard = (data: string) => idCardRegex.test(data);

const isAddress = (data: string) => addressRegex.test(data);

const isEmail = (data: string) => emailRegex.test(data);

const isGender = (data: string) => genderArr.includes(data);

const isString = (data) => {
  return typeof data === 'string';
};

export const isDataSensitive = (data): boolean => {
  if (!isString(data)) {
    return false;
  }
  const $ = load(data);
  const text = $.text();
  const testArr = [isPhone, isIdCard, isAddress, isEmail, isGender];
  for (const test of testArr) {
    if (test(text)) {
      return true;
    }
  }
  return false;
};

export const encryptData = (data, { secretKey }) => {
  if (!isString(data)) {
    return data;
  }
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (data, { secretKey }) => {
  if (!isString(data)) {
    return data;
  }
  return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
};

export const maskData = (data: string): string => {
  if (!isString(data)) {
    return '*';
  }
  const $ = load(data);
  const text = $.text();
  if (text.length === 1) {
    return '*';
  }
  if (text.length === 2) {
    return text[0] + '*';
  }
  return text[0] + '***' + text[text.length - 1];
};
