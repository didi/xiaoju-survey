import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: MongoRepository<WorkspaceMember>,
  ) {}

  async create(member: {
    role: string;
    userId: string;
    workspaceId: string;
  }): Promise<WorkspaceMember> {
    const newMember = this.workspaceMemberRepository.create(member);
    return this.workspaceMemberRepository.save(newMember);
  }

  async batchCreate({
    workspaceId,
    members,
    creator,
    creatorId,
  }: {
    workspaceId: string;
    members: Array<{ userId: string; role: string }>;
    creator: string;
    creatorId: string;
  }) {
    if (members.length === 0) {
      return {
        insertedCount: 0,
      };
    }
    const now = new Date();
    const dataToInsert = members.map((item) => {
      return {
        ...item,
        workspaceId,
        createdAt: now,
        updatedAt: now,
        creator,
        creatorId,
      };
    });
    return this.workspaceMemberRepository.insertMany(dataToInsert);
  }

  async batchUpdate({
    idList,
    role,
    operator,
    operatorId,
  }: {
    idList: Array<string>;
    role: string;
    operator: string;
    operatorId: string;
  }) {
    if (idList.length === 0) {
      return {
        modifiedCount: 0,
      };
    }
    return this.workspaceMemberRepository.updateMany(
      {
        _id: {
          $in: idList.map((item) => new ObjectId(item)),
        },
      },
      {
        $set: {
          role,
          operator,
          operatorId,
          updatedAt: new Date(),
        },
      },
    );
  }

  async batchDelete({
    idList,
    neIdList,
  }: {
    idList: Array<string>;
    neIdList: Array<string>;
  }) {
    if (idList.length === 0 || neIdList.length === 0) {
      return {
        modifiedCount: 0,
      };
    }
    return this.workspaceMemberRepository.deleteMany({
      _id: {
        $in: idList.map((item) => new ObjectId(item)),
        $nin: neIdList.map((item) => new ObjectId(item)),
      },
    });
  }

  async findAllByUserId({ userId }): Promise<WorkspaceMember[]> {
    return this.workspaceMemberRepository.find({
      where: {
        userId,
      },
    });
  }

  async findAllByWorkspaceId({ workspaceId }): Promise<WorkspaceMember[]> {
    return this.workspaceMemberRepository.find({
      where: {
        workspaceId,
      },
      select: ['_id', 'createdAt', 'curStatus', 'role', 'userId'],
    });
  }

  async findOne({ workspaceId, userId }): Promise<WorkspaceMember> {
    return this.workspaceMemberRepository.findOne({
      where: {
        workspaceId,
        userId,
      },
    });
  }

  async updateRole({ workspaceId, userId, role, operator, operatorId }) {
    return this.workspaceMemberRepository.updateOne(
      {
        workspaceId,
        userId,
      },
      {
        $set: {
          role,
          operator,
          operatorId,
          updatedAt: new Date(),
        },
      },
    );
  }

  async deleteMember({ workspaceId, userId }) {
    return this.workspaceMemberRepository.deleteOne({
      workspaceId,
      userId,
    });
  }

  async countByWorkspaceId({ workspaceId }) {
    return this.workspaceMemberRepository.count({
      workspaceId,
    });
  }

  // 根据空间id批量查询成员
  async batchSearchByWorkspace(workspaceList: string[]) {
    return await this.workspaceMemberRepository.find({
      where: {
        workspaceId: {
          $in: workspaceList,
        },
      },
      order: {
        _id: -1,
      },
      select: ['_id', 'userId', 'role', 'workspaceId'],
    });
  }
}
