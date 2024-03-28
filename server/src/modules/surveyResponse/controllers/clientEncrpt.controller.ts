import { Controller, Get, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import * as forge from 'node-forge';
import { ENCRYPT_TYPE } from 'src/enums/encrypt';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('surveyResponse')
@Controller('/api/clientEncrypt')
export class ClientEncryptController {
  constructor(
    private readonly clientEncryptService: ClientEncryptService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/getEncryptInfo')
  @HttpCode(200)
  async getEncryptInfo() {
    const encryptType = this.configService.get<string>(
      'XIAOJU_SURVEY_HTTP_DATA_ENCRYPT_TYPE',
    );
    let data = {};
    if (encryptType === 'rsa') {
      const { publicKey, privateKey } = await this.getRsaInfo();

      const rsaInfo = await this.clientEncryptService.addRsa({
        publicKey,
        privateKey,
      });
      data = {
        data: {
          secretKey: rsaInfo.data.publicKey,
          sessionId: rsaInfo._id.toString(),
        },
        encryptType: ENCRYPT_TYPE.RSA,
      };
    }
    return {
      code: 200,
      data,
    };
  }

  getRsaInfo(): Promise<{ publicKey; privateKey }> {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
    return Promise.resolve({ publicKey, privateKey });
  }
}
