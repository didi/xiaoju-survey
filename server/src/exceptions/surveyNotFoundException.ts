import { HttpException } from './httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

export class SurveyNotFoundException extends HttpException {
  constructor(public readonly message: string) {
    super(message, EXCEPTION_CODE.SURVEY_NOT_FOUND);
  }
}
