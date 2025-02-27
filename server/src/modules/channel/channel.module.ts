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
import { OpenAuthGuard } from 'src/guards/openAuth.guard';
import { LoggerProvider } from 'src/logger/logger.provider';
import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';

import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { CollaboratorService } from 'src/modules/survey/services/collaborator.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { SurveyConfService } from 'src/modules/survey/services/surveyConf.service';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { Collaborator } from 'src/models/collaborator.entity';

import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { SurveyModule } from 'src/modules/survey/survey.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, SurveyResponse, SurveyMeta, SurveyConf, Collaborator,WorkspaceMember]),
    ConfigModule,
    AuthModule,
    WorkspaceModule
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    SurveyResponseService,
    LoggerProvider,
    Authentication,
    OpenAuthGuard,
    PluginManagerProvider,
    WorkspaceMemberService,
    CollaboratorService,
    SurveyMetaService,
    SurveyConfService,
    SurveyModule,
  ],
  exports: [ChannelService],
})
export class ChannelModule {}
