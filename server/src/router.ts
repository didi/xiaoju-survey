import * as Router from 'koa-router';
import { Context } from 'koa';
import { RouterOptions, surveyAppKey, surveyServerKey } from './decorator';
import Security from './apps/security';
import SurveyManage from './apps/surveyManage';
import SurveyPublish from './apps/surveyPublish';
import UI from './apps/ui';
import User from './apps/user';
import appRegistry from './registry';


export async function initRouter(app) {
  const rootRouter = new Router();
  const apps = [Security, SurveyManage, SurveyPublish, UI, User];

  for (const subApp of apps) {
    const instance = new subApp();

    const moduleRouter = new Router();

    const serverConfig: Map<string, RouterOptions> = instance[surveyServerKey];
    
    for (const [serverName, serverValue] of serverConfig.entries()) {
      if (serverValue.routerName) {
        const method = serverValue.method || 'get';
        moduleRouter[method](serverValue.routerName, async (ctx: Context, next) => {
          const ret = await instance[serverName]({ req: ctx.request, res: ctx.response }, next);
          ctx.body = ret;
        });
      }
    }
    rootRouter.use(subApp[surveyAppKey], moduleRouter.routes());

    appRegistry.registerApp(instance.constructor.name.toLowerCase(), instance);

  }
  // console.log(rootRouter);
  app.use(rootRouter.routes());
}