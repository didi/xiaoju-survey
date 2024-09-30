import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { ResponseSecurityPlugin } from './securityPlugin/responseSecurityPlugin';
import { SurveyUtilPlugin } from './securityPlugin/surveyUtilPlugin';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SurveyModule } from './modules/survey/survey.module';
import { SurveyResponseModule } from './modules/surveyResponse/surveyResponse.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { FileModule } from './modules/file/file.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { UpgradeModule } from './modules/upgrade/upgrade.module';

import { join } from 'path';

import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionsFilter } from './exceptions/httpExceptions.filter';

import { Captcha } from './models/captcha.entity';
import { User } from './models/user.entity';
import { SurveyMeta } from './models/surveyMeta.entity';
import { SurveyConf } from './models/surveyConf.entity';
import { SurveyHistory } from './models/surveyHistory.entity';
import { ResponseSchema } from './models/responseSchema.entity';
import { Counter } from './models/counter.entity';
import { SurveyResponse } from './models/surveyResponse.entity';
import { ClientEncrypt } from './models/clientEncrypt.entity';
import { Word } from './models/word.entity';
import { MessagePushingTask } from './models/messagePushingTask.entity';
import { MessagePushingLog } from './models/messagePushingLog.entity';
import { WorkspaceMember } from './models/workspaceMember.entity';
import { Workspace } from './models/workspace.entity';
import { Collaborator } from './models/collaborator.entity';
import { DownloadTask } from './models/downloadTask.entity';
import { Session } from './models/session.entity';

import { LoggerProvider } from './logger/logger.provider';
import { PluginManagerProvider } from './securityPlugin/pluginManager.provider';
import { LogRequestMiddleware } from './middlewares/logRequest.middleware';
import { PluginManager } from './securityPlugin/pluginManager';
import { Logger } from './logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, // 根据 NODE_ENV 动态加载对应的 .env 文件
      isGlobal: true, // 使配置模块在应用的任何地方可用
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url = await configService.get<string>('XIAOJU_SURVEY_MONGO_URL');
        const authSource =
          (await configService.get<string>(
            'XIAOJU_SURVEY_MONGO_AUTH_SOURCE',
          )) || 'admin';
        const database = await configService.get<string>(
          'XIAOJU_SURVEY_MONGO_DB_NAME',
        );
        return {
          type: 'mongodb',
          connectTimeoutMS: 10000,
          socketTimeoutMS: 10000,
          url,
          authSource,
          useNewUrlParser: true,
          database,
          entities: [
            Captcha,
            User,
            SurveyMeta,
            SurveyConf,
            SurveyHistory,
            SurveyResponse,
            Counter,
            ResponseSchema,
            ClientEncrypt,
            Word,
            MessagePushingTask,
            MessagePushingLog,
            Workspace,
            WorkspaceMember,
            Collaborator,
            DownloadTask,
            Session,
          ],
        };
      },
    }),
    AuthModule,
    SurveyModule,
    SurveyResponseModule,
    ServeStaticModule.forRootAsync({
      useFactory: async () => {
        return [
          {
            rootPath: join(__dirname, '..', 'public'),
          },
        ];
      },
    }),
    MessageModule,
    FileModule,
    WorkspaceModule,
    UpgradeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    LoggerProvider,
    PluginManagerProvider,
  ],
})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly pluginManager: PluginManager,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('*');
  }
  onModuleInit() {
    this.pluginManager.registerPlugin(
      new ResponseSecurityPlugin(
        this.configService.get<string>(
          'XIAOJU_SURVEY_RESPONSE_AES_ENCRYPT_SECRET_KEY',
        ),
      ),
      new SurveyUtilPlugin(),
    );
    Logger.init({
      filename: this.configService.get<string>('XIAOJU_SURVEY_LOGGER_FILENAME'),
    });
  }
}
