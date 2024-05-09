import { AliOssHandler } from '../services/uploadHandlers/alioss.handler';

describe('AliOssHandler', () => {
  describe('upload', () => {
    it('should upload a file and return the key', async () => {
      const file = {
        originalname: 'mockFileName.txt',
        buffer: Buffer.from('mockFileContent'),
      } as Express.Multer.File;
      const mockPutResult = { name: 'mockFileName.txt' };
      const mockClient: any = {
        put: jest.fn().mockResolvedValue(mockPutResult),
      };
      const handler = new AliOssHandler({
        client: mockClient,
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      const result = await handler.upload(file);

      expect(result).toEqual({
        key: expect.stringMatching(/\w+\.txt/),
      });
    });
  });

  describe('getUrl', () => {
    it('should return the URL for the given key', () => {
      const key = 'mockFilePath/mockFileName.txt';
      const bucket = 'xiaojusurvey';
      const accessKey = 'mockAccessKey';
      const region = 'mockRegion';
      const handler = new AliOssHandler({
        accessKey,
        secretKey: 'mockSecretKey',
        bucket,
        region,
        endPoint: 'mockEndPoint',
        useSSL: true,
        isPrivateRead: true,
        expiryTime: '1h',
      });

      const result = handler.getUrl(key);
      const keyReg = new RegExp(key);
      const signatureReg = new RegExp('Signature=');
      const expiredReg = new RegExp('Expires=');
      expect(keyReg.test(result)).toBe(true);
      expect(signatureReg.test(result)).toBe(true);
      expect(expiredReg.test(result)).toBe(true);
    });
  });
});
