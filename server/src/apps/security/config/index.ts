const config = {
  mongo: {
    url: process.env.xiaojuSurveyMongoUrl || 'mongodb://localhost:27017',
    dbName: 'xiaojuSurvey'
  },
  aesEncrypt: {
    key: process.env.xiaojuSurveyDataAesEncryptSecretKey || 'dataAesEncryptSecretKey'
  }
};

export function getConfig() {
  return config;
}