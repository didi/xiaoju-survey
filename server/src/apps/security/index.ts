import { SurveyServer } from '../../decorator'
import { securityService } from './service/securityService'

export default class Security {
  @SurveyServer({ type: 'rpc' })
  async isHitKeys({ params, context }: { params: any, context: any }) {
    const data = securityService.isHitKeys({
      content: params.content,
      dictType: params.dictType,
    })
    return {
      result: data,
      context, // 上下文主要是传递调用方信息使用，比如traceid
    }
  }
}