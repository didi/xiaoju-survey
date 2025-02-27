import { Injectable } from '@nestjs/common';
import { verify as jwtVerify, sign as jwtSign } from 'jsonwebtoken';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { APPList } from '../appConfg'


@Injectable()
export class AppManagerService {
  async generateToken(
    appId: string,
    secret: string,
  ) {
    return jwtSign(appId, secret);
  }
  
  async checkAppManager(appId, appToken): Promise<boolean> {
    if (!appToken && !appId) {
      throw new HttpException(
        '请在header中传入app-token或者参数带有appid',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    if (!appId || !appToken) {
      throw new HttpException(
        '不是有效的token或appid',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    // 如果appid为test，且为本地环境或测试环境跳过
    if (appId === 'test' && ['local', 'stable'].includes(process.env.SERVER_ENV)) {
      return true;
    }
    
    if(appToken) {
      const appSecret = APPList.find(item => item.appId === appId)?.appSecret;
      return Boolean(jwtVerify(appToken, appSecret));
    } else { 
      throw new HttpException(
        'APPID未在服务中注册',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
  }
}