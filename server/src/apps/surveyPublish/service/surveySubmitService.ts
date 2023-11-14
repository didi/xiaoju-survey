import { mongo } from '../db/mongo'
import { getStatusObject, getMapByKey } from '../utils/index'
import { SURVEY_STATUS, CommonError } from '../../../types/index'
import { surveyKeyStoreService } from './surveyKeyStoreService'
import * as moment from 'moment'

class SurveySubmitService {
    async submit({ surveySubmitData }: { surveySubmitData: any }) {
        const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
        const surveyMetaRes = mongo.convertId2StringByDoc(
            await surveyMeta.findOne({ surveyPath: surveySubmitData.surveyPath })
        )
        if (!surveyMetaRes) {
            throw new CommonError('该问卷已不存在,无法提交')
        }
        const pageId = surveyMetaRes._id.toString()
        const surveyPublish = await mongo.getCollection({ collectionName: 'surveyPublish' });
        const publishConf = await surveyPublish.findOne({ pageId })
        const surveySubmit = await mongo.getCollection({ collectionName: 'surveySubmit' });
        if (surveySubmitData.encryptType === 'base64') {
            surveySubmitData.data = JSON.parse(decodeURIComponent(Buffer.from(surveySubmitData.data, "base64").toString()))
        } else {
            surveySubmitData.data = JSON.parse(surveySubmitData.data)
        }
        // 提交时间限制
        const begTime = publishConf?.code?.baseConf?.begTime || 0
        const endTime = publishConf?.code?.baseConf?.endTime || 0
        if (begTime && endTime) {
            const nowStamp = Date.now()
            const begTimeStamp = new Date(begTime).getTime()
            const endTimeStamp = new Date(endTime).getTime()
            if (nowStamp < begTimeStamp || nowStamp > endTimeStamp) {
                throw new CommonError('不在答题有效期内')
            }
        }
        // 提交时间段限制
        const answerBegTime = publishConf?.code?.baseConf?.answerBegTime || "00:00:00"
        const answerEndTime = publishConf?.code?.baseConf?.answerEndTime || "23:59:59"
        if (answerBegTime && answerEndTime) {
            const nowStamp = Date.now()
            const ymdString = moment().format('YYYY-MM-DD');
            const answerBegTimeStamp = new Date(`${ymdString} ${answerBegTime}`).getTime()
            const answerEndTimeStamp = new Date(`${ymdString} ${answerEndTime}`).getTime()
            if (nowStamp < answerBegTimeStamp || nowStamp > answerEndTimeStamp) {
                throw new CommonError('不在答题时段内')
            }
        }
        // 提交总数限制
        const tLimit = publishConf?.code?.baseConf?.tLimit || 0
        if (tLimit > 0) {
            // 提升性能可以使用redis
            let nowSubmitCount = await surveySubmit.countDocuments({ surveyPath: surveySubmitData.surveyPath }) || 0
            if (nowSubmitCount >= tLimit) {
                throw new CommonError('超出提交总数限制')
            }
        }
        // 投票信息保存
        const dataList = publishConf?.code?.dataConf?.dataList || []
        const dataListMap = getMapByKey({ data: dataList, key: 'field' })
        const surveySubmitDataKeys = Object.keys(surveySubmitData.data)
        for (const field of surveySubmitDataKeys) {
            const configData = dataListMap[field]
            if (configData && /vote/.exec(configData.type)) {
                const voteData = (await surveyKeyStoreService.get({ surveyPath: surveySubmitData.surveyPath, key: field, type: 'vote' })) || { total: 0 }
                voteData.total++;
                if (!voteData[surveySubmitData.data[field]]) {
                    voteData[surveySubmitData.data[field]] = 1
                } else {
                    voteData[surveySubmitData.data[field]]++;
                }
                await surveyKeyStoreService.set({ surveyPath: surveySubmitData.surveyPath, key: field, data: voteData, type: 'vote' })
            }
        }
        // 提交问卷
        const surveySubmitRes = await surveySubmit.insertOne({
            ...surveySubmitData,
            pageId,
            curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
            createDate: Date.now()
        })
        return surveySubmitRes
    }
}

export const surveySubmitService = new SurveySubmitService()