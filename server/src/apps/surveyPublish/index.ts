import { SurveyServer } from '../../decorator'
import { Request, Response } from 'koa'
import { surveySubmitService } from './service/surveySubmitService'
import { surveyPublishService } from './service/surveyPublishService'
import { getValidateValue } from './utils/index'
import { checkSign } from './utils/checkSign'
import * as Joi from 'joi'

export default class SurveyPublish {
  // 获取发布配置
  @SurveyServer({ type: 'http', method: 'get', routerName: '/getSurveyPublish' })
  async getSurveyPublish({ req, res }: { req: Request, res: Response }) {
    const surveySubmitData = getValidateValue(Joi.object({
      surveyPath: Joi.string().required(),
    }).validate(req.query, { allowUnknown: true }));
    const data = await surveyPublishService.get(surveySubmitData)
    return {
      code: 200,
      data: data.surveyPublishRes,
    }
  }
  // 获取投票
  @SurveyServer({ type: 'http', method: 'get', routerName: '/queryVote' })
  async queryVote({ req, res }: { req: Request, res: Response }) {
    const params = getValidateValue(Joi.object({
      surveyPath: Joi.string().required(),
      voteKeyList: Joi.string().required(),
    }).validate(req.query, { allowUnknown: true }));
    params.voteKeyList = params.voteKeyList.split(',')
    const data = await surveyPublishService.queryVote(params)
    return {
      code: 200,
      data: data,
    }
  }

  @SurveyServer({ type: 'http', method: 'get', routerName: '/getEncryptInfo' })
  async getEncryptInfo({ req, res }: { req: Request, res: Response }) {
    const data = await surveySubmitService.getEncryptInfo()
    return {
      code: 200,
      data: data,
    }
  }
  // 提交问卷
  @SurveyServer({ type: 'http', method: 'post', routerName: '/submit' })
  async submit({ req, res }: { req: Request, res: Response }) {
    // 检查签名
    checkSign(req.body)
    // 校验参数
    const surveySubmitData = getValidateValue(Joi.object({
      surveyPath: Joi.string().required(),
      data: Joi.string().required(),
      encryptType: Joi.string(),
      sessionId: Joi.string(),
    }).validate(req.body, { allowUnknown: true }));
    await surveySubmitService.submit({ surveySubmitData })
    return {
      code: 200,
      msg: "报名成功",
    }
  }
}