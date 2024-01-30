import { XiaojuSurveyPlugin } from '../interface';
import { customAlphabet } from 'nanoid';

const surveyPathAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export class SurveyUtilPlugin implements XiaojuSurveyPlugin {
  genSurveyPath() {
    const id = customAlphabet(surveyPathAlphabet, 8);
    return id();
  }
}
