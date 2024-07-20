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

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: WorkspaceService;
  let workspaceMemberService: WorkspaceMemberService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            create: jest.fn(),
            findAllById: jest.fn(),
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
            batchSearchByWorkspace: jest.fn(),
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
  });

  describe('create', () => {
    it('should create a workspace and return workspaceId', async () => {
      const createWorkspaceDto: CreateWorkspaceDto = {
        name: 'Test Workspace',
        description: 'Test Description',
        members: [{ userId: 'userId1', role: WORKSPACE_ROLE.USER }],
      };
      const req = { user: { _id: new ObjectId() } };
      const createdWorkspace = { _id: new ObjectId() };

      jest.spyOn(userService, 'getUserListByIds').mockResolvedValue([
        {
          _id: 'userId1',
        },
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
      });
    });

    it('should throw an exception if validation fails', async () => {
      const createWorkspaceDto: CreateWorkspaceDto = {
        name: '',
        members: [],
      };
      const req = { user: { _id: new ObjectId() } };

      await expect(controller.create(createWorkspaceDto, req)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of workspaces for the user', async () => {
      const req = { user: { _id: new ObjectId() } };
      const memberList = [{ workspaceId: new ObjectId().toString() }];
      const workspaces = [{ _id: new ObjectId(), name: 'Test Workspace' }];

      jest
        .spyOn(workspaceMemberService, 'findAllByUserId')
        .mockResolvedValue(memberList as unknown as Array<WorkspaceMember>);

      jest
        .spyOn(workspaceService, 'findAllByIdWithPagination')
        .mockResolvedValue({
          list: workspaces as Array<Workspace>,
          count: workspaces.length,
        });

      jest.spyOn(userService, 'getUserListByIds').mockResolvedValue([]);

      const result = await controller.findAll(req, {
        curPage: 1,
        pageSize: 10,
      });

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
      jest.spyOn(userService, 'getUserListByIds').mockResolvedValue([
        {
          _id: userId,
        },
      ] as Array<User>);
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

      const result = await controller.update(id, updateDto);

      expect(result).toEqual({
        code: 200,
      });
      expect(workspaceService.update).toHaveBeenCalledWith(id, {
        name: updateDto.name,
      });
      expect(workspaceMemberService.batchCreate).toHaveBeenCalledWith({
        workspaceId: id,
        members: members.newMembers,
      });
      expect(workspaceMemberService.batchUpdate).toHaveBeenCalledWith({
        idList: members.adminMembers,
        role: WORKSPACE_ROLE.ADMIN,
      });
      expect(workspaceMemberService.batchUpdate).toHaveBeenCalledWith({
        idList: members.userMembers,
        role: WORKSPACE_ROLE.USER,
      });
    });
  });

  describe('delete', () => {
    it('should delete a workspace', async () => {
      const id = 'workspaceId';

      jest.spyOn(workspaceService, 'delete').mockResolvedValue(null);

      const result = await controller.delete(id);

      expect(result).toEqual({ code: 200 });
      expect(workspaceService.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getWorkspaceAndMember', () => {
    it('should return a list of workspaces and members for the user', async () => {
      const req = { user: { _id: new ObjectId() } };

      const workspaceId = new ObjectId();
      const memberList = [{ workspaceId, userId: new ObjectId() }];
      const workspaces = [{ _id: workspaceId, name: 'Test Workspace' }];

      jest
        .spyOn(workspaceService, 'findAllByUserId')
        .mockResolvedValue(workspaces as Array<Workspace>);
      jest
        .spyOn(workspaceMemberService, 'batchSearchByWorkspace')
        .mockResolvedValue(memberList as unknown as Array<WorkspaceMember>);

      const result = await controller.getWorkspaceAndMember(req);

      expect(result.code).toEqual(200);
      expect(workspaceService.findAllByUserId).toHaveBeenCalledWith(
        req.user._id.toString(),
      );
      expect(
        workspaceMemberService.batchSearchByWorkspace,
      ).toHaveBeenCalledWith(workspaces.map((item) => item._id.toString()));
    });
  });
});
