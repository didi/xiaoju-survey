import { Controller, Post, Body } from '@nestjs/common';
import { AppManagerService } from '../services/appManager.service';
import { APPList } from '../appConfg'
import { CreateTokenDto } from '../dto/createToken.dto';
import { VerifyTokenDto } from '../dto/verifyToken.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appManager')
@Controller('/api/appManager')
export class AppManagerController {
  constructor(private readonly appManager: AppManagerService) {}

  // 生成 appToken
  @Post('getToken')
  getAppToken( 
    @Body() body: CreateTokenDto
  ) {
    const { appId } = body;
    if (!appId) {
      throw new Error('Missing required fields');
    }
    const appSecret = APPList.find(item => item.appId === appId)?.appSecret;
    if(!appSecret) {
      throw new Error('Invalid appId');
    }
    return this.appManager.generateToken(appId, appSecret);
  }

  // 认证请求
  @Post('verify')
  verifySignature(
    @Body() body: VerifyTokenDto
  ) {
    const { appId, appToken } = body
    if (!appId || !appToken) {
      throw new Error('Missing required fields');
    }

    if(this.appManager.checkAppManager(appId, appToken)) {
      return { code: 200, success: true };
    } else {
      throw new Error('Invalid appId or appToken');
    }
  }
}
