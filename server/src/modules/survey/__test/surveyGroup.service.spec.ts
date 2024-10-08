import { Test, TestingModule } from '@nestjs/testing';
import { SurveyGroupService } from '../services/surveyGroup.service'; // Change path accordingly
import { SurveyGroup } from 'src/models/surveyGroup.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { getMongoRepository } from 'typeorm';
import { MongoRepository } from 'typeorm';

describe('SurveyGroupService', () => {
  let service: SurveyGroupService;
  let surveyGroupRepository: MongoRepository<SurveyGroup>;
  let surveyMetaRepository: MongoRepository<SurveyMeta>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyGroupService,
        {
          provide: getMongoRepository(SurveyGroup),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getMongoRepository(SurveyMeta),
          useValue: {
            updateMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyGroupService>(SurveyGroupService);
    surveyGroupRepository = module.get(getMongoRepository(SurveyGroup));
    surveyMetaRepository = module.get(getMongoRepository(SurveyMeta));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new survey group', async () => {
      const params = { name: 'Test Group', ownerId: 'ownerId123' };
      const newGroup = { ...params, _id: 'newId' };

      jest.spyOn(surveyGroupRepository, 'create').mockReturnValue(newGroup);
      jest.spyOn(surveyGroupRepository, 'save').mockResolvedValue(newGroup);

      const result = await service.create(params);
      expect(result).toEqual(newGroup);
      expect(surveyGroupRepository.create).toHaveBeenCalledWith(params);
      expect(surveyGroupRepository.save).toHaveBeenCalledWith(newGroup);
    });
  });

  describe('findAll', () => {
    it('should return a list of survey groups', async () => {
      const userId = 'ownerId123';
      const name = 'Test';
      const skip = 0;
      const pageSize = 10;

      const foundGroups = [
        { name: 'Test Group 1', ownerId: userId, createdAt: new Date() },
        { name: 'Test Group 2', ownerId: userId, createdAt: new Date() },
      ];
      const total = foundGroups.length;

      jest
        .spyOn(surveyGroupRepository, 'findAndCount')
        .mockResolvedValue([foundGroups, total]);
      jest
        .spyOn(surveyGroupRepository, 'find')
        .mockResolvedValue(
          foundGroups.map(({ name }) => ({ _id: 'id', name })),
        );

      const result = await service.findAll(userId, name, skip, pageSize);
      expect(result).toEqual({
        total,
        list: foundGroups,
        allList: foundGroups,
      });
      expect(surveyGroupRepository.findAndCount).toHaveBeenCalled();
      expect(surveyGroupRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a survey group', async () => {
      const id = 'groupId123';
      const updatedFields = { name: 'Updated Group' };

      await service.update(id, updatedFields);
      expect(surveyGroupRepository.update).toHaveBeenCalledWith(id, {
        ...updatedFields,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should remove a survey group', async () => {
      const id = 'groupId123';
      const query = { groupId: id };
      const update = { $set: { groupId: null } };

      jest.spyOn(surveyMetaRepository, 'updateMany').mockResolvedValue({});
      jest
        .spyOn(surveyGroupRepository, 'delete')
        .mockResolvedValue({ affected: 1 });

      const result = await service.remove(id);
      expect(surveyMetaRepository.updateMany).toHaveBeenCalledWith(
        query,
        update,
      );
      expect(surveyGroupRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
