import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorService } from '../services/collaborator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Collaborator } from 'src/models/collaborator.entity';
import { MongoRepository } from 'typeorm';
import { Logger } from 'src/logger';
import { InsertManyResult, ObjectId } from 'mongodb';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

describe('CollaboratorService', () => {
  let service: CollaboratorService;
  let repository: MongoRepository<Collaborator>;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorService,
        {
          provide: getRepositoryToken(Collaborator),
          useClass: MongoRepository,
        },
        {
          provide: Logger,
          useValue: {
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CollaboratorService>(CollaboratorService);
    repository = module.get<MongoRepository<Collaborator>>(
      getRepositoryToken(Collaborator),
    );
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should create and save a collaborator', async () => {
      const createSpy = jest.spyOn(repository, 'create').mockReturnValue({
        surveyId: '1',
        userId: '1',
        permissions: [],
      } as Collaborator);
      const collaboratorId = new ObjectId().toString();
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({
        _id: new ObjectId(collaboratorId),
        surveyId: '1',
        userId: '1',
        permissions: [],
      } as Collaborator);

      const result = await service.create({
        surveyId: '1',
        userId: '1',
        permissions: [],
      });

      expect(createSpy).toHaveBeenCalledWith({
        surveyId: '1',
        userId: '1',
        permissions: [],
      });
      expect(saveSpy).toHaveBeenCalledWith({
        surveyId: '1',
        userId: '1',
        permissions: [],
      });
      expect(result).toEqual({
        _id: new ObjectId(collaboratorId),
        surveyId: '1',
        userId: '1',
        permissions: [],
      });
    });
  });

  describe('deleteCollaborator', () => {
    it('should delete a collaborator by userId and surveyId', async () => {
      const deleteOneSpy = jest
        .spyOn(repository, 'deleteOne')
        .mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const result = await service.deleteCollaborator({
        userId: '1',
        surveyId: '1',
      });

      expect(deleteOneSpy).toHaveBeenCalledWith({
        userId: '1',
        surveyId: '1',
      });
      expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });
  });

  describe('batchCreate', () => {
    it('should batch create collaborators', async () => {
      const insertManySpy = jest
        .spyOn(repository, 'insertMany')
        .mockResolvedValue({
          insertedCount: 1,
        } as unknown as InsertManyResult<Document>);

      const result = await service.batchCreate({
        surveyId: '1',
        collaboratorList: [{ userId: '1', permissions: [] }],
        creator: 'testCreator',
        creatorId: 'testCreatorId',
      });

      expect(insertManySpy).toHaveBeenCalledWith([
        {
          userId: '1',
          permissions: [],
          surveyId: '1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          creator: 'testCreator',
          creatorId: 'testCreatorId',
        },
      ]);
      expect(result).toEqual({ insertedCount: 1 });
    });
  });

  describe('changeUserPermission', () => {
    it("should update a user's permissions", async () => {
      const updateOneSpy = jest
        .spyOn(repository, 'updateOne')
        .mockResolvedValue({});

      const result = await service.changeUserPermission({
        userId: '1',
        surveyId: '1',
        permission: 'read',
        operator: 'testOperator',
        operatorId: 'testOperatorId',
      });

      expect(updateOneSpy).toHaveBeenCalledWith(
        {
          surveyId: '1',
          userId: '1',
        },
        {
          $set: {
            permission: 'read',
            operator: 'testOperator',
            operatorId: 'testOperatorId',
            updatedAt: expect.any(Date),
          },
        },
      );
      expect(result).toEqual({});
    });
  });

  describe('batchDelete', () => {
    it('should batch delete collaborators', async () => {
      const mockResult = { acknowledged: true, deletedCount: 1 };
      const deleteManySpy = jest
        .spyOn(repository, 'deleteMany')
        .mockResolvedValue(mockResult);

      const collaboratorId = new ObjectId().toString();

      const result = await service.batchDelete({
        surveyId: '1',
        idList: [collaboratorId],
      });

      const expectedQuery = {
        surveyId: '1',
        $or: [
          {
            _id: {
              $in: [new ObjectId(collaboratorId)],
            },
          },
        ],
      };

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify(expectedQuery));
      expect(deleteManySpy).toHaveBeenCalledWith(expectedQuery);
      expect(result).toEqual(mockResult);
    });
    it('should batch delete collaborators by idList and userIdList', async () => {
      const collaboratorId = new ObjectId().toString();
      const deleteManySpy = jest
        .spyOn(repository, 'deleteMany')
        .mockResolvedValue({ acknowledged: true, deletedCount: 2 });

      const result = await service.batchDelete({
        idList: [collaboratorId],
        userIdList: ['user1', 'user2'],
        surveyId: '1',
      });

      const expectedQuery = {
        surveyId: '1',
        $or: [
          {
            userId: {
              $in: ['user1', 'user2'],
            },
          },
          {
            _id: {
              $in: [new ObjectId(collaboratorId)],
            },
          },
        ],
      };

      expect(deleteManySpy).toHaveBeenCalledWith(expectedQuery);
      expect(result).toEqual({ acknowledged: true, deletedCount: 2 });
    });

    it('should handle batch delete with neIdList only', async () => {
      const neCollaboratorId = new ObjectId().toString();
      const deleteManySpy = jest
        .spyOn(repository, 'deleteMany')
        .mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const result = await service.batchDelete({
        neIdList: [neCollaboratorId],
        surveyId: '1',
      });

      const expectedQuery = {
        surveyId: '1',
        $or: [
          {
            _id: {
              $nin: [new ObjectId(neCollaboratorId)],
            },
          },
        ],
      };

      expect(deleteManySpy).toHaveBeenCalledWith(expectedQuery);
      expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });
  });

  describe('batchDeleteBySurveyId', () => {
    it('should batch delete collaborators by survey id', async () => {
      const mockResult = { acknowledged: true, deletedCount: 1 };
      const deleteManySpy = jest
        .spyOn(repository, 'deleteMany')
        .mockResolvedValue(mockResult);

      const surveyId = new ObjectId().toString();

      const result = await service.batchDeleteBySurveyId(surveyId);

      expect(deleteManySpy).toHaveBeenCalledWith({
        surveyId,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateById', () => {
    it('should update collaborator by id', async () => {
      const updateOneSpy = jest
        .spyOn(repository, 'updateOne')
        .mockResolvedValue({});
      const collaboratorId = new ObjectId().toString();
      const result = await service.updateById({
        collaboratorId,
        permissions: [],
        operator: 'testOperator',
        operatorId: 'testOperatorId',
      });

      expect(updateOneSpy).toHaveBeenCalledWith(
        {
          _id: new ObjectId(collaboratorId),
        },
        {
          $set: {
            permissions: [],
            operator: 'testOperator',
            operatorId: 'testOperatorId',
            updatedAt: expect.any(Date),
          },
        },
      );
      expect(result).toEqual({});
    });
  });

  describe('getSurveyCollaboratorList', () => {
    it('should return a list of collaborators for a survey', async () => {
      const collaboratorId = new ObjectId().toString();
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([
        {
          _id: new ObjectId(collaboratorId),
          surveyId: '1',
          userId: '1',
          permissions: [],
        },
      ] as Collaborator[]);

      const result = await service.getSurveyCollaboratorList({ surveyId: '1' });

      expect(findSpy).toHaveBeenCalledWith({ surveyId: '1' });
      expect(result).toEqual([
        {
          _id: new ObjectId(collaboratorId),
          surveyId: '1',
          userId: '1',
          permissions: [],
        },
      ]);
    });
  });

  describe('getCollaborator', () => {
    it('should return a collaborator', async () => {
      const collaboratorId = new ObjectId().toString();
      const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue({
        _id: new ObjectId(collaboratorId),
        surveyId: '1',
        userId: '1',
        permissions: [],
      } as Collaborator);

      const result = await service.getCollaborator({
        userId: '1',
        surveyId: '1',
      });

      expect(findOneSpy).toHaveBeenCalledWith({
        where: {
          surveyId: '1',
          userId: '1',
        },
      });
      expect(result).toEqual({
        _id: new ObjectId(collaboratorId),
        surveyId: '1',
        userId: '1',
        permissions: [],
      });
    });
  });

  describe('getCollaboratorListByUserId', () => {
    it('should return a list of collaborators by user id', async () => {
      const userId = new ObjectId().toString();
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([
        {
          _id: '1',
          surveyId: '1',
          userId: userId,
          permissions: [],
        } as unknown as Collaborator,
      ]);

      const result = await service.getCollaboratorListByUserId({ userId });

      expect(findSpy).toHaveBeenCalledWith({
        where: {
          userId,
        },
      });
      expect(result).toEqual([
        { _id: '1', surveyId: '1', userId, permissions: [] },
      ]);
    });

    describe('getManageListByUserId', () => {
      it('should return a list of collaborators who has manage permission by user id', async () => {
        const userId = new ObjectId().toString();
        
        const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([
          {
            _id: '1',
            surveyId: '1',
            userId,
            permissions: [SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE],
          } as unknown as Collaborator,
        ]);

        const result = await service.getManageListByUserId({ userId });

        expect(findSpy).toHaveBeenCalledWith({
          where: {
            userId,
            permissions: {
              $elemMatch: {
                $eq: SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
              },
            },
          },
        });
        expect(result).toEqual([
          { _id: '1', surveyId: '1', userId, permissions: [SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE] },
        ]);
      });
    });

    it('should return a list of collaborators by their IDs', async () => {
      const collaboratorId1 = new ObjectId().toString();
      const collaboratorId2 = new ObjectId().toString();
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([
        {
          _id: new ObjectId(collaboratorId1),
          surveyId: '1',
          userId: 'user1',
          permissions: [],
        },
        {
          _id: new ObjectId(collaboratorId2),
          surveyId: '2',
          userId: 'user2',
          permissions: [],
        },
      ] as Collaborator[]);

      const result = await service.getCollaboratorListByIds({
        idList: [collaboratorId1, collaboratorId2],
      });

      expect(findSpy).toHaveBeenCalledWith({
        _id: {
          $in: [new ObjectId(collaboratorId1), new ObjectId(collaboratorId2)],
        },
      });
      expect(result).toEqual([
        {
          _id: new ObjectId(collaboratorId1),
          surveyId: '1',
          userId: 'user1',
          permissions: [],
        },
        {
          _id: new ObjectId(collaboratorId2),
          surveyId: '2',
          userId: 'user2',
          permissions: [],
        },
      ]);
    });
  });
});
