import { mongo } from '../db/mongo'
import { surveyKeyStoreService } from './surveyKeyStoreService'
import { CommonError } from '../../../types/index'

class SurveyPublishService {
    async get({ surveyPath }: { surveyPath: string }) {
        const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
        const surveyMetaData = await surveyMeta.findOne({ surveyPath })
        if (!surveyMetaData) {
            throw new CommonError('该问卷已不存在')
        }
        const surveyMetaRes = mongo.convertId2StringByDoc(surveyMetaData)
        const surveyPublish = await mongo.getCollection({ collectionName: 'surveyPublish' });
        const surveyPublishData = await surveyPublish.findOne({ pageId: surveyMetaRes._id.toString() }, { sort: { createDate: -1 } })
        if (!surveyPublishData) {
            throw new CommonError('该问卷未发布')
        }
        const surveyPublishRes = mongo.convertId2StringByDoc(surveyPublishData)
        return {
            surveyMetaRes,
            surveyPublishRes
        }
    }

    async queryVote({ surveyPath, voteKeyList }: { surveyPath: string, voteKeyList: Array<string> }) {
        return await surveyKeyStoreService.getAll({ surveyPath, keyList: voteKeyList, type: 'vote' })
    }

}

export const surveyPublishService = new SurveyPublishService()