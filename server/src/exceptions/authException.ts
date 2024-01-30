import { HttpException } from './httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
export class AuthtificationException extends HttpException {
  constructor(public readonly message: string) {
    super(message, EXCEPTION_CODE.AUTHTIFICATION_FAILED);
  }
}
