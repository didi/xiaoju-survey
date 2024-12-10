import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Channel } from 'src/models/channel.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity'
import { SurveyResponseService } from 'src/modules/surveyResponse/services/surveyResponse.service';
import { User } from 'src/models/user.entity'

import { ChannelService } from './services/channel.service'
import { ChannelController } from './controllers/channel.controller';

import { AuthModule } from '../auth/auth.module';
import { Authentication } from 'src/guards/authentication.guard';
import { LoggerProvider } from 'src/logger/logger.provider';
import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, SurveyResponse]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    SurveyResponseService,
    LoggerProvider,
    Authentication,
    PluginManagerProvider,
  ],
  exports: [ChannelService],
})
export class ChannelModule {}
