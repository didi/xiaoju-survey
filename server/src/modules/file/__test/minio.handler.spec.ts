import { Client } from 'minio';

import { MinIOHandler } from '../services/uploadHandlers/minio.handler';

import { HttpException } from 'src/exceptions/httpException';

describe('MinIOHandler', () => {
  describe('upload', () => {
    it('should upload a file and return the key', async () => {
      const file = {
        originalname: 'mockFileName.txt',
        buffer: Buffer.from('mockFileContent'),
      } as Express.Multer.File;
      const mockPutObjectFn = jest.fn().mockResolvedValueOnce({});
      const mockClient = {
        putObject: mockPutObjectFn,
      };
      const handler = new MinIOHandler({
        client: mockClient as unknown as Client,
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      const result = await handler.upload(file);
      expect(result).toEqual({
        key: expect.stringMatching('.txt'),
      });
      expect(mockPutObjectFn).toHaveBeenCalledTimes(1);
    });

    it('should throw an HttpException if upload fails', async () => {
      const file = {
        originalname: 'mockFileName.txt',
        buffer: Buffer.from('mockFileContent'),
      } as Express.Multer.File;
      const mockPutObjectFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Upload failed'));
      const mockClient = {
        putObject: mockPutObjectFn,
      };
      const handler = new MinIOHandler({
        client: mockClient as unknown as Client,
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      await expect(handler.upload(file)).rejects.toThrow(HttpException);
    });
  });

  describe('getUrl', () => {
    it('should return the URL for the given key', async () => {
      const key = 'mockFilePath/mockFileName.txt';
      const handler = new MinIOHandler({
        accessKey: 'mockAccessKey',
        secretKey: 'mockSecretKey',
        bucket: 'xiaojusurvey',
        region: 'mockRegion',
        endPoint: 'mockEndPoint',
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      const result = await handler.getUrl(key);
      const keyReg = new RegExp(key);
      const signatureReg = new RegExp('X-Amz-Signature=');
      expect(keyReg.test(result)).toBe(true);
      expect(signatureReg.test(result)).toBe(true);
    });
  });
});
