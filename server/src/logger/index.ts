import * as log4js from 'log4js';
import moment from 'moment';
import { Request } from 'express';
const log4jsLogger = log4js.getLogger();

export class Logger {
  private static inited = false;

  constructor() {}

  static init(config: { filename: string }) {
    if (this.inited) {
      return;
    }
    log4js.configure({
      appenders: {
        app: {
          type: 'dateFile',
          filename: config.filename || './logs/app.log',
          pattern: 'yyyy-MM-dd',
          alwaysIncludePattern: true,
          numBackups: 7,
          layout: {
            type: 'pattern',
            pattern: '%m',
          },
        },
      },
      categories: {
        default: { appenders: ['app'], level: 'trace' },
      },
    });
  }

  _log(message, options: { dltag?: string; level: string; req?: Request }) {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const level = options.level;
    const dltag = options.dltag ? `${options.dltag}||` : '';
    const traceIdStr = options?.req['traceId']
      ? `traceid=${options?.req['traceId']}||`
      : '';
    return log4jsLogger[level](
      `[${datetime}][${level.toUpperCase()}]${dltag}${traceIdStr}${message}`,
    );
  }

  info(message, options?: { dltag?: string; req?: Request }) {
    return this._log(message, { ...options, level: 'info' });
  }

  error(message, options: { dltag?: string; req?: Request }) {
    return this._log(message, { ...options, level: 'error' });
  }
}
