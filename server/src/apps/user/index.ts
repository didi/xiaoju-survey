import { SurveyServer } from '../../decorator'
import { Request, Response } from 'koa'
import * as Joi from 'joi'
import { userService } from './service/userService'
import { getValidateValue } from './utils/index'


export default class User {
    @SurveyServer({ type: 'http', method: 'post', routerName: '/register' })
    async register({ req, res }: { req: Request, res: Response }) {
        const userInfo = getValidateValue(Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }).validate(req.body, { allowUnknown: true }));
        const userRegisterRes = await userService.register(userInfo)
        return {
            code: 200,
            data: userRegisterRes,
        }
    }

    @SurveyServer({ type: 'http', method: 'post', routerName: '/login' })
    async login({ req, res }: { req: Request, res: Response }) {
        const userInfo = getValidateValue(Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }).validate(req.body, { allowUnknown: true }));
        const data = await userService.login(userInfo)
        return {
            code: 200,
            data,
        }
    }

    @SurveyServer({ type: 'rpc' })
    async getUserByToken({ params, context }: { params: any, context: any }) {
        const data = await userService.getUserByToken({ token: params.token })
        return {
            result: data,
            context, // 上下文主要是传递调用方信息使用，比如traceid
        }
    }
}