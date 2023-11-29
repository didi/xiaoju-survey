import CryptoJS from 'crypto-js';

function base64({ data }) {
  return btoa(encodeURIComponent(data));
}

function aes({ data, code }) {
  return CryptoJS.AES.encrypt(encodeURIComponent(data), code).toString();
}

export default {
  base64,
  aes,
};
