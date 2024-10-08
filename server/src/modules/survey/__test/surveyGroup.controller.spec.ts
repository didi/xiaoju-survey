// import { Test, TestingModule } from '@nestjs/testing';
// import { SurveyGroupController } from '../controllers/surveyGroup.controller';
// import { SurveyGroupService } from '../services/surveyGroup.service';
// import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
// import { Logger } from 'src/logger';
// import { HttpException } from 'src/exceptions/httpException';
// import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
// import { CreateSurveyGroupDto } from '../dto/createSurveyGroup.dto';
// import { UpdateSurveyGroupDto } from '../dto/updateSurveyGroup.dto';
// import { GetGroupListDto } from '../dto/getGroupList.dto';

import { Test, TestingModule } from '@nestjs/testing';
import { SurveyGroupController } from '../controllers/surveyGroup.controller'; // Adjust path accordingly
import { SurveyGroupService } from '../services/surveyGroup.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { CreateSurveyGroupDto } from '../dto/createSurveyGroup.dto';
import { UpdateSurveyGroupDto } from '../dto/updateSurveyGroup.dto';

describe('SurveyGroupController', () => {
  let controller: SurveyGroupController;
  let surveyGroupService: SurveyGroupService;
  let surveyMetaService: SurveyMetaService;
  let logger: Logger;

  const mockUser = { _id: 'userId123' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyGroupController],
      providers: [
        {
          provide: SurveyGroupService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: SurveyMetaService,
          useValue: {
            countSurveyMetaByGroupId: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SurveyGroupController>(SurveyGroupController);
    surveyGroupService = module.get<SurveyGroupService>(SurveyGroupService);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new survey group', async () => {
      const reqBody: CreateSurveyGroupDto = { name: 'Test Group' };
      const req = { user: mockUser };

      jest
        .spyOn(surveyGroupService, 'create')
        .mockResolvedValue({ _id: 'newGroupId' });
      const result = await controller.create(reqBody, req);

      expect(result).toEqual({ code: 200, data: { id: 'newGroupId' } });
      expect(surveyGroupService.create).toHaveBeenCalledWith({
        name: reqBody.name,
        ownerId: mockUser._id,
      });
    });

    it('should throw an error if validation fails', async () => {
      const reqBody = { name: '' }; // Invalid input
      const req = { user: mockUser };

      await expect(controller.create(reqBody, req)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('createSurveyGroup_parameter error:'),
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of survey groups', async () => {
      const queryInfo = { curPage: 1, pageSize: 10 };
      const req = { user: mockUser };
      const mockGroupList = [
        { _id: 'groupId1', name: 'Group 1', createdAt: new Date() },
      ];

      jest.spyOn(surveyGroupService, 'findAll').mockResolvedValue({
        total: 1,
        list: mockGroupList,
        allList: mockGroupList,
      });
      jest
        .spyOn(surveyMetaService, 'countSurveyMetaByGroupId')
        .mockResolvedValue(5);

      const result = await controller.findAll(req, queryInfo);
      expect(result).toEqual({
        code: 200,
        data: {
          total: 1,
          list: [
            {
              _id: 'groupId1',
              name: 'Group 1',
              createdAt: expect.any(String),
              surveyTotal: 5,
            },
          ],
          allList: mockGroupList,
        },
      });
    });

    it('should throw an error if validation fails', async () => {
      const queryInfo = { curPage: 0, pageSize: 10 }; // Invalid input
      const req = { user: mockUser };

      await expect(controller.findAll(req, queryInfo)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('GetGroupListDto validate failed:'),
      );
    });
  });

  describe('findOne', () => {
    it('should find a survey group by id', async () => {
      const id = '1';
      jest.spyOn(surveyGroupService, 'findOne').mockReturnValue({ id });

      const result = await controller.findOne(id);
      expect(result).toEqual({ id });
      expect(surveyGroupService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('updateOne', () => {
    it('should update a survey group', async () => {
      const id = '1';
      const reqBody: UpdateSurveyGroupDto = { name: 'Updated Group' };

      jest.spyOn(surveyGroupService, 'update').mockResolvedValue({});
      const result = await controller.updateOne(id, reqBody);

      expect(result).toEqual({ code: 200, ret: {} });
      expect(surveyGroupService.update).toHaveBeenCalledWith(id, reqBody);
    });

    it('should throw an error if validation fails', async () => {
      const id = '1';
      const reqBody = { name: '' }; // Invalid input

      await expect(controller.updateOne(id, reqBody)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('createSurveyGroup_parameter error:'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a survey group', async () => {
      const id = '1';
      jest.spyOn(surveyGroupService, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(id);
      expect(result).toEqual({ code: 200 });
      expect(surveyGroupService.remove).toHaveBeenCalledWith(id);
    });
  });
});
