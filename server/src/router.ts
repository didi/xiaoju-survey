import * as Router from 'koa-router';
import { Context } from 'koa'
import { SurveyServerConfigKey } from './decorator';

import Ui from './apps/ui/index'
import SurveyManage from './apps/surveyManage/index'
import SurveyPublish from './apps/surveyPublish/index'
import User from './apps/user/index'


function loadAppRouter(app, appRouter) {
    const appServerConfigMap = app[SurveyServerConfigKey]
    for (const [serveName, serveValue] of appServerConfigMap) {
        const middleware = async (ctx: Context) => {
            const data = await app[serveName]({ req: ctx.request, res: ctx.response })
            return ctx.body = data
        }
        const method = serveValue.method || 'all'
        const routerName = serveValue.routerName || `/${serveName}`
        appRouter[method](routerName, middleware)
    }
    return appRouter
}

export function getRouter() {
    const rootRouter = new Router()
    const apiAppMap = {
        surveyManage: new SurveyManage(),
        surveyPublish: new SurveyPublish(),
        user: new User(),
    }
    for (const [apiAppName, apiApp] of Object.entries(apiAppMap)) {
        const appRouter = new Router()
        loadAppRouter(apiApp, appRouter)
        rootRouter.use(`/api/${apiAppName}`, appRouter.routes(), rootRouter.allowedMethods())
    }
    loadAppRouter(new Ui(), rootRouter)
    return rootRouter
}