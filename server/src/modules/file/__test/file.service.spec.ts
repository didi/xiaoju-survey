import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FileService } from '../services/file.service';
import { LocalHandler } from '../services/uploadHandlers/local.handler';
import { uploadConfig, channels } from '../config/index';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(() => {
          return {
            ...channels,
            ...uploadConfig,
          };
        }),
      ],
      providers: [FileService, ConfigService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  describe('upload', () => {
    it('should upload a file and return key and URL', async () => {
      const configKey = 'mockConfigKey';
      const file = {} as Express.Multer.File;
      const pathPrefix = 'mockPathPrefix';

      const mockKey = 'mockKey';
      jest
        .spyOn(LocalHandler.prototype, 'upload')
        .mockResolvedValueOnce({ key: mockKey });

      const mockUrl = 'mockUrl';
      jest
        .spyOn(LocalHandler.prototype, 'getUrl')
        .mockResolvedValueOnce(mockUrl as never);

      const result = await fileService.upload({ configKey, file, pathPrefix });

      expect(result).toEqual({
        key: mockKey,
        url: mockUrl,
      });
    });
  });

  describe('getUrl', () => {
    it('should return URL for the given configKey and key', async () => {
      const configKey = 'mockConfigKey';
      const key = 'mockKey';

      const mockUrl = 'mockUrl';
      jest.spyOn(LocalHandler.prototype, 'getUrl').mockReturnValueOnce(mockUrl);

      const result = fileService.getUrl({ configKey, key });

      expect(result).toEqual(mockUrl);
    });
  });
});
