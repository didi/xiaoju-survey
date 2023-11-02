import { SurveyServer } from '../../decorator'
import { Request, Response } from 'koa'
import { createReadStream } from 'fs'
import * as path from 'path'

export default class UI {
@SurveyServer({ type: 'http', method: 'get', routerName: '/render/(.*)' })
  async render({ req, res }: {req:Request, res:Response}) {
    const filePath = path.join(__dirname, 'public', 'render.html');
    res.type = path.extname(filePath)
    return createReadStream(filePath)
  }
 @SurveyServer({ type: 'http', method: 'get', routerName: '/management/(.*)' })
  async management({ req, res }: {req:Request, res:Response}) {
    const filePath = path.join(__dirname, 'public', 'management.html');
    res.type = path.extname(filePath)
    return createReadStream(filePath)
  }
  @SurveyServer({ type: 'http', method: 'get', routerName: '/(.*)' })
  async index({ req, res }: {req:Request, res:Response}) {
    let reqPath = req.path;
    if (req.path === '/') {
      reqPath = '/management.html'
    }
    const filePath = path.join(__dirname, 'public', reqPath);
    res.type = path.extname(filePath)
    return createReadStream(filePath)
  }
}