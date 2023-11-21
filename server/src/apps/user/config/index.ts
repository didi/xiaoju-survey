const config = {
    mongo:{
        url: process.env.xiaojuSurveyMongoUrl ||'mongodb://localhost:27017',
        dbName:'xiaojuSurvey',
    },
    jwt:{
        secret: process.env.xiaojuSurveyJwtSecret || 'xiaojuSurveyJwtSecret',
        expiresIn: process.env.xiaojuSurveyJwtExpiresIn || '8h',
    }
}

export function getConfig() {
    return config
}