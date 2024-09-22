import { SecurityPlugin } from '../interface';
import { customAlphabet } from 'nanoid';

const surveyPathAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export class SurveyUtilPlugin implements SecurityPlugin {
  genSurveyPath() {
    const id = customAlphabet(surveyPathAlphabet, 8);
    return id();
  }
}
