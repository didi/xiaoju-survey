import {
    verify as jwtVerify,
    sign as jwtSign
} from 'jsonwebtoken';
import {
    createHash
} from 'crypto';
import { mongo } from '../db/mongo'
import { getStatusObject } from '../utils/index'
import { SURVEY_STATUS, CommonError } from '../types/index'
import { getConfig } from '../config/index'
const config = getConfig()


class UserService {

    hash256(text) {
        return createHash('sha256').update(text).digest('hex')
    }


    getToken(userInfo) {
        return jwtSign(userInfo, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    }

    async register(userInfo: { username: string, password: string }) {
        const user = await mongo.getCollection({ collectionName: 'user' });
        const userRes = await user.findOne({
            username: userInfo.username,
        })
        if (userRes) {
            throw new CommonError('该用户已存在')
        }
        const userInsertRes = await user.insertOne({
            username: userInfo.username,
            password: this.hash256(userInfo.password),
            curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
            createDate: Date.now()
        })
        const token = this.getToken({
            _id: userInsertRes.insertedId.toString(),
            username: userInfo.username
        });
        return { userInsertRes, token, username: userInfo.username }
    }

    async login(userInfo: { username: string, password: string }) {
        const user = await mongo.getCollection({ collectionName: 'user' });
        const userRes = await user.findOne({
            username: userInfo.username,
            password: this.hash256(userInfo.password),
        })
        if (!userRes) {
            throw new CommonError('用户名或密码错误')
        }
        const token = this.getToken({
            _id: userRes._id.toString(),
            username: userInfo.username
        });
        return { token, username: userInfo.username }
    }

    async getUserByToken(tokenInfo: { token: string }) {
        let userInfo;
        try {
            userInfo = jwtVerify(tokenInfo.token, config.jwt.secret)
        } catch (err) {
            throw new CommonError('用户凭证无效或已过期', 403)
        }
        const user = await mongo.getCollection({ collectionName: 'user' });
        const userRes = await user.findOne({
            _id: mongo.getObjectIdByStr(userInfo._id),
        })
        if (!userRes) {
            throw new CommonError('用户已不存在')
        }
        return mongo.convertId2StringByDoc(userRes);
    }
}

export const userService = new UserService()