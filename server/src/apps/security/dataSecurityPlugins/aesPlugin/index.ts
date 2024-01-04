import { DataSecurityPlugin } from '../interface';
import * as CryptoJS from 'crypto-js';
import { isAddress, isEmail, isGender, isIdCard, isPhone } from './util';


export default class AesDataSecurityPlugin implements DataSecurityPlugin {
  secretKey: string;
  constructor({ secretKey }) {
    this.secretKey = secretKey;
  }
  isDataSensitive(data: string): boolean {
    const testArr = [isPhone, isIdCard, isAddress, isEmail, isGender];
    for (const test of testArr) {
      if (test(data)) {
        return true;
      }
    }
    return false;
  }
  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }
  decryptData(data: string): string {
    return CryptoJS.AES.decrypt(data, this.secretKey).toString(CryptoJS.enc.Utf8);
  }
  desensitiveData(data: string): string {
    if (data.length === 1) {
      return '*';
    }
    if (data.length === 2) {
      return data[0] + '*';
    }
    return data[0] + '***' + data[data.length - 1];
  }
}