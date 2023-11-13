import * as os from 'os'
import * as Koa from 'koa';
import * as KoaBodyparser from 'koa-bodyparser'
import * as logger from 'koa-pino-logger'
import { getRouter } from './router'
import { outputCatch } from './middleware/outputCatch'

const app = new Koa();
app.use(outputCatch({ showErrorStack: true }))
app.use(logger())
app.use(KoaBodyparser({
    formLimit: '30mb',
    jsonLimit: '30mb',
    textLimit: '30mb',
    xmlLimit: '30mb',
}))

app.use(getRouter().routes())
const port = process.env.PORT || 3000
app.listen(port)
process.stdout.write(`${os.EOL}server run: http://127.0.0.1:${port} ${os.EOL}`)