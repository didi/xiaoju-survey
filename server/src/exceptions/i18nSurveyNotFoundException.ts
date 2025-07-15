import { SurveyNotFoundException } from './surveyNotFoundException';

export class I18nSurveyNotFoundException extends SurveyNotFoundException {
  constructor(
    public readonly i18nKey,
    public readonly args?: Record<string, any>,
  ) {
    // 兼容原 SurveyNotFoundException 的构造逻辑
    super(i18nKey);
  }
}
