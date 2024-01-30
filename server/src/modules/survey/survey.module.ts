import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyResponseModule } from '../surveyResponse/surveyResponse.module';
import { AuthModule } from '../auth/auth.module';

import { DataStatisticController } from './controllers/dataStatistic.controller';
import { SurveyController } from './controllers/survey.controller';
import { SurveyHistoryController } from './controllers/surveyHistory.controller';
import { SurveyMetaController } from './controllers/surveyMeta.controller';
import { SurveyUIController } from './controllers/surveyUI.controller';

import { SurveyConf } from 'src/models/surveyConf.entity';
import { SurveyHistory } from 'src/models/surveyHistory.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { Word } from 'src/models/word.entity';

import { DataStatisticService } from './services/dataStatistic.service';
import { SurveyConfService } from './services/surveyConf.service';
import { SurveyHistoryService } from './services/surveyHistory.service';
import { SurveyMetaService } from './services/surveyMeta.service';
import { ContentSecurityService } from './services/contentSecurity.service';

import { PluginManagerProvider } from 'src/plugins/pluginManager.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyMeta,
      SurveyConf,
      SurveyHistory,
      SurveyResponse,
      Word,
    ]),
    ConfigModule,
    SurveyResponseModule,
    AuthModule,
  ],
  controllers: [
    DataStatisticController,
    SurveyController,
    SurveyHistoryController,
    SurveyMetaController,
    SurveyUIController,
  ],
  providers: [
    DataStatisticService,
    SurveyHistoryService,
    SurveyConfService,
    SurveyMetaService,
    PluginManagerProvider,
    ContentSecurityService,
  ],
})
export class SurveyModule {}
