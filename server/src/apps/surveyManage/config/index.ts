const config = {
    mongo: {
        url: process.env.xiaojuSurveyMongoUrl || 'mongodb://localhost:27017',
        dbName: 'surveyEengine'
    }
}

export function getConfig() {
    return config
}