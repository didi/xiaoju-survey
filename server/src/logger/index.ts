import * as log4js from 'log4js';
import moment from 'moment';
import { Injectable, Scope } from '@nestjs/common';
const log4jsLogger = log4js.getLogger();

@Injectable({ scope: Scope.REQUEST })
export class Logger {
  private static inited = false;
  private traceId: string;

  static init(config: { filename: string }) {
    if (Logger.inited) {
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
    Logger.inited = true;
  }

  _log(message, options: { dltag?: string; level: string }) {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const level = options?.level;
    const dltag = options?.dltag ? `${options.dltag}||` : '';
    const traceIdStr = this.traceId ? `traceid=${this.traceId}||` : '';
    return log4jsLogger[level](
      `[${datetime}][${level.toUpperCase()}]${dltag}${traceIdStr}${message}`,
    );
  }

  setTraceId(traceId: string) {
    this.traceId = traceId;
  }

  info(message, options?: { dltag?: string }) {
    return this._log(message, { ...options, level: 'info' });
  }

  error(message, options?: { dltag?: string }) {
    return this._log(message, { ...options, level: 'error' });
  }
}
