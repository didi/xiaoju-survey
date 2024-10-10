import { Test, TestingModule } from '@nestjs/testing';
import { SurveyGroupService } from '../services/surveyGroup.service';
import { SurveyGroup } from 'src/models/surveyGroup.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SurveyGroupService', () => {
  let service: SurveyGroupService;

  const mockSurveyGroupRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockSurveyMetaRepository = {
    updateMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyGroupService,
        {
          provide: getRepositoryToken(SurveyGroup),
          useValue: mockSurveyGroupRepository,
        },
        {
          provide: getRepositoryToken(SurveyMeta),
          useValue: mockSurveyMetaRepository,
        },
      ],
    }).compile();

    service = module.get<SurveyGroupService>(SurveyGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a survey group', async () => {
      const createParams = { name: 'Test Group', ownerId: '123' };
      const mockSavedGroup = { ...createParams, id: '1' };

      mockSurveyGroupRepository.create.mockReturnValue(mockSavedGroup);
      mockSurveyGroupRepository.save.mockResolvedValue(mockSavedGroup);

      expect(await service.create(createParams)).toEqual(mockSavedGroup);
      expect(mockSurveyGroupRepository.create).toHaveBeenCalledWith(
        createParams,
      );
      expect(mockSurveyGroupRepository.save).toHaveBeenCalledWith(
        mockSavedGroup,
      );
    });
  });

  describe('findAll', () => {
    it('should return survey groups', async () => {
      const list = [{ id: '1', name: 'Test Group', ownerId: '123' }];
      const total = list.length;

      mockSurveyGroupRepository.findAndCount.mockResolvedValue([list, total]);
      mockSurveyGroupRepository.find.mockResolvedValue(list);

      const result = await service.findAll('123', '', 0, 10);
      expect(result).toEqual({ total, list, allList: list });
      expect(mockSurveyGroupRepository.findAndCount).toHaveBeenCalled();
      expect(mockSurveyGroupRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a survey group', async () => {
      const id = '1';
      const updatedFields = { name: 'Updated Test Group' };

      await service.update(id, updatedFields);
      expect(mockSurveyGroupRepository.update).toHaveBeenCalledWith(id, {
        ...updatedFields,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should remove a survey group', async () => {
      const id = '1';
      await service.remove(id);
      expect(mockSurveyMetaRepository.updateMany).toHaveBeenCalledWith(
        { groupId: id },
        { $set: { groupId: null } },
      );
      expect(mockSurveyGroupRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
