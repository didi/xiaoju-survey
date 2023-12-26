import { SurveyApp, SurveyServer } from '../../decorator';
import { createReadStream } from 'fs';
import * as path from 'path';

@SurveyApp('')
export default class UI {
  @SurveyServer({ type: 'http', method: 'get', routerName: '/render/(.*)' })
  async render({ res }) {
    const filePath = path.join(__dirname, 'public', 'render.html');
    res.type = path.extname(filePath);
    return createReadStream(filePath);
  }
  @SurveyServer({ type: 'http', method: 'get', routerName: '/management/(.*)' })
  async management({ res }) {
    const filePath = path.join(__dirname, 'public', 'management.html');
    res.type = path.extname(filePath);
    return createReadStream(filePath);
  }
  @SurveyServer({ type: 'http', method: 'get', routerName: '/' })
  async index({ res }) {
    const filePath = path.join(__dirname, 'public', 'management.html');
    res.type = path.extname(filePath);
    return createReadStream(filePath);
  }
}