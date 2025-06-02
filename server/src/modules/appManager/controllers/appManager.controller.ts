import { Controller, Post, Body } from '@nestjs/common';
import { AppManagerService } from '../services/appManager.service';
import { APPList } from '../appConfg';
import { CreateTokenDto } from '../dto/createToken.dto';
import { VerifyTokenDto } from '../dto/verifyToken.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appManager')
@Controller('/api/appManager')
export class AppManagerController {
  constructor(private readonly appManager: AppManagerService) {}

  // 生成 appToken
  @Post('getToken')
  async getAppToken(@Body() body: CreateTokenDto) {
    const { appId } = body;
    if (!appId) {
      throw new Error('Missing required fields');
    }
    const appSecret = APPList.find((item) => item.appId === appId)?.appSecret;
    if (!appSecret) {
      throw new Error('Invalid appId');
    }
    const token = await this.appManager.generateToken(appId, appSecret);
    return {
      code: 200,
      data: token,
    };
  }

  // 认证请求
  @Post('verify')
  async verifySignature(@Body() body: VerifyTokenDto) {
    const { appId, appToken } = body;
    if (!appId || !appToken) {
      throw new Error('Missing required fields');
    }

    try {
      await this.appManager.checkAppManager(appId, appToken);
      return { code: 200, success: true };
    } catch (e) {
      throw new Error(e);
    }
  }
}
