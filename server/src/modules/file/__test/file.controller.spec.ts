import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FileController } from '../controllers/file.controller';
import { FileService } from '../services/file.service';
import { uploadConfig, channels } from '../config/index';

import { AuthenticationException } from 'src/exceptions/authException';
import { HttpException } from 'src/exceptions/httpException';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { User } from 'src/models/user.entity';

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;
  let authService: AuthService;
  // let configService: ConfigService;

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
      controllers: [FileController],
      providers: [
        FileService,
        {
          provide: AuthService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
    authService = module.get<AuthService>(AuthService);
    // configService = module.get<ConfigService>(ConfigService);
  });

  describe('upload', () => {
    it('should upload a file', async () => {
      const file: Express.Multer.File = {
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: null,
        destination: '',
        filename: '',
        path: '',
        buffer: null,
      };
      const req = { headers: { authorization: 'Bearer mockToken' } };
      const reqBody = { channel: 'upload' };

      jest.spyOn(authService, 'verifyToken').mockResolvedValueOnce({} as User);

      const mockUploadResult = { key: 'mockKey', url: 'mockUrl' };
      jest.spyOn(fileService, 'upload').mockResolvedValueOnce(mockUploadResult);

      const result = await controller.upload(file, req, reqBody);

      expect(result).toEqual({
        code: 200,
        data: {
          url: mockUploadResult.url,
          key: mockUploadResult.key,
        },
      });
    });

    it('should upload failed without token', async () => {
      const file: Express.Multer.File = {
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: null,
        destination: '',
        filename: '',
        path: '',
        buffer: null,
      };
      const req = { headers: { authorization: '' } };
      const reqBody = { channel: 'upload' };

      await expect(controller.upload(file, req, reqBody)).rejects.toThrow(
        AuthenticationException,
      );
    });

    it('should upload failed', async () => {
      const file: Express.Multer.File = {
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: null,
        destination: '',
        filename: '',
        path: '',
        buffer: null,
      };
      const req = { headers: { authorization: 'Bearer mockToken' } };
      const reqBody = { channel: 'mockChannel' };

      await expect(controller.upload(file, req, reqBody)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('generateGetUrl', () => {
    it('should generate a URL for the given channel and key', async () => {
      const reqBody = { channel: 'upload', key: 'mockKey' };

      const mockUrl = 'mockGeneratedUrl';
      jest.spyOn(fileService, 'getUrl').mockReturnValueOnce(mockUrl);

      const result = await controller.generateGetUrl(reqBody);

      expect(result).toEqual({
        code: 200,
        data: {
          key: reqBody.key,
          url: mockUrl,
        },
      });
    });

    it('should generate a URL failed', async () => {
      const reqBody = { channel: 'mockChannel', key: 'mockKey' };

      await expect(controller.generateGetUrl(reqBody)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
