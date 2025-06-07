import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { SurveyMeta } from '../../../models/surveyMeta.entity';
import { RecycleBinListDto } from '../dto/recycleBin.dto';
import { CollaboratorService } from './collaborator.service';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';
import { RECORD_STATUS } from '../../../enums';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class RecycleBinService {
  private readonly logger = new Logger(RecycleBinService.name);

  constructor(
    @InjectRepository(SurveyMeta)
    private readonly surveyMetaRepository: Repository<SurveyMeta>,
    private readonly collaboratorService: CollaboratorService,
    @InjectRepository(ResponseSchema)
    private readonly responseSchemaRepository: MongoRepository<ResponseSchema>,
  ) {}

  // 检查用户是否有权限操作该问卷
  private async checkPermission(userId: string, surveyId: string) {
    const survey = await this.surveyMetaRepository.findOne({
      where: { _id: new ObjectId(surveyId) }
    });

    if (!survey) {
      throw new NotFoundException('问卷不存在');
    }

    if (survey.ownerId === userId) {
      return survey;
    }

    const collaborator = await this.collaboratorService.getCollaborator({ userId, surveyId });
    this.logger.debug('协作者权限检查:', collaborator);

    if (
      collaborator &&
      Array.isArray(collaborator.permissions) &&
      collaborator.permissions.includes(SURVEY_PERMISSION.SURVEY_CONF_MANAGE)
    ) {
      return survey;
    }

    throw new NotFoundException('没有操作权限');
  }

  async getRecycleBinList(userId: string, dto: RecycleBinListDto) {
    const { value: params } = RecycleBinListDto.validate(dto);
    const { curPage, pageSize } = params;
    const skip = (curPage - 1) * pageSize;

    const query = {
      $or: [{ ownerId: userId }],
      isDeleted: true,
      isPermanentDeleted: false,
    };

    const [list, count] = await this.surveyMetaRepository.findAndCount({
      where: query,
      select: ['_id', 'title', 'createdAt', 'deletedAt', 'ownerId'],
      skip,
      take: pageSize,
      order: {
        deletedAt: 'DESC',
      },
    });

    return { list, count };
  }

  async restoreSurvey(userId: string, id: string) {
    const survey = await this.checkPermission(userId, id);

    const dbSurvey = await this.surveyMetaRepository.findOne({
      where: {
        _id: new ObjectId(id),
        isDeleted: true,
        ownerId: survey.ownerId,
      },
    });

    if (!dbSurvey) {
      throw new NotFoundException('问卷不存在或已被恢复');
    }

    const now = Date.now();

    // 如果当前状态为 PUBLISHED，则恢复为 NEW 状态
    if (dbSurvey.curStatus?.status === RECORD_STATUS.PUBLISHED) {
      dbSurvey.curStatus = { status: RECORD_STATUS.NEW, date: now };
      dbSurvey.statusList = Array.isArray(dbSurvey.statusList)
        ? [...dbSurvey.statusList, { status: RECORD_STATUS.NEW, date: now }]
        : [{ status: RECORD_STATUS.NEW, date: now }];
    }

    dbSurvey.isDeleted = false;
    dbSurvey.deletedAt = null;

    await this.surveyMetaRepository.save(dbSurvey);

    return { success: true };
  }

  async permanentDeleteSurvey(userId: string, id: string) {
    await this.checkPermission(userId, id);

    const survey = await this.surveyMetaRepository.findOne({
      where: {
        _id: new ObjectId(id),
        isDeleted: true,
        ownerId: userId,
      },
    });

    if (!survey) {
      throw new NotFoundException('问卷不存在');
    }

    await this.surveyMetaRepository.update(
      { _id: new ObjectId(id) },
      {
        isPermanentDeleted: true,
        updatedAt: new Date(),
      }
    );

    return { success: true };
  }

  async moveToRecycleBin(userId: string, id: string) {
    await this.checkPermission(userId, id);

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      throw new NotFoundException(`无效的问卷ID: ${id}`);
    }

    const survey = await this.surveyMetaRepository.findOne({
      where: {
        _id: objectId,
        isDeleted: false,
        ownerId: userId,
      },
    });

    if (!survey) {
      throw new NotFoundException('问卷不存在或已在回收站');
    }

    const updateResult = await this.surveyMetaRepository.update(
      { _id: objectId },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    // 同步 C 端状态
    const surveyC = await this.responseSchemaRepository.findOne({
      where: { _id: new ObjectId(id) }
    });

    if (surveyC && !surveyC.isDeleted) {
      await this.responseSchemaRepository.update(
        { _id: new ObjectId(id) },
        {
          isDeleted: true,  // C 端的删除状态字段为 isDeleted
          updatedAt: new Date() 
        }
      );
    }

    if (updateResult.affected === 0) {
      throw new Error('更新问卷状态失败');
    }

    return { success: true };
  }
}
