type ServerType = 'http' | 'websocket' | 'rpc'
export interface ServerValue {
  type: ServerType,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options';
  routerName: string;
}

export const SurveyServerConfigKey = Symbol('appConfig') // vm环境和worker环境上下文不一致导致不能使用Symbol
export function SurveyServer(surveyServer) {
  return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
    if (!target[SurveyServerConfigKey]) {
      target[SurveyServerConfigKey] = new Map<string, ServerValue>()
    }
    target[SurveyServerConfigKey].set(
      propertyKey,
      surveyServer
    )
  }
}