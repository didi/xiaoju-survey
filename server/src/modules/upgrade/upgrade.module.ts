import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UpgradeService } from './services/upgrade.service';

import { Collaborator } from 'src/models/collaborator.entity';
import { Counter } from 'src/models/counter.entity';
import { DownloadTask } from 'src/models/downloadTask.entity';
import { MessagePushingLog } from 'src/models/messagePushingLog.entity';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Session } from 'src/models/session.entity';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { SurveyHistory } from 'src/models/surveyHistory.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { User } from 'src/models/user.entity';
import { Workspace } from 'src/models/workspace.entity';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';

import { UpgradeController } from './controllers/upgrade.controller';
import { AuthModule } from '../auth/auth.module';

import { Logger } from 'src/logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collaborator,
      Counter,
      DownloadTask,
      MessagePushingLog,
      MessagePushingTask,
      ResponseSchema,
      Session,
      SurveyConf,
      SurveyHistory,
      SurveyMeta,
      SurveyResponse,
      User,
      Workspace,
      WorkspaceMember,
    ]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [UpgradeController],
  providers: [UpgradeService, Logger],
  exports: [UpgradeService],
})
export class UpgradeModule {}
