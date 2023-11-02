import { rpcInvote } from '../../../rpc'
import { Request } from 'koa'
import { UserType, CommonError } from '../types/index'

class UserService {
    async checkLogin({ req }: { req: Request }) {
        if (!req.headers['authorization']) {
            throw new CommonError('请先登录', 403)
        }
        const token = (String(req.headers['authorization']) || '').replace("Bearer ", "")
        const rpcResult = await rpcInvote<any, { result: UserType }>('user.getUserByToken', {
            params: { token },
            context: req
        })
        return rpcResult.result
    }
}

export const userService = new UserService()