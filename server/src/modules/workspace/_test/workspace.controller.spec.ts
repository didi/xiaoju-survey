import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { WorkspaceController } from '../controllers/workspace.controller';
import { WorkspaceService } from '../services/workspace.service';
import { WorkspaceMemberService } from '../services/workspaceMember.service';
import { CreateWorkspaceDto } from '../dto/createWorkspace.dto';
import { HttpException } from 'src/exceptions/httpException';
import { ROLE as WORKSPACE_ROLE } from 'src/enums/workspace';
import { Workspace } from 'src/models/workspace.entity';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { UserService } from 'src/modules/auth/services/user.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { Logger } from 'src/logger';
import { User } from 'src/models/user.entity';
import { GetWorkspaceListDto } from '../dto/getWorkspaceList.dto';

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: WorkspaceService;
  let workspaceMemberService: WorkspaceMemberService;
  let userService: UserService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            create: jest.fn(),
            findAllByIdWithPagination: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAllByUserId: jest.fn(),
          },
        },
        {
          provide: WorkspaceMemberService,
          useValue: {
            create: jest.fn(),
            batchCreate: jest.fn(),
            findAllByUserId: jest.fn(),
            batchUpdate: jest.fn(),
            batchDelete: jest.fn(),
            countByWorkspaceId: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserListByIds: jest.fn(),
          },
        },
        {
          provide: SurveyMetaService,
          useValue: {
            countSurveyMetaByWorkspaceId: jest.fn().mockImplementation(() => {
              return Math.floor(Math.random() * 10);
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    workspaceService = module.get<WorkspaceService>(WorkspaceService);
    workspaceMemberService = module.get<WorkspaceMemberService>(
      WorkspaceMemberService,
    );
    userService = module.get<UserService>(UserService);
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should create a workspace and return workspaceId', async () => {
      const mockUserId = new ObjectId(),
        mockUsername = 'username';
      const createWorkspaceDto: CreateWorkspaceDto = {
        name: 'Test Workspace',
        description: 'Test Description',
        members: [{ userId: mockUserId.toString(), role: WORKSPACE_ROLE.USER }],
      };
      const req = { user: { _id: new ObjectId(), username: 'testuser' } };
      const createdWorkspace = { _id: new ObjectId() };

      jest
        .spyOn(userService, 'getUserListByIds')
        .mockResolvedValue([
          { _id: mockUserId, username: mockUsername },
        ] as unknown as Array<User>);
      jest
        .spyOn(workspaceService, 'create')
        .mockResolvedValue(createdWorkspace as Workspace);
      jest.spyOn(workspaceMemberService, 'create').mockResolvedValue(null);
      jest.spyOn(workspaceMemberService, 'batchCreate').mockResolvedValue(null);

      const result = await controller.create(createWorkspaceDto, req);

      expect(result).toEqual({
        code: 200,
        data: { workspaceId: createdWorkspace._id.toString() },
      });
      expect(workspaceService.create).toHaveBeenCalledWith({
        name: createWorkspaceDto.name,
        description: createWorkspaceDto.description,
        owner: req.user.username,
        ownerId: req.user._id.toString(),
      });
      expect(workspaceMemberService.create).toHaveBeenCalledWith({
        userId: req.user._id.toString(),
        workspaceId: createdWorkspace._id.toString(),
        role: WORKSPACE_ROLE.ADMIN,
      });
      expect(workspaceMemberService.batchCreate).toHaveBeenCalledWith({
        workspaceId: createdWorkspace._id.toString(),
        members: createWorkspaceDto.members,
        creator: req.user.username,
        creatorId: req.user._id.toString(),
      });
    });

    it('should throw an exception if validation fails', async () => {
      const createWorkspaceDto = { name: '', members: [] };
      const req = { user: { _id: new ObjectId() } };

      await expect(controller.create(createWorkspaceDto, req)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of workspaces for the user', async () => {
      const req = { user: { _id: new ObjectId() } };
      const queryInfo: GetWorkspaceListDto = { curPage: 1, pageSize: 10 };
      const memberList = [{ workspaceId: new ObjectId().toString() }];
      const workspaces = [{ _id: new ObjectId(), name: 'Test Workspace' }];
      jest
        .spyOn(workspaceMemberService, 'findAllByUserId')
        .mockResolvedValue(memberList as Array<WorkspaceMember>);

      jest
        .spyOn(workspaceService, 'findAllByIdWithPagination')
        .mockResolvedValue({
          list: workspaces as Array<Workspace>,
          count: workspaces.length,
        });

      jest
        .spyOn(userService, 'getUserListByIds')
        .mockResolvedValue([{ _id: new ObjectId() }] as unknown as Array<User>);

      const result = await controller.findAll(req, queryInfo);

      expect(result.code).toEqual(200);
      expect(workspaceMemberService.findAllByUserId).toHaveBeenCalledWith({
        userId: req.user._id.toString(),
      });
      expect(workspaceService.findAllByIdWithPagination).toHaveBeenCalledWith({
        workspaceIdList: memberList.map((item) => item.workspaceId),
        page: 1,
        limit: 10,
        name: undefined,
      });
    });

    it('should throw an exception if validation fails', async () => {
      const req = { user: { _id: new ObjectId() } };
      const queryInfo: GetWorkspaceListDto = {
        curPage: 'not_a_number',
        pageSize: 10,
      } as any;

      await expect(controller.findAll(req, queryInfo)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('should update a workspace and its members', async () => {
      const id = new ObjectId().toString();
      const userId = new ObjectId();
      const members = {
        newMembers: [{ userId: userId.toString(), role: WORKSPACE_ROLE.ADMIN }],
        adminMembers: [],
        userMembers: [],
      };
      jest
        .spyOn(userService, 'getUserListByIds')
        .mockResolvedValue([{ _id: userId }] as Array<User>);
      const updateDto = {
        name: 'Updated Workspace',
        members: [
          ...members.newMembers,
          ...members.adminMembers,
          ...members.userMembers,
        ],
      };
      const updateResult = { affected: 1, raw: '', generatedMaps: [] };

      jest.spyOn(workspaceService, 'update').mockResolvedValue(updateResult);
      jest.spyOn(workspaceMemberService, 'batchCreate').mockResolvedValue(null);
      jest.spyOn(workspaceMemberService, 'batchUpdate').mockResolvedValue(null);
      jest.spyOn(workspaceMemberService, 'batchDelete').mockResolvedValue(null);

      const result = await controller.update(id, updateDto, {
        user: { username: 'testuser', _id: new ObjectId() },
      });

      expect(result).toEqual({ code: 200 });
      expect(workspaceService.update).toHaveBeenCalledWith({
        id,
        workspace: { name: updateDto.name },
        operator: 'testuser',
        operatorId: expect.any(String),
      });
      expect(workspaceMemberService.batchCreate).toHaveBeenCalledWith({
        workspaceId: id,
        members: members.newMembers,
        creator: 'testuser',
        creatorId: expect.any(String),
      });
      expect(workspaceMemberService.batchUpdate).toHaveBeenCalledWith({
        idList: members.adminMembers,
        role: WORKSPACE_ROLE.ADMIN,
        operator: 'testuser',
        operatorId: expect.any(String),
      });
      expect(workspaceMemberService.batchUpdate).toHaveBeenCalledWith({
        idList: members.userMembers,
        role: WORKSPACE_ROLE.USER,
        operator: 'testuser',
        operatorId: expect.any(String),
      });
      expect(workspaceMemberService.batchDelete).toHaveBeenCalledWith({
        idList: [],
        neIdList: [],
      });
    });
  });
});
