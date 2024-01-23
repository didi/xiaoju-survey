import { mongo } from '../../../config';

const aesEncrypt = {
  key: process.env.XIAOJU_SURVEY_ENCRYPT_SECRET_KEY || 'dataAesEncryptSecretKey',
};

export function getConfig() {
  return {
    mongo,
    aesEncrypt,
  };
}