const mongo = {
  url: process.env.XIAOJU_SURVEY_MONGO_URL || 'mongodb://localhost:27017',
  dbName: process.env.XIAOJU_SURVER_MONGO_DBNAME ||  'xiaojuSurvey',
}

const session = {
  expireTime: parseInt(process.env.XIAOJU_SURVEY_JWT_EXPIRES_IN) || 8 * 3600 * 1000
}

const encrypt = {
  type: process.env.XIAOJU_SURVEY_ENCRYPT_TYPE || 'aes',
  aesCodelength: parseInt(process.env.XIAOJU_SURVEY_ENCRYPT_TYPE_LEN) || 10 //aes密钥长度
}

const jwt = {
  secret: process.env.XIAOJU_SURVEY_JWT_SECRET || 'xiaojuSurveyJwtSecret',
  expiresIn: process.env.XIAOJU_SURVEY_JWT_EXPIRES_IN || '8h'
}


export{
  mongo,
  session,
  encrypt,
  jwt,
}
