import { Test, TestingModule } from '@nestjs/testing';
import { DownloadTaskService } from '../services/downloadTask.service';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DownloadTask } from 'src/models/downloadTask.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { ResponseSchemaService } from 'src/modules/surveyResponse/services/responseScheme.service';
import { DataStatisticService } from '../services/dataStatistic.service';
import { FileService } from 'src/modules/file/services/file.service';
import { Logger } from 'src/logger';
import { ObjectId } from 'mongodb';
import { DOWNLOAD_TASK_STATUS } from 'src/enums/downloadTaskStatus';

describe('DownloadTaskService', () => {
  let service: DownloadTaskService;
  let responseSchemaService: ResponseSchemaService;
  let dataStatisticService: DataStatisticService;
  let fileService: FileService;
  let downloadTaskRepository: MongoRepository<DownloadTask>;
  let surveyResponseRepository: MongoRepository<SurveyResponse>;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DownloadTaskService,
        {
          provide: getRepositoryToken(DownloadTask),
          useClass: MongoRepository,
        },
        {
          provide: getRepositoryToken(SurveyResponse),
          useClass: MongoRepository,
        },
        {
          provide: ResponseSchemaService,
          useValue: {
            getResponseSchemaByPageId: jest.fn(),
          },
        },
        {
          provide: DataStatisticService,
          useValue: {
            getDataTable: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            upload: jest.fn(),
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

    service = module.get<DownloadTaskService>(DownloadTaskService);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    dataStatisticService =
      module.get<DataStatisticService>(DataStatisticService);
    fileService = module.get<FileService>(FileService);
    logger = module.get<Logger>(Logger);
    downloadTaskRepository = module.get<MongoRepository<DownloadTask>>(
      getRepositoryToken(DownloadTask),
    );
    surveyResponseRepository = module.get<MongoRepository<SurveyResponse>>(
      getRepositoryToken(SurveyResponse),
    );
  });

  describe('createDownloadTask', () => {
    it('should create and save a download task', async () => {
      const mockTaskId = new ObjectId().toString();
      const mockDownloadTask = { _id: new ObjectId(mockTaskId) };
      const mockParams: any = {
        surveyId: 'survey1',
        responseSchema: { title: 'test-title', surveyPath: '/path' },
        creatorId: 'creator1',
        creator: 'creatorName',
        params: { isMasked: true },
      };

      jest
        .spyOn(downloadTaskRepository, 'create')
        .mockReturnValue(mockDownloadTask as any);
      jest
        .spyOn(downloadTaskRepository, 'save')
        .mockResolvedValue(mockDownloadTask as any);

      const result = await service.createDownloadTask(mockParams);

      expect(downloadTaskRepository.create).toHaveBeenCalledWith({
        surveyId: mockParams.surveyId,
        surveyPath: mockParams.responseSchema.surveyPath,
        fileSize: '计算中',
        creatorId: mockParams.creatorId,
        creator: mockParams.creator,
        params: {
          ...mockParams.params,
          title: mockParams.responseSchema.title,
        },
        filename: expect.any(String),
        status: DOWNLOAD_TASK_STATUS.WAITING,
      });
      expect(downloadTaskRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTaskId);
    });
  });

  describe('getDownloadTaskList', () => {
    it('should return task list and total count', async () => {
      const mockCreatorId = 'creator1';
      const mockTasks = [{ _id: '1' }, { _id: '2' }];
      const mockTotal = 2;

      jest
        .spyOn(downloadTaskRepository, 'findAndCount')
        .mockResolvedValue([mockTasks as any, mockTotal]);

      const result = await service.getDownloadTaskList({
        creatorId: mockCreatorId,
        pageIndex: 1,
        pageSize: 10,
      });

      expect(downloadTaskRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          creatorId: mockCreatorId,
          isDeleted: { $ne: true },
        },
        take: 10,
        skip: 0,
        order: { createdAt: -1 },
      });

      expect(result).toEqual({
        total: mockTotal,
        list: mockTasks,
      });
    });
  });

  describe('getDownloadTaskById', () => {
    it('should return task by id', async () => {
      const mockTaskId = new ObjectId().toString();
      const mockTask = { _id: new ObjectId(mockTaskId) };

      jest
        .spyOn(downloadTaskRepository, 'find')
        .mockResolvedValue([mockTask as any]);

      const result = await service.getDownloadTaskById({ taskId: mockTaskId });

      expect(downloadTaskRepository.find).toHaveBeenCalledWith({
        where: { _id: new ObjectId(mockTaskId) },
      });
      expect(result).toEqual(mockTask);
    });

    it('should return null if task is not found', async () => {
      const mockTaskId = new ObjectId().toString();

      jest.spyOn(downloadTaskRepository, 'find').mockResolvedValue([]);

      const result = await service.getDownloadTaskById({ taskId: mockTaskId });

      expect(result).toBeNull();
    });
  });

  describe('deleteDownloadTask', () => {
    it('should mark task as deleted and set deletedAt', async () => {
      const mockTaskId = new ObjectId().toString();
      const mockOperator = 'operatorName';
      const mockOperatorId = 'operatorId1';
      const mockUpdateResult = { matchedCount: 1 };

      jest
        .spyOn(downloadTaskRepository, 'updateOne')
        .mockResolvedValue(mockUpdateResult as any);

      const result = await service.deleteDownloadTask({
        taskId: mockTaskId,
        operator: mockOperator,
        operatorId: mockOperatorId,
      });

      expect(downloadTaskRepository.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(mockTaskId) },
        {
          $set: {
            isDeleted: true,
            operator: mockOperator,
            operatorId: mockOperatorId,
            deletedAt: expect.any(Date),
          },
        },
      );
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('processDownloadTask', () => {
    it('should push task to queue and execute if not executing', async () => {
      const mockTaskId = new ObjectId().toString();
      jest.spyOn(service, 'executeTask').mockImplementation(jest.fn());

      service.processDownloadTask({ taskId: mockTaskId });

      expect(DownloadTaskService.taskList).toContain(mockTaskId);
      expect(service.executeTask).toHaveBeenCalled();
    });

    it('should handle already executing case', async () => {
      const mockTaskId = new ObjectId().toString();
      DownloadTaskService.isExecuting = true;
      jest.spyOn(service, 'executeTask').mockImplementation(jest.fn());

      service.processDownloadTask({ taskId: mockTaskId });

      expect(DownloadTaskService.taskList).toContain(mockTaskId);
      expect(service.executeTask).not.toHaveBeenCalled();
    });
  });

  describe('handleDownloadTask', () => {
    let mockTaskInfo;
    let mockResponseSchema;
    let mockListHead;
    let mockListBody;
    let mockUploadResult;

    beforeEach(() => {
      mockTaskInfo = {
        _id: new ObjectId(),
        surveyId: 'survey1',
        filename: 'test.xlsx',
      };

      mockResponseSchema = {
        title: 'Test Survey',
        surveyPath: '/test/path',
      };

      mockListHead = [
        { title: '<div>姓名</div>', field: 'name' },
        { title: '<div>年龄</div>', field: 'age' },
      ];

      mockListBody = [
        { name: '<div>张三</div>', age: '20' },
        { name: '<div>李四</div>', age: '30' },
      ];

      mockUploadResult = { url: 'http://test.com/file', key: 'test-key' };

      jest
        .spyOn(downloadTaskRepository, 'updateOne')
        .mockResolvedValue({ matchedCount: 1 });
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockResolvedValue(mockResponseSchema);
      jest.spyOn(surveyResponseRepository, 'count').mockResolvedValue(2);
      jest.spyOn(dataStatisticService, 'getDataTable').mockResolvedValue({
        listHead: mockListHead,
        listBody: mockListBody,
        total: 2,
      });
      jest.spyOn(fileService, 'upload').mockResolvedValue(mockUploadResult);
    });

    it('should successfully process download task', async () => {
      await service.handleDownloadTask({ taskInfo: mockTaskInfo });

      // 验证状态更新为计算中
      expect(downloadTaskRepository.updateOne).toHaveBeenCalledWith(
        { _id: mockTaskInfo._id },
        {
          $set: {
            status: DOWNLOAD_TASK_STATUS.COMPUTING,
            updatedAt: expect.any(Date),
          },
        },
      );

      // 验证获取数据
      expect(
        responseSchemaService.getResponseSchemaByPageId,
      ).toHaveBeenCalledWith(mockTaskInfo.surveyId);
      expect(surveyResponseRepository.count).toHaveBeenCalled();
      expect(dataStatisticService.getDataTable).toHaveBeenCalled();

      // 验证文件上传
      expect(fileService.upload).toHaveBeenCalledWith({
        configKey: 'SERVER_LOCAL_CONFIG',
        file: expect.any(Object),
        pathPrefix: 'exportfile',
        filename: mockTaskInfo.filename,
      });

      // 验证最终状态更新
      expect(downloadTaskRepository.updateOne).toHaveBeenCalledWith(
        { _id: mockTaskInfo._id },
        {
          $set: {
            status: DOWNLOAD_TASK_STATUS.SUCCEED,
            url: mockUploadResult.url,
            fileKey: mockUploadResult.key,
            fileSize: expect.any(Number),
            updatedAt: expect.any(Date),
          },
        },
      );
    });

    it('should handle task processing error', async () => {
      const error = new Error('Processing failed');
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockRejectedValue(error);

      await service.handleDownloadTask({ taskInfo: mockTaskInfo });

      expect(downloadTaskRepository.updateOne).toHaveBeenCalledWith(
        { _id: mockTaskInfo._id },
        {
          $set: {
            status: DOWNLOAD_TASK_STATUS.FAILED,
            updatedAt: expect.any(Date),
          },
        },
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('executeTask', () => {
    it('should skip deleted tasks', async () => {
      const mockTaskId = new ObjectId().toString();
      DownloadTaskService.taskList.push(mockTaskId);

      jest.spyOn(service, 'getDownloadTaskById').mockResolvedValue({
        _id: new ObjectId(mockTaskId),
        isDeleted: true,
      } as any);

      jest.spyOn(service, 'handleDownloadTask');

      await service.executeTask();

      expect(service.handleDownloadTask).not.toHaveBeenCalled();
      expect(DownloadTaskService.isExecuting).toBe(false);
    });

    it('should handle multiple tasks in queue', async () => {
      const mockTaskIds = [
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      DownloadTaskService.taskList.push(...mockTaskIds);

      const mockTasks = mockTaskIds.map((id) => ({
        _id: new ObjectId(id),
        isDeleted: false,
      })) as Array<DownloadTask>;

      let taskIndex = 0;
      jest
        .spyOn(service, 'getDownloadTaskById')
        .mockImplementation(async () => mockTasks[taskIndex++]);
      jest.spyOn(service, 'handleDownloadTask').mockResolvedValue(undefined);

      await service.executeTask();

      expect(service.handleDownloadTask).toHaveBeenCalledTimes(2);
      expect(DownloadTaskService.taskList).toHaveLength(0);
      expect(DownloadTaskService.isExecuting).toBe(false);
    });
  });
});
