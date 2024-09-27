import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorController } from '../controllers/collaborator.controller';
import { CollaboratorService } from '../services/collaborator.service';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { CreateCollaboratorDto } from '../dto/createCollaborator.dto';
import { Collaborator } from 'src/models/collaborator.entity';
import { GetSurveyCollaboratorListDto } from '../dto/getSurveyCollaboratorList.dto';
import { UserService } from 'src/modules/auth/services/user.service';
import { ObjectId } from 'mongodb';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import {
  SURVEY_PERMISSION,
  SURVEY_PERMISSION_DESCRIPTION,
} from 'src/enums/surveyPermission';
import { BatchSaveCollaboratorDto } from '../dto/batchSaveCollaborator.dto';
import { User } from 'src/models/user.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('CollaboratorController', () => {
  let controller: CollaboratorController;
  let collaboratorService: CollaboratorService;
  let logger: Logger;
  let userService: UserService;
  let surveyMetaService: SurveyMetaService;
  let workspaceMemberServie: WorkspaceMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorController],
      providers: [
        {
          provide: CollaboratorService,
          useValue: {
            create: jest.fn(),
            getSurveyCollaboratorList: jest.fn(),
            changeUserPermission: jest.fn(),
            deleteCollaborator: jest.fn(),
            getCollaborator: jest.fn(),
            batchDeleteBySurveyId: jest.fn(),
            batchCreate: jest.fn(),
            batchDelete: jest.fn(),
            updateById: jest.fn(),
            batchSaveCollaborator: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            info: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn().mockImplementation((id) => {
              return Promise.resolve({
                _id: new ObjectId(id),
              });
            }),
            getUserListByIds: jest.fn(),
          },
        },
        {
          provide: SurveyMetaService,
          useValue: {
            getSurveyById: jest.fn(),
          },
        },
        {
          provide: WorkspaceMemberService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<CollaboratorController>(CollaboratorController);
    collaboratorService = module.get<CollaboratorService>(CollaboratorService);
    logger = module.get<Logger>(Logger);
    userService = module.get<UserService>(UserService);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
    workspaceMemberServie = module.get<WorkspaceMemberService>(
      WorkspaceMemberService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addCollaborator', () => {
    it('should add a collaborator successfully', async () => {
      const userId = new ObjectId().toString();
      const reqBody: CreateCollaboratorDto = {
        surveyId: 'surveyId',
        userId: new ObjectId().toString(),
        permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
      };
      const req = { user: { _id: 'userId' }, surveyMeta: { ownerId: userId } };
      const result = { _id: 'collaboratorId' };

      jest
        .spyOn(collaboratorService, 'create')
        .mockResolvedValue(result as unknown as Collaborator);

      const response = await controller.addCollaborator(reqBody, req);

      expect(response).toEqual({
        code: 200,
        data: {
          collaboratorId: result._id,
        },
      });
    });

    it('should throw an exception if validation fails', async () => {
      const reqBody: CreateCollaboratorDto = {
        surveyId: '',
        userId: '',
        permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
      };
      const req = { user: { _id: 'userId' } };

      await expect(controller.addCollaborator(reqBody, req)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception if user does not exist', async () => {
      const reqBody: CreateCollaboratorDto = {
        surveyId: 'surveyId',
        userId: new ObjectId().toString(),
        permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
      };
      const req = {
        user: { _id: 'userId' },
        surveyMeta: { ownerId: new ObjectId().toString() },
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

      await expect(controller.addCollaborator(reqBody, req)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception if user is the survey owner', async () => {
      const userId = new ObjectId().toString();
      const reqBody: CreateCollaboratorDto = {
        surveyId: 'surveyId',
        userId: userId,
        permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
      };
      const req = { user: { _id: 'userId' }, surveyMeta: { ownerId: userId } };

      await expect(controller.addCollaborator(reqBody, req)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception if user is already a collaborator', async () => {
      const userId = new ObjectId().toString();
      const reqBody: CreateCollaboratorDto = {
        surveyId: 'surveyId',
        userId: userId,
        permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
      };
      const req = {
        user: { _id: 'userId' },
        surveyMeta: { ownerId: new ObjectId().toString() },
      };

      jest
        .spyOn(collaboratorService, 'getCollaborator')
        .mockResolvedValue({} as unknown as Collaborator);

      await expect(controller.addCollaborator(reqBody, req)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getSurveyCollaboratorList', () => {
    it('should return collaborator list', async () => {
      const query = { surveyId: 'surveyId' };
      const result = [
        { _id: 'collaboratorId', userId: 'userId', username: '' },
      ];

      jest
        .spyOn(collaboratorService, 'getSurveyCollaboratorList')
        .mockResolvedValue(result as unknown as Array<Collaborator>);

      jest.spyOn(userService, 'getUserListByIds').mockResolvedValueOnce([]);

      const response = await controller.getSurveyCollaboratorList(query);

      expect(response).toEqual({
        code: 200,
        data: result,
      });
    });

    it('should throw an exception if validation fails', async () => {
      const query: GetSurveyCollaboratorListDto = {
        surveyId: '',
      };

      await expect(controller.getSurveyCollaboratorList(query)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeUserPermission', () => {
    it('should change user permission successfully', async () => {
      const reqBody = {
        surveyId: 'surveyId',
        userId: 'userId',
        permissions: ['read'],
      };
      const result = { _id: 'userId', permissions: ['read'] };

      jest
        .spyOn(collaboratorService, 'changeUserPermission')
        .mockResolvedValue(result);

      const response = await controller.changeUserPermission(reqBody);

      expect(response).toEqual({
        code: 200,
        data: result,
      });
    });

    it('should throw an exception if validation fails', async () => {
      const reqBody = {
        surveyId: '',
        userId: '',
        permissions: ['surveyManage'],
      };

      await expect(controller.changeUserPermission(reqBody)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCollaborator', () => {
    it('should delete collaborator successfully', async () => {
      const query = { surveyId: 'surveyId', userId: 'userId' };
      const result = { acknowledged: true, deletedCount: 1 };

      jest
        .spyOn(collaboratorService, 'deleteCollaborator')
        .mockResolvedValue(result);

      const response = await controller.deleteCollaborator(query);

      expect(response).toEqual({
        code: 200,
        data: result,
      });
    });

    it('should throw an exception if validation fails', async () => {
      const query = { surveyId: '', userId: '' };

      await expect(controller.deleteCollaborator(query)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  // 新增的测试方法
  describe('getPermissionList', () => {
    it('should return the permission list', async () => {
      const result = Object.values(SURVEY_PERMISSION_DESCRIPTION);

      const response = await controller.getPermissionList();

      expect(response).toEqual({
        code: 200,
        data: result,
      });
    });
  });

  describe('batchSaveCollaborator', () => {
    it('should batch save collaborators successfully', async () => {
      const userId0 = new ObjectId().toString();
      const userId1 = new ObjectId().toString();
      const existsCollaboratorId = new ObjectId().toString();
      const surveyId = new ObjectId().toString();
      const reqBody: BatchSaveCollaboratorDto = {
        surveyId: surveyId,
        collaborators: [
          {
            userId: userId0,
            permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
          },
          {
            _id: existsCollaboratorId,
            userId: userId1,
            permissions: [SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE],
          },
        ],
      };
      const req = {
        user: { _id: 'requestUserId' },
        surveyMeta: { ownerId: 'ownerId' },
      };

      const userList = [
        { _id: new ObjectId(userId0) },
        { _id: new ObjectId(userId1) },
      ];

      jest
        .spyOn(userService, 'getUserListByIds')
        .mockResolvedValue(userList as unknown as User[]);
      jest
        .spyOn(collaboratorService, 'batchDelete')
        .mockResolvedValue({ deletedCount: 1, acknowledged: true });
      jest
        .spyOn(collaboratorService, 'batchCreate')
        .mockResolvedValue([{}] as any);
      jest.spyOn(collaboratorService, 'updateById').mockResolvedValue({});

      const response = await controller.batchSaveCollaborator(reqBody, req);

      expect(response).toEqual({
        code: 200,
      });
      expect(userService.getUserListByIds).toHaveBeenCalled();
      expect(collaboratorService.batchDelete).toHaveBeenCalled();
      expect(collaboratorService.batchCreate).toHaveBeenCalled();
      expect(collaboratorService.updateById).toHaveBeenCalled();
    });

    it('should throw an exception if validation fails', async () => {
      const reqBody: BatchSaveCollaboratorDto = {
        surveyId: '',
        collaborators: [
          {
            userId: '',
            permissions: [SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE],
          },
        ],
      };
      const req = { user: { _id: 'userId' } };

      await expect(
        controller.batchSaveCollaborator(reqBody, req),
      ).rejects.toThrow(HttpException);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserSurveyPermissions', () => {
    it('should return owner permissions if user is the owner', async () => {
      const req = {
        user: { _id: new ObjectId(), username: 'owner' },
      };
      const query = { surveyId: 'surveyId' };
      const surveyMeta = {
        ownerId: req.user._id.toString(),
        owner: req.user.username,
        workspaceId: 'workspaceId',
      };

      jest
        .spyOn(surveyMetaService, 'getSurveyById')
        .mockResolvedValue(surveyMeta as SurveyMeta);

      const response = await controller.getUserSurveyPermissions(req, query);

      expect(response).toEqual({
        code: 200,
        data: {
          isOwner: true,
          permissions: [
            SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
            SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
            SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
          ],
        },
      });
    });

    it('should return default permissions if user is a workspace member', async () => {
      const req = {
        user: { _id: new ObjectId(), username: 'user' },
      };
      const query = { surveyId: 'surveyId' };
      const surveyMeta = {
        ownerId: 'ownerId',
        owner: 'owner',
        workspaceId: 'workspaceId',
      };

      jest
        .spyOn(surveyMetaService, 'getSurveyById')
        .mockResolvedValue(surveyMeta as SurveyMeta);
      jest.spyOn(workspaceMemberServie, 'findOne').mockResolvedValue({} as any);

      const response = await controller.getUserSurveyPermissions(req, query);

      expect(response).toEqual({
        code: 200,
        data: {
          isOwner: false,
          permissions: [
            SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
            SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
            SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
          ],
        },
      });
    });

    it('should return collaborator permissions if user is a collaborator', async () => {
      const req = {
        user: { _id: new ObjectId(), username: 'user' },
      };
      const query = { surveyId: 'surveyId' };
      const surveyMeta = {
        ownerId: 'ownerId',
        owner: 'owner',
        workspaceId: 'workspaceId',
      };
      const collaborator = {
        permissions: ['read', 'write'],
      };

      jest
        .spyOn(surveyMetaService, 'getSurveyById')
        .mockResolvedValue(surveyMeta as SurveyMeta);
      jest.spyOn(workspaceMemberServie, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(collaboratorService, 'getCollaborator')
        .mockResolvedValue(collaborator as Collaborator);

      const response = await controller.getUserSurveyPermissions(req, query);

      expect(response).toEqual({
        code: 200,
        data: {
          isOwner: false,
          permissions: collaborator.permissions,
        },
      });
    });

    it('should return empty permissions if user has no permissions', async () => {
      const req = {
        user: { _id: new ObjectId(), username: 'user' },
      };
      const query = { surveyId: 'surveyId' };
      const surveyMeta = {
        ownerId: 'ownerId',
        owner: 'owner',
        workspaceId: 'workspaceId',
      };

      jest
        .spyOn(surveyMetaService, 'getSurveyById')
        .mockResolvedValue(surveyMeta as SurveyMeta);
      jest.spyOn(workspaceMemberServie, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(collaboratorService, 'getCollaborator')
        .mockResolvedValue(null);

      const response = await controller.getUserSurveyPermissions(req, query);

      expect(response).toEqual({
        code: 200,
        data: {
          isOwner: false,
          permissions: [],
        },
      });
    });

    it('should throw an exception if survey does not exist', async () => {
      const req = { user: { _id: 'userId' } };
      const query = { surveyId: 'nonexistentSurveyId' };

      jest
        .spyOn(surveyMetaService, 'getSurveyById')
        .mockResolvedValueOnce(null);

      await expect(
        controller.getUserSurveyPermissions(req, query),
      ).rejects.toThrow(HttpException);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});
