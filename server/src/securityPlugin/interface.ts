export interface XiaojuSurveyPlugin {
  beforeResponseDataCreate?(responseData);
  afterResponseFind?(responseData);
  desensitiveData?(data: Record<string, any>);
  genSurveyPath?();
}
