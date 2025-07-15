import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';

import { ResponseSchemaService } from './services/responseScheme.service';
import { SurveyResponseService } from './services/surveyResponse.service';
import { CounterService } from './services/counter.service';
import { ClientEncryptService } from './services/clientEncrypt.service';

import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Counter } from 'src/models/counter.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { LoggerProvider } from 'src/logger/logger.provider';

import { ClientEncryptController } from './controllers/clientEncrpt.controller';
import { CounterController } from './controllers/counter.controller';
import { ResponseSchemaController } from './controllers/responseSchema.controller';
import { SurveyResponseController } from './controllers/surveyResponse.controller';
import { SurveyResponseUIController } from './controllers/surveyResponseUI.controller';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { HttpClientModule } from '../httpClient/httpClient.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OpenAuthGuard } from 'src/guards/openAuth.guard';
import { AppManagerService } from '../appManager/services/appManager.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResponseSchema,
      Counter,
      SurveyResponse,
      ClientEncrypt,
    ]),
    ConfigModule,
    MessageModule,
    // RedisModule,
    AuthModule,
    WorkspaceModule,
    HttpClientModule,
  ],
  controllers: [
    ClientEncryptController,
    CounterController,
    ResponseSchemaController,
    SurveyResponseController,
    SurveyResponseUIController,
  ],
  providers: [
    ResponseSchemaService,
    SurveyResponseService,
    CounterService,
    ClientEncryptService,
    LoggerProvider,
    AppManagerService,
    OpenAuthGuard,
    // RedisService,
  ],
  exports: [
    ResponseSchemaService,
    SurveyResponseService,
    CounterService,
    ClientEncryptService,
  ],
})
export class SurveyResponseModule {}
