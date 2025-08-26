import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerProvider } from 'src/logger/logger.provider';

import { SurveyResponseModule } from '../surveyResponse/surveyResponse.module';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { FileModule } from '../file/file.module';

import { DataStatisticController } from './controllers/dataStatistic.controller';
import { SurveyController } from './controllers/survey.controller';
import { SurveyHistoryController } from './controllers/surveyHistory.controller';
import { SurveyMetaController } from './controllers/surveyMeta.controller';
import { SurveyUIController } from './controllers/surveyUI.controller';
import { CollaboratorController } from './controllers/collaborator.controller';
import { DownloadTaskController } from './controllers/downloadTask.controller';
import { SessionController } from './controllers/session.controller';
import { SurveyGroupController } from './controllers/surveyGroup.controller';
import { RecycleBinController } from './controllers/recycleBin.controller';
import { AIGenerateController } from './controllers/ai-generate.controller';

import { SurveyConf } from 'src/models/surveyConf.entity';
import { SurveyHistory } from 'src/models/surveyHistory.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { SurveyGroup } from 'src/models/surveyGroup.entity';
import { Word } from 'src/models/word.entity';
import { Collaborator } from 'src/models/collaborator.entity';
import { DownloadTask } from 'src/models/downloadTask.entity';

import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';
import { DataStatisticService } from './services/dataStatistic.service';
import { SurveyConfService } from './services/surveyConf.service';
import { SurveyHistoryService } from './services/surveyHistory.service';
import { SurveyMetaService } from './services/surveyMeta.service';
import { ContentSecurityService } from './services/contentSecurity.service';
import { CollaboratorService } from './services/collaborator.service';
import { AIGenerateService } from './services/ai-generate.service';

import { Counter } from 'src/models/counter.entity';
import { CounterService } from '../surveyResponse/services/counter.service';
import { FileService } from '../file/services/file.service';
import { DownloadTaskService } from './services/downloadTask.service';
import { SessionService } from './services/session.service';
import { SurveyGroupService } from './services/surveyGroup.service';
import { Session } from 'src/models/session.entity';
import { WorkspaceService } from '../workspace/services/workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyMeta,
      SurveyConf,
      SurveyHistory,
      SurveyResponse,
      Word,
      Collaborator,
      Counter,
      DownloadTask,
      Session,
      SurveyGroup,
    ]),
    ConfigModule,
    SurveyResponseModule,
    AuthModule,
    WorkspaceModule,
    FileModule,
  ],
  controllers: [
    DataStatisticController,
    SurveyController,
    SurveyHistoryController,
    SurveyMetaController,
    SurveyUIController,
    CollaboratorController,
    DownloadTaskController,
    SessionController,
    SurveyGroupController,
    RecycleBinController,
    AIGenerateController,
  ],
  providers: [
    DataStatisticService,
    SurveyHistoryService,
    SurveyConfService,
    SurveyMetaService,
    PluginManagerProvider,
    ContentSecurityService,
    CollaboratorService,
    LoggerProvider,
    CounterService,
    DownloadTaskService,
    FileService,
    SessionService,
    SurveyGroupService,
    WorkspaceService,
    AIGenerateService,
  ],
})
export class SurveyModule {}
