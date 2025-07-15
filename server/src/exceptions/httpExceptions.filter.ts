import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from './httpException';
import { I18nHttpException } from './i18nHttpException';
import { I18nContext } from 'nestjs-i18n';

@Catch(Error)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const i18n = I18nContext.current<I18nTranslations>(host);
    console.log('current language', i18n.lang);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 500;
    let data;

    if (exception instanceof I18nHttpException) {
      status = HttpStatus.OK;
      code = exception.code;
      data = exception.data;

      message = i18n.t(exception.i18nKey as keyof I18nTranslations, {
        args: exception.args,
      });
    } else if (exception instanceof HttpException) {
      status = HttpStatus.OK; // 非系统报错状态码为200
      message = exception.message;
      code = exception.code;
      data = exception.data;
    }

    response.status(status).json({
      message,
      code,
      errmsg: exception.message,
      data,
    });
  }
}
