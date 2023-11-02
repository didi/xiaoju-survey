import { mongo } from '../db/mongo'
import { DICT_TYPE } from '../types/index'
import { participle } from '../utils/index'

class SecurityService {
    async isHitKeys({ content, dictType }: { content: string, dictType: DICT_TYPE }) {
        const securityDictModel = await mongo.getCollection({ collectionName: 'securityDict' });
        const keywordList = participle({ content })
        const hitCount = await securityDictModel.countDocuments({ keyword: { $in: keywordList }, type: dictType })
        return hitCount > 0
    }
}

export const securityService = new SecurityService()