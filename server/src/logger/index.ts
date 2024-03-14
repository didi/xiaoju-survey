import * as log4js from 'log4js';
import moment from 'moment';
import { REQUEST } from '@nestjs/core';
import { Inject, Request } from '@nestjs/common';
const log4jsLogger = log4js.getLogger();

export class Logger {
  private static inited = false;

  constructor(@Inject(REQUEST) private req: Request) {}

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

  _log(message, options: { dltag?: string; level: string }) {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const level = options.level;
    const dltag = options.dltag ? `${options.dltag}||` : '';
    const traceIdStr = this.req['traceId']
      ? `traceid=${this.req['traceId']}||`
      : '';
    return log4jsLogger[level](
      `[${datetime}][${level.toUpperCase()}]${dltag}${traceIdStr}${message}`,
    );
  }

  info(message, options = { dltag: '' }) {
    return this._log(message, { ...options, level: 'info' });
  }

  error(message, options = { dltag: '' }) {
    return this._log(message, { ...options, level: 'error' });
  }
}
