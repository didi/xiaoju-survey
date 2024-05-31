import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from './httpException';

@Catch(Error)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 500;

    if (exception instanceof HttpException) {
      status = HttpStatus.OK; // 非系统报错状态码为200
      message = exception.message;
      code = exception.code;
    }

    response.status(status).json({
      message,
      code,
      errmsg: exception.message,
    });
  }
}
