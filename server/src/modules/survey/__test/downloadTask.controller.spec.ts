import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { DownloadTaskController } from '../controllers/downloadTask.controller';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { DownloadTaskService } from '../services/downloadTask.service';
import { CollaboratorService } from '../services/collaborator.service';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';

import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { NoPermissionException } from 'src/exceptions/noPermissionException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

import { Authentication } from 'src/guards/authentication.guard';
import { SurveyGuard } from 'src/guards/survey.guard';

describe('DownloadTaskController', () => {
  let controller: DownloadTaskController;
  let responseSchemaService: ResponseSchemaService;
  let downloadTaskService: DownloadTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadTaskController],
      providers: [
        {
          provide: ResponseSchemaService,
          useValue: {
            getResponseSchemaByPageId: jest.fn(),
          },
        },
        {
          provide: DownloadTaskService,
          useValue: {
            createDownloadTask: jest.fn(),
            processDownloadTask: jest.fn(),
            getDownloadTaskList: jest.fn(),
            getDownloadTaskById: jest.fn(),
            deleteDownloadTask: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useClass: jest.fn().mockImplementation(() => ({
            varifytoken() {
              return {};
            },
          })),
        },
        {
          provide: CollaboratorService,
          useValue: {},
        },
        {
          provide: SurveyMetaService,
          useValue: {},
        },
        {
          provide: WorkspaceMemberService,
          useValue: {},
        },
        {
          provide: Authentication,
          useClass: jest.fn().mockImplementation(() => ({
            canActivate: () => true,
          })),
        },
        {
          provide: SurveyGuard,
          useClass: jest.fn().mockImplementation(() => ({
            canActivate: () => true,
          })),
        },
      ],
    }).compile();

    controller = module.get<DownloadTaskController>(DownloadTaskController);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    downloadTaskService = module.get<DownloadTaskService>(DownloadTaskService);
  });

  describe('createTask', () => {
    it('should create a download task successfully', async () => {
      const mockReqBody = {
        surveyId: new ObjectId().toString(),
        isMasked: false,
      };
      const mockReq = { user: { _id: 'mockUserId', username: 'mockUsername' } };
      const mockTaskId = 'mockTaskId';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockResolvedValue({} as any);
      jest
        .spyOn(downloadTaskService, 'createDownloadTask')
        .mockResolvedValue(mockTaskId);

      const result = await controller.createTask(mockReqBody, mockReq);

      expect(
        responseSchemaService.getResponseSchemaByPageId,
      ).toHaveBeenCalledWith(mockReqBody.surveyId);
      expect(downloadTaskService.createDownloadTask).toHaveBeenCalledWith({
        surveyId: mockReqBody.surveyId,
        responseSchema: {},
        creatorId: mockReq.user._id.toString(),
        creator: mockReq.user.username,
        params: { isMasked: mockReqBody.isMasked },
      });
      expect(downloadTaskService.processDownloadTask).toHaveBeenCalledWith({
        taskId: mockTaskId,
      });
      expect(result).toEqual({ code: 200, data: { taskId: mockTaskId } });
    });

    it('should throw HttpException if validation fails', async () => {
      const mockReqBody: any = { isMasked: false };
      const mockReq = { user: { _id: 'mockUserId', username: 'mockUsername' } };

      await expect(controller.createTask(mockReqBody, mockReq)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('downloadList', () => {
    it('should return the download task list', async () => {
      const mockQueryInfo = { pageIndex: 1, pageSize: 10 };
      const mockReq = { user: { _id: 'mockUserId' } };
      const mockTaskList: any = {
        total: 1,
        list: [
          {
            _id: 'mockTaskId',
            curStatus: 'completed',
            filename: 'mockFile.csv',
            url: 'http://mock-url.com',
            fileSize: 1024,
            createdAt: Date.now(),
          },
        ],
      };
      jest
        .spyOn(downloadTaskService, 'getDownloadTaskList')
        .mockResolvedValue(mockTaskList);

      const result = await controller.downloadList(mockQueryInfo, mockReq);

      expect(downloadTaskService.getDownloadTaskList).toHaveBeenCalledWith({
        creatorId: mockReq.user._id.toString(),
        pageIndex: mockQueryInfo.pageIndex,
        pageSize: mockQueryInfo.pageSize,
      });
      expect(result.data.total).toEqual(mockTaskList.total);
      expect(result.data.list[0].taskId).toEqual(
        mockTaskList.list[0]._id.toString(),
      );
    });

    it('should throw HttpException if validation fails', async () => {
      const mockQueryInfo: any = { pageIndex: 'invalid', pageSize: 10 };
      const mockReq = { user: { _id: 'mockUserId' } };

      await expect(
        controller.downloadList(mockQueryInfo, mockReq),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getDownloadTask', () => {
    it('should return a download task', async () => {
      const mockQuery = { taskId: 'mockTaskId' };
      const mockReq = { user: { _id: 'mockUserId' } };
      const mockTaskInfo: any = {
        _id: 'mockTaskId',
        creatorId: 'mockUserId',
        curStatus: 'completed',
      };
      jest
        .spyOn(downloadTaskService, 'getDownloadTaskById')
        .mockResolvedValue(mockTaskInfo);

      const result = await controller.getDownloadTask(mockQuery, mockReq);

      expect(downloadTaskService.getDownloadTaskById).toHaveBeenCalledWith({
        taskId: mockQuery.taskId,
      });
      expect(result.data.taskId).toEqual(mockTaskInfo._id.toString());
    });

    it('should throw NoPermissionException if user has no permission', async () => {
      const mockQuery = { taskId: 'mockTaskId' };
      const mockReq = { user: { _id: new ObjectId() } };
      const mockTaskInfo: any = {
        _id: 'mockTaskId',
        creatorId: 'mockUserId',
        curStatus: 'completed',
      };

      jest
        .spyOn(downloadTaskService, 'getDownloadTaskById')
        .mockResolvedValue(mockTaskInfo);

      await expect(
        controller.getDownloadTask(mockQuery, mockReq),
      ).rejects.toThrow(new NoPermissionException('没有权限'));
    });
  });

  describe('deleteFileByName', () => {
    it('should delete a download task successfully', async () => {
      const mockBody = { taskId: 'mockTaskId' };
      const mockUserId = new ObjectId();
      const mockReq = {
        user: { _id: mockUserId, username: 'mockUsername' },
      };
      const mockTaskInfo: any = {
        _id: new ObjectId(),
        creatorId: mockUserId.toString(),
      };
      const mockDelRes = { modifiedCount: 1 };

      jest
        .spyOn(downloadTaskService, 'getDownloadTaskById')
        .mockResolvedValue(mockTaskInfo);
      jest
        .spyOn(downloadTaskService, 'deleteDownloadTask')
        .mockResolvedValue(mockDelRes);

      const result = await controller.deleteFileByName(mockBody, mockReq);

      expect(downloadTaskService.deleteDownloadTask).toHaveBeenCalledWith({
        taskId: mockBody.taskId,
        operator: mockReq.user.username,
        operatorId: mockReq.user._id.toString(),
      });
      expect(result).toEqual({ code: 200, data: true });
    });

    it('should throw HttpException if task does not exist', async () => {
      const mockBody = { taskId: 'mockTaskId' };
      const mockReq = { user: { _id: 'mockUserId' } };

      jest
        .spyOn(downloadTaskService, 'getDownloadTaskById')
        .mockResolvedValue(null);

      await expect(
        controller.deleteFileByName(mockBody, mockReq),
      ).rejects.toThrow(
        new HttpException('任务不存在', EXCEPTION_CODE.PARAMETER_ERROR),
      );
    });
  });
});
