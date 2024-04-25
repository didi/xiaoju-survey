import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';

import { FileService } from './services/file.service';

import { FileController } from './controllers/file.controller';

import { uploadConfig, channels } from './config/index';

@Module({
  imports: [
    // 管理端和渲染端分开配置，因为管理端上传的内容一般需要公开，渲染端上传的内容一般需要限制访问，防止被当作图床
    ConfigModule.forFeature(() => {
      return {
        ...channels,
        ...uploadConfig,
      };
    }),
    AuthModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
