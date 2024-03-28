import { Module } from '@nestjs/common';

import { ResponseSchemaService } from './services/responseScheme.service';
import { SurveyResponseService } from './services/surveyResponse.service';
import { CounterService } from './services/counter.service';
import { ClientEncryptService } from './services/clientEncrypt.service';
import { MessagePushingTaskService } from '../survey/services/messagePushingTask.service';
import { MessagePushingLogService } from './services/messagePushingLog.service';

import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Counter } from 'src/models/counter.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { MessagePushingLog } from 'src/models/messagePushingLog.entity';

import { ClientEncryptController } from './controllers/clientEncrpt.controller';
import { CounterController } from './controllers/counter.controller';
import { ResponseSchemaController } from './controllers/responseSchema.controller';
import { SurveyResponseController } from './controllers/surveyResponse.controller';
import { SurveyResponseUIController } from './controllers/surveyResponseUI.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResponseSchema,
      Counter,
      SurveyResponse,
      ClientEncrypt,
      MessagePushingTask,
      MessagePushingLog,
    ]),
    ConfigModule,
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
    MessagePushingTaskService,
    MessagePushingLogService,
  ],
  exports: [
    ResponseSchemaService,
    SurveyResponseService,
    CounterService,
    ClientEncryptService,
  ],
})
export class SurveyResponseModule {}
