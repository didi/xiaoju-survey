import { HttpException } from './httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

export class I18nHttpException extends HttpException {
  constructor(
    public readonly i18nKey: string,
    public readonly code: EXCEPTION_CODE,
    public readonly args?: Record<string, any>,
    public readonly data?: any,
  ) {
    super(i18nKey, code, data);
    this.name = new.target.name;
  }
}
