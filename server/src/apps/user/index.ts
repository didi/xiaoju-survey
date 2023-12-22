import { SurveyServer } from '../../decorator'
import { Request, Response } from 'koa'
import * as Joi from 'joi'
import { userService } from './service/userService'
import { captchaService } from './service/captchaService'
import { getValidateValue } from './utils/index'

import { CommonError } from '../../types/index'
export default class User {
    @SurveyServer({ type: 'http', method: 'post', routerName: '/register' })
    async register({ req, res }: { req: Request, res: Response }) {
        const userInfo = getValidateValue(Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            captchaId: Joi.string().required(),
            captcha: Joi.string().required(),
        }).validate(req.body, { allowUnknown: true }));
        const isCorrect = await captchaService.checkCaptchaIsCorrect({ captcha: userInfo.captcha, id: userInfo.captchaId })
        if (!isCorrect) {
            throw new CommonError('验证码不正确')
        }
        const userRegisterRes = await userService.register({
            username: userInfo.username,
            password: userInfo.password,
        })
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
            captchaId: Joi.string().required(),
            captcha: Joi.string().required(),
        }).validate(req.body, { allowUnknown: true }));
        const isCorrect = await captchaService.checkCaptchaIsCorrect({ captcha: userInfo.captcha, id: userInfo.captchaId })
        if (!isCorrect) {
            throw new CommonError('验证码不正确')
        }
        const data = await userService.login({
            username: userInfo.username,
            password: userInfo.password,
        })
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

    @SurveyServer({ type: 'http', method: 'post', routerName: '/captcha' })
    async refreshCaptcha() {
        const captchaData = captchaService.createCaptcha()
        const res = await captchaService.addCaptchaData({ text: captchaData.text })
        return {
            code: 200,
            data: {
                id: res.insertedId,
                img: captchaData.data,
            },
        }
    }
}