import * as Router from 'koa-router';
import { Context } from 'koa';
import { RouterOptions, surveyAppKey, surveyServerKey } from './decorator';
import { glob } from 'glob';
import * as path from 'path';
import appRegistry from './registry';


export async function initRouter(app) {
  const rootRouter = new Router();
  const entries = await glob(path.join(__dirname, './apps/*/index.ts'));

  for (const entry of entries) {
    const module = await import(entry);
    const instance = new module.default();

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
    rootRouter.use(module.default[surveyAppKey], moduleRouter.routes());

    appRegistry.registerApp(instance.constructor.name.toLowerCase(), instance);

  }
  // console.log(rootRouter);
  app.use(rootRouter.routes());
}