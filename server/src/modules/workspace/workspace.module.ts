import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { WorkspaceService } from './services/workspace.service';
import { WorkspaceMemberService } from './services/workspaceMember.service';
import { SurveyMetaService } from '../survey/services/surveyMeta.service';

import { WorkspaceController } from './controllers/workspace.controller';

import { Workspace } from 'src/models/workspace.entity';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';

import { AuthModule } from '../auth/auth.module';

import { LoggerProvider } from 'src/logger/logger.provider';
import { WorkspaceGuard } from 'src/guards/workspace.guard';
import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, WorkspaceMember, SurveyMeta]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceMemberService,
    LoggerProvider,
    WorkspaceGuard,
    SurveyMetaService,
    PluginManagerProvider,
  ],
  exports: [WorkspaceMemberService, WorkspaceService, TypeOrmModule.forFeature([Workspace, WorkspaceMember, SurveyMeta])],
})
export class WorkspaceModule {}
