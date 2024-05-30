import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerProvider } from 'src/logger/logger.provider';

import { SurveyResponseModule } from '../surveyResponse/surveyResponse.module';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';

import { DataStatisticController } from './controllers/dataStatistic.controller';
import { SurveyController } from './controllers/survey.controller';
import { SurveyHistoryController } from './controllers/surveyHistory.controller';
import { SurveyMetaController } from './controllers/surveyMeta.controller';
import { SurveyUIController } from './controllers/surveyUI.controller';
import { CollaboratorController } from './controllers/collaborator.controller';

import { SurveyConf } from 'src/models/surveyConf.entity';
import { SurveyHistory } from 'src/models/surveyHistory.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { Word } from 'src/models/word.entity';
import { Collaborator } from 'src/models/collaborator.entity';
import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';

import { DataStatisticService } from './services/dataStatistic.service';
import { SurveyConfService } from './services/surveyConf.service';
import { SurveyHistoryService } from './services/surveyHistory.service';
import { SurveyMetaService } from './services/surveyMeta.service';
import { ContentSecurityService } from './services/contentSecurity.service';
import { CollaboratorService } from './services/collaborator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyMeta,
      SurveyConf,
      SurveyHistory,
      SurveyResponse,
      Word,
      Collaborator,
    ]),
    ConfigModule,
    SurveyResponseModule,
    AuthModule,
    WorkspaceModule,
  ],
  controllers: [
    DataStatisticController,
    SurveyController,
    SurveyHistoryController,
    SurveyMetaController,
    SurveyUIController,
    CollaboratorController,
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
  ],
})
export class SurveyModule {}
