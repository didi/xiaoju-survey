import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WhitelistService } from '../services/whitelist.service';
import { WhitelistVerify } from 'src/models/whitelistVerify.entity';

describe('WhitelistService', () => {
  let service: WhitelistService;
  let whitelistRepository: MongoRepository<WhitelistVerify>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhitelistService,
        {
          provide: getRepositoryToken(WhitelistVerify),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WhitelistService>(WhitelistService);
    whitelistRepository = module.get<MongoRepository<WhitelistVerify>>(
      getRepositoryToken(WhitelistVerify),
    );
  });

  describe('create a verifyId', () => {
    it('should create a verifyId successfully', async () => {
      const surveyPath = 'GiWfCGPb';
      jest.spyOn(whitelistRepository, 'create').mockImplementation((data) => {
        return {
          ...data,
        } as WhitelistVerify;
      });
      jest.spyOn(whitelistRepository, 'save').mockImplementation((data) => {
        return Promise.resolve({
          _id: new ObjectId(),
          ...data,
        } as WhitelistVerify);
      });

      const result = await service.create(surveyPath);

      expect(result.surveyPath).toBe(surveyPath);
      expect(whitelistRepository.create).toHaveBeenCalledWith({
        surveyPath,
      });
    });
  });

  describe('check if verifyId is correct ', () => {
    it('should check if verifyId is correct successfully', async () => {
      const mockId = new ObjectId();
      const mockWhitelist = new WhitelistVerify();
      const surveyPath = 'GiWfCGPb';
      mockWhitelist._id = mockId;
      mockWhitelist.surveyPath = surveyPath;
      jest
        .spyOn(whitelistRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockWhitelist));

      const result = await service.match(surveyPath, mockId.toString());

      expect(result).not.toBeNull();
      expect(whitelistRepository.findOne).toHaveBeenCalledWith({
        where: { _id: mockId, surveyPath },
      });
    });
  });
});
