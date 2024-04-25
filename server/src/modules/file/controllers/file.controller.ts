import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Request,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from '../services/file.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { AuthenticationException } from 'src/exceptions/authException';
import { ConfigService } from '@nestjs/config';

@Controller('/api/file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getPathPrefix(fileKeyPrefix: string, data: Record<string, string>) {
    const regex = /\{([^}]*)\}/g;
    let matches;
    const keys = [];
    while ((matches = regex.exec(fileKeyPrefix)) !== null) {
      keys.push(matches[1]);
    }
    let result = fileKeyPrefix;
    for (const key of keys) {
      if (!data[key]) {
        throw new HttpException(
          `参数有误：${data[key]}`,
          EXCEPTION_CODE.PARAMETER_ERROR,
        );
      }
      result = result.replace(new RegExp(`{${key}}`), data[key]);
    }
    return result;
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() reqBody,
  ) {
    const { channel } = reqBody;

    if (!channel || !this.configService.get<string>(channel)) {
      throw new HttpException(
        `参数有误：${channel}`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const configKey = this.configService.get<string>(channel);
    const needAuth = this.configService.get<boolean>(configKey);
    if (needAuth) {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new AuthenticationException('请登录');
      }
      await this.authService.verifyToken(token);
    }
    const fileKeyPrefix = this.configService.get<string>(
      `${configKey}.FILE_KEY_PREFIX`,
    );

    const { key, url } = await this.fileService.upload({
      configKey,
      file,
      pathPrefix: fileKeyPrefix,
    });
    return {
      code: 200,
      data: {
        url,
        key,
      },
    };
  }

  @Post('getUrl')
  @HttpCode(200)
  async generateGetUrl(@Body() reqBody) {
    const { channel, key } = reqBody;
    if (!channel || !key || !this.configService.get<string>(channel)) {
      throw new HttpException(
        '参数有误，请检查channel、key',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const configKey = this.configService.get<string>(channel);
    const url = this.fileService.getUrl({ configKey, key });
    return {
      code: 200,
      data: {
        key,
        url,
      },
    };
  }
}
