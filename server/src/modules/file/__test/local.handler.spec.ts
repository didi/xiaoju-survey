import { join } from 'path';
import { LocalHandler } from '../services/uploadHandlers/local.handler';

describe('LocalHandler', () => {
  describe('upload', () => {
    it('should upload a file and return the key', async () => {
      const file = {
        originalname: `mockFileName.txt`,
        buffer: Buffer.from('mockFileContent'),
      } as Express.Multer.File;
      const physicalRootPath = join(__dirname, 'tmp');
      const handler = new LocalHandler({ physicalRootPath });

      const result = await handler.upload(file);
      expect(result).toEqual({
        key: expect.stringMatching(/\w+\.txt/),
      });
    });
  });

  describe('getUrl', () => {
    it('should return the URL for the given key', () => {
      const key = 'mockFilePath/mockFileName.txt';
      const physicalRootPath = join(__dirname, 'tmp');
      const handler = new LocalHandler({ physicalRootPath });

      const result = handler.getUrl(key);

      expect(result).toBe(`/${key}`);
    });
  });
});
