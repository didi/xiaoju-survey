import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { WorkspaceMemberService } from '../services/workspaceMember.service';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('WorkspaceMemberService', () => {
  let service: WorkspaceMemberService;
  let repository: MongoRepository<WorkspaceMember>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceMemberService,
        {
          provide: getRepositoryToken(WorkspaceMember),
          useClass: MongoRepository,
        },
      ],
    }).compile();

    service = module.get<WorkspaceMemberService>(WorkspaceMemberService);
    repository = module.get<MongoRepository<WorkspaceMember>>(
      getRepositoryToken(WorkspaceMember),
    );
  });

  describe('create', () => {
    it('should create a new workspace member', async () => {
      const member = {
        role: 'admin',
        userId: 'userId',
        workspaceId: 'workspaceId',
      };
      const createdMember = { ...member, _id: new ObjectId() };

      jest.spyOn(repository, 'create').mockReturnValue(createdMember as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdMember as any);

      const result = await service.create(member);

      expect(result).toEqual(createdMember);
      expect(repository.create).toHaveBeenCalledWith(member);
      expect(repository.save).toHaveBeenCalledWith(createdMember);
    });
  });

  describe('batchCreate', () => {
    it('should batch create workspace members', async () => {
      const workspaceId = 'workspaceId';
      const members = [
        { userId: 'userId1', role: 'admin' },
        { userId: 'userId2', role: 'user' },
      ];
      const creator = 'creatorName';
      const creatorId = 'creatorId';
      const now = new Date();
      const dataToInsert = members.map((item) => ({
        ...item,
        workspaceId,
        createdAt: now,
        updatedAt: now,
        creator,
        creatorId,
      }));

      jest.spyOn(repository, 'insertMany').mockResolvedValueOnce({
        insertedCount: members.length,
      } as any);

      const result = await service.batchCreate({
        workspaceId,
        members,
        creator,
        creatorId,
      });

      expect(result).toEqual({ insertedCount: members.length });
      expect(repository.insertMany).toHaveBeenCalledWith(
        dataToInsert.map((item) => {
          return {
            ...item,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          };
        }),
      );
    });

    it('should return insertedCount 0 if no members to insert', async () => {
      const workspaceId = new ObjectId().toString();
      const members = [];
      const creator = 'creatorName';
      const creatorId = 'creatorId';

      const result = await service.batchCreate({
        workspaceId,
        members,
        creator,
        creatorId,
      });

      expect(result).toEqual({ insertedCount: 0 });
    });
  });

  describe('batchUpdate', () => {
    it('should batch update workspace members roles', async () => {
      const idList = [new ObjectId().toString(), new ObjectId().toString()];
      const role = 'user';
      const operator = 'operatorName';
      const operatorId = 'operatorId';

      jest
        .spyOn(repository, 'updateMany')
        .mockResolvedValue({ modifiedCount: idList.length } as any);

      const result = await service.batchUpdate({
        idList,
        role,
        operator,
        operatorId,
      });

      expect(result).toEqual({ modifiedCount: idList.length });
    });

    it('should return modifiedCount 0 if no ids to update', async () => {
      const idList = [];
      const role = 'user';
      const operator = 'operatorName';
      const operatorId = 'operatorId';

      const result = await service.batchUpdate({
        idList,
        role,
        operator,
        operatorId,
      });

      expect(result).toEqual({ modifiedCount: 0 });
    });
  });

  describe('findAllByUserId', () => {
    it('should return all workspace members by userId', async () => {
      const userId = 'userId';
      const members = [
        { userId, workspaceId: 'workspaceId1' },
        { userId, workspaceId: 'workspaceId2' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(members as any);

      const result = await service.findAllByUserId({ userId });

      expect(result).toEqual(members);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('findAllByWorkspaceId', () => {
    it('should return all workspace members by workspaceId', async () => {
      const workspaceId = 'workspaceId';
      const members = [
        { userId: 'userId1', workspaceId },
        { userId: 'userId2', workspaceId },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(members as any);

      const result = await service.findAllByWorkspaceId({ workspaceId });

      expect(result).toEqual(members);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single workspace member', async () => {
      const workspaceId = 'workspaceId';
      const userId = 'userId';
      const member = { userId, workspaceId };

      jest.spyOn(repository, 'findOne').mockResolvedValue(member as any);

      const result = await service.findOne({ workspaceId, userId });

      expect(result).toEqual(member);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { workspaceId, userId },
      });
    });
  });

  describe('updateRole', () => {
    it('should update the role of a workspace member', async () => {
      const workspaceId = 'workspaceId';
      const userId = 'userId';
      const role = 'admin';
      const operator = 'operatorName';
      const operatorId = 'operatorId';

      jest
        .spyOn(repository, 'updateOne')
        .mockResolvedValue({ modifiedCount: 1 } as any);

      const result = await service.updateRole({
        workspaceId,
        userId,
        role,
        operator,
        operatorId,
      });

      expect(result).toEqual({ modifiedCount: 1 });
      expect(repository.updateOne).toHaveBeenCalledWith(
        { workspaceId, userId },
        { $set: { role, operator, operatorId, updatedAt: expect.any(Date) } },
      );
    });
  });

  describe('deleteMember', () => {
    it('should delete a workspace member', async () => {
      const workspaceId = 'workspaceId';
      const userId = 'userId';

      jest
        .spyOn(repository, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 } as any);

      const result = await service.deleteMember({ workspaceId, userId });

      expect(result).toEqual({ deletedCount: 1 });
      expect(repository.deleteOne).toHaveBeenCalledWith({
        workspaceId,
        userId,
      });
    });
  });

  describe('batchSearchByWorkspace', () => {
    it('should return all workspace members by workspace id list', async () => {
      const workspaceList = ['workspaceId1', 'workspaceId2'];
      const members = [
        { userId: 'userId1', workspaceId: workspaceList[0] },
        { userId: 'userId2', workspaceId: workspaceList[1] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(members as any);

      const result = await service.batchSearchByWorkspace(workspaceList);

      expect(result).toEqual(members);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
});
