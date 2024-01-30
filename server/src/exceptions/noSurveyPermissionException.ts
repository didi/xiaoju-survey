import { HttpException } from './httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

export class NoSurveyPermissionException extends HttpException {
  constructor(public readonly message: string) {
    super(message, EXCEPTION_CODE.NO_SURVEY_PERMISSION);
  }
}
