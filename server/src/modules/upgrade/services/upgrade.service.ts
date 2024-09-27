import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';
import { Workspace } from 'src/models/workspace.entity';
import { Collaborator } from 'src/models/collaborator.entity';
import { Counter } from 'src/models/counter.entity';
import { DownloadTask } from 'src/models/downloadTask.entity';
import { MessagePushingLog } from 'src/models/messagePushingLog.entity';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { Session } from 'src/models/session.entity';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { User } from 'src/models/user.entity';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { SESSION_STATUS } from 'src/enums/surveySessionStatus';
import { Logger } from 'src/logger';

@Injectable()
export class UpgradeService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: MongoRepository<Collaborator>,
    @InjectRepository(Counter)
    private readonly counterRepository: MongoRepository<Counter>,
    @InjectRepository(DownloadTask)
    private readonly downloadTaskRepository: MongoRepository<DownloadTask>,
    @InjectRepository(MessagePushingLog)
    private readonly messagePushingLogRepository: MongoRepository<MessagePushingLog>,
    @InjectRepository(MessagePushingTask)
    private readonly messagePushingTaskRepository: MongoRepository<MessagePushingTask>,
    @InjectRepository(ResponseSchema)
    private readonly responseSchemaRepository: MongoRepository<ResponseSchema>,
    @InjectRepository(Session)
    private readonly sessionRepository: MongoRepository<Session>,
    @InjectRepository(SurveyConf)
    private readonly surveyConfRepository: MongoRepository<SurveyConf>,
    @InjectRepository(SurveyMeta)
    private readonly surveyMetaRepository: MongoRepository<SurveyMeta>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: MongoRepository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepository: MongoRepository<WorkspaceMember>,
  ) {}

  async upgradeFeatureStatus() {
    const repositories = [
      this.collaboratorRepository,
      this.counterRepository,
      this.downloadTaskRepository,
      this.messagePushingLogRepository,
      this.messagePushingTaskRepository,
      this.responseSchemaRepository,
      this.sessionRepository,
      this.surveyConfRepository,
      this.surveyMetaRepository,
      this.userRepository,
      this.workspaceRepository,
      this.workspaceMemberRepository,
    ];
    const handleCreatedAtAndUpdatedAt = (doc) => {
      if (!doc.createdAt) {
        if (doc.createDate) {
          doc.createdAt = new Date(doc.createDate);
          delete doc.createDate;
        } else {
          doc.createdAt = new Date();
        }
      }
      if (!doc.updatedAt) {
        if (doc.updateDate) {
          doc.updatedAt = new Date(doc.updateDate);
          delete doc.updateDate;
        } else {
          doc.updatedAt = new Date();
        }
      }
    };

    const handleDelStatus = (doc) => {
      // 已删除的字段升级
      if (doc?.curStatus?.status === 'removed') {
        delete doc.curStatus;
        doc.isDeleted = true;
        doc.deletedAt = new Date(doc.updatedAt);
      }
    };

    const handleSubStatus = (doc) => {
      // 编辑中字段升级
      if (
        !doc?.subStatus &&
        (doc?.curStatus?.status == RECORD_STATUS.PUBLISHED ||
          doc?.curStatus?.status == RECORD_STATUS.NEW ||
          doc?.curStatus?.status === RECORD_STATUS.EDITING)
      ) {
        const subStatus = {
          status: RECORD_SUB_STATUS.DEFAULT,
          date: doc.curStatus.date,
        };
        doc.subStatus = subStatus;
      }
    };

    const handleBegTime = (doc) => {
      if (!doc?.baseConf?.beginTime && doc?.baseConf?.begTime) {
        doc.baseConf.beginTime = doc.baseConf.begTime;
        delete doc.baseConf.begTime;
      }
    };

    const handleSessionStatus = (doc) => {
      if (!doc.status && doc.curStatus) {
        if (doc?.curStatus?.id && doc?.curStatus?.id === 'editing') {
          doc.status = SESSION_STATUS.ACTIVATED;
        } else {
          doc.status = SESSION_STATUS.DEACTIVATED;
        }
        delete doc.curStatus;
      }
    };

    const handleCreatorId = async (doc) => {
      if (!doc.ownerId && doc.owner) {
        const userInfo = await this.userRepository.findOne({
          where: {
            username: doc.owner,
          },
        });
        if (userInfo && userInfo._id) {
          doc.ownerId = userInfo._id.toString();
        }
      }
      if (doc.ownerId && doc.owner && !doc.creatorId) {
        doc.creatorId = doc.ownerId;
        doc.creator = doc.owner;
      }
    };

    const save = async ({ doc, repository }) => {
      const entity = repository.create(doc);
      await repository.updateOne(
        {
          _id: entity._id,
        },
        {
          $set: entity,
        },
      );
      // this.logger.info(JSON.stringify(updateRes));
    };
    this.logger.info(`upgrading...`);
    for (const repository of repositories) {
      const name =
        typeof repository.target === 'function'
          ? repository.target.name
          : typeof repository.target === 'string'
            ? repository.target
            : '';

      const cursor = repository.createCursor();
      this.logger.info(`upgrading ${name}`);
      while (await cursor.hasNext()) {
        try {
          const doc = await cursor.next();
          // 把createDate和updateDate升级成createdAt和updatedAt
          handleCreatedAtAndUpdatedAt(doc);
          if (
            repository === this.surveyMetaRepository ||
            repository === this.responseSchemaRepository
          ) {
            // 新增subStatus字段
            handleSubStatus(doc);
          }
          if (
            repository === this.surveyMetaRepository ||
            repository === this.downloadTaskRepository ||
            repository === this.messagePushingTaskRepository ||
            repository === this.workspaceRepository ||
            repository === this.responseSchemaRepository
          ) {
            // 新增isDeleted等相关字段
            handleDelStatus(doc);
          }
          // 同步sessionStatus到新定义的字段
          if (repository === this.sessionRepository) {
            handleSessionStatus(doc);
          }
          // 同步begTime，更新成beginTime
          if (repository === this.surveyConfRepository) {
            handleBegTime(doc);
          }
          // 同步ownerId到creatorId
          if (repository === this.surveyMetaRepository) {
            await handleCreatorId(doc);
          }
          await save({ repository, doc });
        } catch (error) {
          this.logger.error(`upgrade ${name} error ${error.message}`);
        }
      }
      this.logger.info(`finish upgrade ${name}`);
    }
    this.logger.info(`upgrad finished...`);
  }
}
