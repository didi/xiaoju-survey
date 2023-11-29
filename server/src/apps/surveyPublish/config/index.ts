const config = {
    mongo:{
        url: process.env.xiaojuSurveyMongoUrl ||'mongodb://localhost:27017',
        dbName:'xiaojuSurvey',
    },
    session:{
        expireTime: parseInt(process.env.xiaojuSurveySessionExpireTime) || 8*3600*1000
    },
    encrypt:{
        type: process.env.xiaojuSurveyEncryptType ||'aes',
        aesCodelength: parseInt(process.env.xiaojuSurveyAesCodelength) || 10 //aes密钥长度
    }
}

export function getConfig() {
    return config
}