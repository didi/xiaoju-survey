import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionService } from '../services/session.service';
import { Session } from 'src/models/session.entity';
import { ObjectId } from 'mongodb';
import { SESSION_STATUS } from 'src/enums/surveySessionStatus';

describe('SessionService', () => {
  let service: SessionService;
  let repository: MongoRepository<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
          useClass: MongoRepository,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    repository = module.get<MongoRepository<Session>>(
      getRepositoryToken(Session),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new session', async () => {
      const mockSession = {
        surveyId: 'survey123',
        userId: 'user123',
        status: SESSION_STATUS.DEACTIVATED,
      };

      const createdSession: any = { ...mockSession, _id: new ObjectId() };
      jest.spyOn(repository, 'create').mockReturnValue(createdSession);
      jest.spyOn(repository, 'save').mockResolvedValue(createdSession);

      const result = await service.create({
        surveyId: mockSession.surveyId,
        userId: mockSession.userId,
      });

      expect(result).toEqual(createdSession);
      expect(repository.create).toHaveBeenCalledWith(mockSession);
      expect(repository.save).toHaveBeenCalledWith(createdSession);
    });
  });

  describe('findOne', () => {
    it('should find a session by id', async () => {
      const sessionId = '65afc62904d5db18534c0f78';
      const foundSession = {
        _id: new ObjectId(sessionId),
        surveyId: 'survey123',
        userId: 'user123',
        status: SESSION_STATUS.ACTIVATED,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(foundSession as Session);

      const result = await service.findOne(sessionId);

      expect(result).toEqual(foundSession);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(sessionId) },
      });
    });
  });

  describe('findLatestEditingOne', () => {
    it('should find the latest editing session for a survey', async () => {
      const surveyId = 'survey123';
      const latestSession = {
        _id: new ObjectId(),
        surveyId: surveyId,
        userId: 'user123',
        status: SESSION_STATUS.ACTIVATED,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(latestSession as Session);

      const result = await service.findLatestEditingOne({ surveyId });

      expect(result).toEqual(latestSession);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          surveyId,
          status: SESSION_STATUS.ACTIVATED,
        },
      });
    });
  });

  describe('updateSessionToEditing', () => {
    it('should update a session to editing and deactivate other sessions', async () => {
      const sessionId = '65afc62904d5db18534c0f78';
      const surveyId = 'survey123';

      const updateResult: any = { affected: 1 };
      const updateManyResult = { modifiedCount: 1 };

      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
      jest.spyOn(repository, 'updateMany').mockResolvedValue(updateManyResult);

      const result = await service.updateSessionToEditing({
        sessionId,
        surveyId,
      });

      expect(result).toEqual([updateResult, updateManyResult]);
      expect(repository.update).toHaveBeenCalledWith(
        { _id: new ObjectId(sessionId) },
        {
          status: SESSION_STATUS.ACTIVATED,
          updatedAt: expect.any(Date),
        },
      );
      expect(repository.updateMany).toHaveBeenCalledWith(
        {
          surveyId,
          _id: { $ne: new ObjectId(sessionId) },
        },
        {
          $set: {
            status: SESSION_STATUS.DEACTIVATED,
            updatedAt: expect.any(Date),
          },
        },
      );
    });
  });
});
