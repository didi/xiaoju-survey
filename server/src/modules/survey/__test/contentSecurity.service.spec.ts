import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { Word } from 'src/models/word.entity';

describe('ContentSecurityService', () => {
  let service: ContentSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentSecurityService,
        {
          provide: getRepositoryToken(Word),
          useValue: {
            find: jest.fn().mockResolvedValue([
              {
                text: '违禁词1',
              },
              {
                text: '违禁词2',
              },
            ]),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContentSecurityService>(ContentSecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isForbiddenContent', () => {
    it('should return true if text contains forbidden word', async () => {
      const result = await service.isForbiddenContent({
        text: '这是违禁词1',
      });

      expect(result).toBe(true);
    });

    it('should return false if text does not contain forbidden word', async () => {
      const result = await service.isForbiddenContent({
        text: '这句话不包含违禁词',
      });

      expect(result).toBe(false);
    });
  });
});
