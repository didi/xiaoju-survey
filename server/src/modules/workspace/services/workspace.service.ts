import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { Workspace } from 'src/models/workspace.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { WorkspaceMemberService } from './workspaceMember.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';

import { ObjectId } from 'mongodb';

interface FindAllByIdWithPaginationParams {
  workspaceIdList: string[];
  page: number;
  limit: number;
  name?: string;
}
interface FindAllByIdWithPaginationResult {
  list: Workspace[];
  count: number;
}

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: MongoRepository<Workspace>,
    @InjectRepository(SurveyMeta)
    private surveyMetaRepository: MongoRepository<SurveyMeta>,
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly surveyMetaService: SurveyMetaService,
  ) {}

  async create(workspace: {
    name: string;
    description: string;
    owner: string;
    ownerId: string;
  }): Promise<Workspace> {
    const newWorkspace = this.workspaceRepository.create({
      ...workspace,
      creatorId: workspace.ownerId,
      creator: workspace.owner,
    });
    return this.workspaceRepository.save(newWorkspace);
  }

  async findOneById(id) {
    return this.workspaceRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }

  async findAllById({
    workspaceIdList,
  }: {
    workspaceIdList: string[];
  }): Promise<Workspace[]> {
    const query = {
      _id: {
        $in: workspaceIdList.map((item) => new ObjectId(item)),
      },
      isDeleted: {
        $ne: true,
      },
    };

    return this.workspaceRepository.find({
      where: query,
      order: {
        _id: -1,
      },
      select: [
        '_id',
        'name',
        'description',
        'ownerId',
        'creatorId',
        'createdAt',
      ],
    });
  }

  async findAllByIdWithPagination({
    workspaceIdList,
    page,
    limit,
    name,
  }: FindAllByIdWithPaginationParams): Promise<FindAllByIdWithPaginationResult> {
    const skip = (page - 1) * limit;
    if (!Array.isArray(workspaceIdList) || workspaceIdList.length === 0) {
      return { list: [], count: 0 };
    }
    const query = {
      _id: {
        $in: workspaceIdList.map((m) => new ObjectId(m)),
      },
      isDeleted: {
        $ne: true,
      },
    };
    if (name) {
      query['name'] = { $regex: name, $options: 'i' };
    }
    const [data, count] = await this.workspaceRepository.findAndCount({
      where: query,
      skip,
      take: limit,
      order: {
        createdAt: -1,
      },
    });
    return { list: data, count };
  }

  update({
    id,
    workspace,
    operator,
    operatorId,
  }: {
    id: string;
    workspace: Partial<Workspace>;
    operator: string;
    operatorId: string;
  }) {
    workspace.updatedAt = new Date();
    workspace.operator = operator;
    workspace.operatorId = operatorId;
    return this.workspaceRepository.update(id, workspace);
  }

  async delete(id: string, { operator, operatorId }) {
    const workspaceRes = await this.workspaceRepository.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          operator,
          operatorId,
        },
      },
    );
    const surveyRes = await this.surveyMetaRepository.updateMany(
      {
        workspaceId: id,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          operator,
          operatorId,
        },
      },
    );
    return {
      workspaceRes,
      surveyRes,
    };
  }

  // 用户下的所有空间
  async findAllByUserId(userId: string) {
    return await this.workspaceRepository.find({
      where: {
        ownerId: userId,
        isDeleted: {
          $ne: true,
        },
      },
      order: {
        _id: -1,
      },
      select: [
        '_id',
        'curStatus',
        'name',
        'description',
        'ownerId',
        'createdAt',
      ],
    });
  }

  async getAllSurveyIdListByUserId(userId: string, isRecycleBin: boolean) {
    // 查询当前用户参与的空间
    const workspaceInfoList = await this.workspaceMemberService.findAllByUserId(
      { userId },
    );
    const workspaceIdList = workspaceInfoList.map((item) => item.workspaceId);
    const isDeleted = isRecycleBin;
    const surveyList =
      await this.surveyMetaService.getSurveyMetaListByWorkspaceIdList({
        workspaceIdList,
        isDeleted,
      });
    const surveyIdList = surveyList.map((item) => item._id.toString());

    return {
      code: 200,
      data: {
        surveyIdList,
      },
    };
  }
}
