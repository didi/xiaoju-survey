import * as os from 'os';
import * as Koa from 'koa';
import * as KoaBodyparser from 'koa-bodyparser';
import * as KoaStatic from 'koa-static';
import * as logger from 'koa-pino-logger';
import { initRouter } from './router';
import { outputCatch } from './middleware/outputCatch';
import * as path from 'path';

async function main() {
  const app = new Koa();
  app.use(outputCatch({ showErrorStack: true }));
  app.use(logger());
  app.use(KoaBodyparser({
    formLimit: '30mb',
    jsonLimit: '30mb',
    textLimit: '30mb',
    xmlLimit: '30mb',
  }));

  await initRouter(app);

  app.use(KoaStatic(path.join(__dirname, './apps/ui/public')));

  const port = process.env.PORT || 3000;
  app.listen(port);
  process.stdout.write(`${os.EOL}server run: http://127.0.0.1:${port} ${os.EOL}`);
}

main();
