import { Module } from '@nestjs/common';
import { MessagePushingTaskService } from './services/messagePushingTask.service';
import { MessagePushingLogService } from './services/messagePushingLog.service';

import { MessagePushingTaskController } from './controllers/messagePushingTask.controller';

import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { MessagePushingLog } from 'src/models/messagePushingLog.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';

import { LoggerProvider } from 'src/logger/logger.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessagePushingTask, MessagePushingLog]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [MessagePushingTaskController],
  providers: [
    MessagePushingTaskService,
    MessagePushingLogService,
    LoggerProvider,
  ],
  exports: [MessagePushingTaskService],
})
export class MessagePushingModule {}
