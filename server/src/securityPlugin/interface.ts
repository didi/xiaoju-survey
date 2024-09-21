export interface XiaojuSurveyPlugin {
  encryptResponseData?(responseData);
  afterResponseFind?(responseData);
  maskData?(data: Record<string, any>);
  genSurveyPath?();
}
