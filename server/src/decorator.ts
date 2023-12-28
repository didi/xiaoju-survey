type ServerType = 'http' | 'websocket' | 'rpc'
export interface RouterOptions {
  type: ServerType,
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options';
  routerName?: string;
}

export const surveyServerKey = Symbol('surveyServer'); // vm环境和worker环境上下文不一致导致不能使用Symbol
export const surveyAppKey = Symbol('surveyApp');

export function SurveyApp(routerName) {
  return (target: unknown) => {
    if (!target[surveyAppKey]) {
      target[surveyAppKey] = routerName;
    }
  };
}

export function SurveyServer(options: RouterOptions) {
  return function(target: unknown, propertyKey: string) {
    if (!target[surveyServerKey]) {
      target[surveyServerKey] = new Map<string, RouterOptions>();
    }
    target[surveyServerKey].set(
      propertyKey,
      options
    );
  };
}