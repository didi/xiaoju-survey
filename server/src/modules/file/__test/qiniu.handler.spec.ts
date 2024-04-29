// In your test file
import { QiniuHandler } from '../services/uploadHandlers/qiniu.handler';
import qiniu from 'qiniu';

jest.mock('qiniu', () => ({
  auth: {
    digest: {
      Mac: jest.fn(),
    },
  },
  conf: {
    Config: jest.fn(),
    Zone: jest.fn(),
  },
  form_up: {
    FormUploader: jest.fn().mockImplementation(() => {
      return {
        put: jest
          .fn()
          .mockImplementation(
            (uploadToken, key, buffer, putExtra, callback) => {
              callback && callback(null, null, { statusCode: 200 });
            },
          ),
      };
    }),
    PutExtra: jest.fn(),
  },
  rs: {
    PutPolicy: jest.fn().mockImplementation(() => {
      return {
        uploadToken: jest.fn(),
      };
    }),
    BucketManager: jest.fn().mockImplementation(() => {
      return {
        privateDownloadUrl: jest.fn().mockReturnValue(''),
        publicDownloadUrl: jest.fn().mockReturnValue(''),
      };
    }),
  },
}));

describe('QiniuHandler', () => {
  describe('upload', () => {
    it('should upload a file and return the key', async () => {
      const file = {
        originalname: 'mockFileName.txt',
        buffer: Buffer.from('mockFileContent'),
      } as Express.Multer.File;

      const mockMacInstance = {
        sign: jest.fn(),
      };
      jest
        .spyOn(qiniu.auth.digest, 'Mac')
        .mockImplementation(() => mockMacInstance as any);

      // Create a new instance of QiniuHandler
      const handler = new QiniuHandler({
        accessKey: 'mockAccessKey',
        secretKey: 'mockSecretKey',
        bucket: 'mockBucket',
        endPoint: 'mockEndPoint',
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      const result = await handler.upload(file);

      expect(result).toEqual({
        key: expect.stringMatching('.txt'),
      });

      expect(qiniu.auth.digest.Mac).toHaveBeenCalledWith(
        'mockAccessKey',
        'mockSecretKey',
      );

      expect(qiniu.form_up.FormUploader).toHaveBeenCalled();
    });
  });

  describe('getUrl', () => {
    it('should return the URL for the given key', async () => {
      const key = 'mockFilePath/mockFileName.txt';
      const handler = new QiniuHandler({
        accessKey: 'mockAccessKey',
        secretKey: 'mockSecretKey',
        bucket: 'xiaojusurvey',
        endPoint: 'mockEndPoint',
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      const result = await handler.getUrl(key);
      expect(typeof result).toBe('string');
    });
  });
});
