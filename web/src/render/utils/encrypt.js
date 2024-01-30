import * as forge from 'node-forge';

function rsa({ data, secretKey }) {
  const publicKeyObject = forge.pki.publicKeyFromPem(secretKey);
  const dataArr = [];
  const originData = encodeURIComponent(data);
  const step = 200;
  for (let i = 0; i < originData.length; i += step) {
    const encryptData = forge.util.encode64(
      publicKeyObject.encrypt(originData.slice(i, i + step), 'RSA-OAEP')
    );
    dataArr.push(encryptData);
  }
  return dataArr;
}

export default {
  rsa,
};
