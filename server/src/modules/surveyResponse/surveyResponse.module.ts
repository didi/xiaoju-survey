import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { MessageModule } from '../message/message.module';

import { ResponseSchemaService } from './services/responseScheme.service';
import { SurveyResponseService } from './services/surveyResponse.service';
import { CounterService } from './services/counter.service';
import { ClientEncryptService } from './services/clientEncrypt.service';

import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Counter } from 'src/models/counter.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { Logger } from 'src/logger';

import { ClientEncryptController } from './controllers/clientEncrpt.controller';
import { CounterController } from './controllers/counter.controller';
import { ResponseSchemaController } from './controllers/responseSchema.controller';
import { SurveyResponseController } from './controllers/surveyResponse.controller';
import { SurveyResponseUIController } from './controllers/surveyResponseUI.controller';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';

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
    AuthModule,
    WorkspaceModule,
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
    Logger,
  ],
  exports: [
    ResponseSchemaService,
    SurveyResponseService,
    CounterService,
    ClientEncryptService,
  ],
})
export class SurveyResponseModule {}
