import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { WorkspaceService } from '../services/workspace.service';
import { Workspace } from 'src/models/workspace.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let workspaceRepository: MongoRepository<Workspace>;
  let surveyMetaRepository: MongoRepository<SurveyMeta>;

  const mockWorkspaceMemberService = {
    findAllByUserId: jest.fn(),
  };

  const mockSurveyMetaService = {
    getSurveyMetaListByWorkspaceIdList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getRepositoryToken(Workspace),
          useClass: MongoRepository,
        },
        {
          provide: getRepositoryToken(SurveyMeta),
          useClass: MongoRepository,
        },
        {
          provide: WorkspaceMemberService,
          useValue: mockWorkspaceMemberService,
        },
        {
          provide: SurveyMetaService,
          useValue: mockSurveyMetaService,
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    workspaceRepository = module.get<MongoRepository<Workspace>>(
      getRepositoryToken(Workspace),
    );
    surveyMetaRepository = module.get<MongoRepository<SurveyMeta>>(
      getRepositoryToken(SurveyMeta),
    );
  });

  describe('create', () => {
    it('should create a new workspace', async () => {
      const workspace = {
        name: 'Test Workspace',
        description: 'Description',
        owner: 'Test Owner', // 添加 owner 属性
        ownerId: 'ownerId',
      };
      const createdWorkspace = { ...workspace, _id: new ObjectId() };

      jest
        .spyOn(workspaceRepository, 'create')
        .mockReturnValue(createdWorkspace as any);
      jest
        .spyOn(workspaceRepository, 'save')
        .mockResolvedValue(createdWorkspace as any);

      const result = await service.create(workspace);

      expect(result).toEqual(createdWorkspace);
      expect(workspaceRepository.create).toHaveBeenCalledWith({
        ...workspace,
        creator: workspace.owner,
        creatorId: workspace.ownerId,
      });
      expect(workspaceRepository.save).toHaveBeenCalledWith(createdWorkspace);
    });
  });

  describe('findAllById', () => {
    it('should return a list of workspaces', async () => {
      const workspaceIdList = [
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      const workspaces = [
        { _id: workspaceIdList[0], name: 'Workspace 1' },
        { _id: workspaceIdList[1], name: 'Workspace 2' },
      ];

      jest
        .spyOn(workspaceRepository, 'find')
        .mockResolvedValue(workspaces as any);

      const result = await service.findAllById({ workspaceIdList });

      expect(result).toEqual(workspaces);
      expect(workspaceRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a workspace', async () => {
      const workspaceId = 'workspaceId';
      const updateData = { name: 'Updated Workspace' };
      const operator = 'Test Operator';
      const operatorId = 'operatorId';

      jest
        .spyOn(workspaceRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.update({
        id: workspaceId,
        workspace: updateData,
        operator,
        operatorId,
      });

      expect(result).toEqual({ affected: 1 });
      expect(workspaceRepository.update).toHaveBeenCalledWith(workspaceId, {
        ...updateData,
        updatedAt: expect.any(Date),
        operator,
        operatorId,
      });
    });
  });

  describe('delete', () => {
    it('should delete a workspace and update related surveyMeta', async () => {
      const workspaceId = new ObjectId().toString();
      const operator = 'Test Operator';
      const operatorId = 'operatorId';

      jest
        .spyOn(workspaceRepository, 'updateOne')
        .mockResolvedValue({ modifiedCount: 1 } as any);
      jest
        .spyOn(surveyMetaRepository, 'updateMany')
        .mockResolvedValue({ modifiedCount: 1 } as any);

      const result = await service.delete(workspaceId, {
        operator,
        operatorId,
      });

      expect(workspaceRepository.updateOne).toHaveBeenCalledTimes(1);
      expect(surveyMetaRepository.updateMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        workspaceRes: { modifiedCount: 1 },
        surveyRes: { modifiedCount: 1 },
      });
    });
  });

  describe('findAllByUserId', () => {
    it('should return all workspaces under a user', async () => {
      const workspaceIdList = [
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      const workspaces = [
        { _id: workspaceIdList[0], name: 'Workspace 1' },
        { _id: workspaceIdList[1], name: 'Workspace 2' },
      ];

      jest
        .spyOn(workspaceRepository, 'find')
        .mockResolvedValue(workspaces as any);

      const result = await service.findAllByUserId('userId');

      expect(result).toEqual(workspaces);
      expect(workspaceRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllSurveyIdListByUserId', () => {
    it('should return all survey id list of work space under a user', async () => {
      const userId = '1';
      const isRecycleBin = false;
      const workspaceMemberList = [
        { userId: '1', workspaceId: 'workspace1' },
        { userId: '1', workspaceId: 'workspace2' },
      ];
      const surveyMetaList = [
        {
          _id: new ObjectId('507f1f77bcf86cd799439011'),
          workspaceId: 'workspace1',
        },
        {
          _id: new ObjectId('507f1f77bcf86cd799439012'),
          workspaceId: 'workspace2',
        },
      ];

      // Mock WorkspaceMemberService.findAllByUserId
      mockWorkspaceMemberService.findAllByUserId.mockResolvedValue(
        workspaceMemberList,
      );

      // Mock SurveyMetaService.getSurveyMetaListByWorkspaceIdList
      mockSurveyMetaService.getSurveyMetaListByWorkspaceIdList.mockResolvedValue(
        surveyMetaList,
      );

      const result = await service.getAllSurveyIdListByUserId(
        userId,
        isRecycleBin,
      );

      // Verify the method calls
      expect(mockWorkspaceMemberService.findAllByUserId).toHaveBeenCalledWith({
        userId,
      });
      expect(
        mockSurveyMetaService.getSurveyMetaListByWorkspaceIdList,
      ).toHaveBeenCalledWith({
        workspaceIdList: ['workspace1', 'workspace2'],
        isDeleted: isRecycleBin,
      });

      // Verify the result
      expect(result).toEqual({
        code: 200,
        data: {
          surveyIdList: [
            '507f1f77bcf86cd799439011',
            '507f1f77bcf86cd799439012',
          ],
        },
      });
    });

    it('should return empty list when user has no workspace memberships', async () => {
      const userId = '1';
      const isRecycleBin = true;

      // Mock empty workspace member list
      mockWorkspaceMemberService.findAllByUserId.mockResolvedValue([]);

      // Mock empty survey meta list
      mockSurveyMetaService.getSurveyMetaListByWorkspaceIdList.mockResolvedValue(
        [],
      );

      const result = await service.getAllSurveyIdListByUserId(
        userId,
        isRecycleBin,
      );

      expect(mockWorkspaceMemberService.findAllByUserId).toHaveBeenCalledWith({
        userId,
      });
      expect(
        mockSurveyMetaService.getSurveyMetaListByWorkspaceIdList,
      ).toHaveBeenCalledWith({
        workspaceIdList: [],
        isDeleted: isRecycleBin,
      });

      expect(result).toEqual({
        code: 200,
        data: {
          surveyIdList: [],
        },
      });
    });

    it('should handle recycle bin mode correctly', async () => {
      const userId = '1';
      const isRecycleBin = true;
      const workspaceMemberList = [{ userId: '1', workspaceId: 'workspace1' }];
      const surveyMetaList = [
        {
          _id: new ObjectId('507f1f77bcf86cd799439011'),
          workspaceId: 'workspace1',
        },
      ];

      mockWorkspaceMemberService.findAllByUserId.mockResolvedValue(
        workspaceMemberList,
      );
      mockSurveyMetaService.getSurveyMetaListByWorkspaceIdList.mockResolvedValue(
        surveyMetaList,
      );

      const result = await service.getAllSurveyIdListByUserId(
        userId,
        isRecycleBin,
      );

      expect(
        mockSurveyMetaService.getSurveyMetaListByWorkspaceIdList,
      ).toHaveBeenCalledWith({
        workspaceIdList: ['workspace1'],
        isDeleted: true,
      });

      expect(result).toEqual({
        code: 200,
        data: {
          surveyIdList: ['507f1f77bcf86cd799439011'],
        },
      });
    });
  });

  describe('findAllByIdWithPagination', () => {
    it('should return paginated workspaces', async () => {
      const workspaceIdList = [
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      const page = 1;
      const limit = 10;
      const workspaces = [
        { _id: workspaceIdList[0], name: 'Workspace 1' },
        { _id: workspaceIdList[1], name: 'Workspace 2' },
      ];

      jest
        .spyOn(workspaceRepository, 'findAndCount')
        .mockResolvedValue([workspaces, workspaces.length] as any);

      const result = await service.findAllByIdWithPagination({
        workspaceIdList,
        page,
        limit,
      });

      expect(result).toEqual({ list: workspaces, count: workspaces.length });
      expect(workspaceRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.any(Object),
        skip: 0,
        take: limit,
        order: { createdAt: -1 },
      });
    });
  });
});
