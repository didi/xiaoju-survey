export interface SecurityPlugin {
  encryptResponseData?(responseData);
  afterResponseFind?(responseData);
  maskData?(data: Record<string, any>);
  genSurveyPath?();
}
