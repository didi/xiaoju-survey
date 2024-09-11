import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { MessageModule } from '../message/message.module';

import { UpgradeService } from './services/upgrade.service';

import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Counter } from 'src/models/counter.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { Logger } from 'src/logger';
import { SurveyMeta } from 'src/models/surveyMeta.entity';

import { UpgradeController } from './controllers/upgrade.controller';

import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResponseSchema,
      Counter,
      SurveyResponse,
      ClientEncrypt,
      SurveyMeta,
    ]),
    ConfigModule,
    MessageModule,
    AuthModule,
    WorkspaceModule,
  ],
  controllers: [UpgradeController],
  providers: [UpgradeService, Logger],
  exports: [UpgradeService],
})
export class UpgradeModule {}
