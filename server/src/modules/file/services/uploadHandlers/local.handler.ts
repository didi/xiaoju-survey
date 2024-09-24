import { join, dirname, sep } from 'path';
import fse from 'fs-extra';
import { createWriteStream } from 'fs';
import { FileUploadHandler } from './uploadHandler.interface';
import { generateUniqueFilename } from '../../utils/generateUniqueFilename';

export class LocalHandler implements FileUploadHandler {
  private physicalRootPath: string;
  constructor({ physicalRootPath }: { physicalRootPath: string }) {
    this.physicalRootPath = physicalRootPath;
  }

  async upload(
    file: Express.Multer.File,
    options?: { pathPrefix?: string; filename?: string },
  ): Promise<{ key: string }> {
    let filename;
    if (options?.filename) {
      filename = file.filename;
    } else {
      filename = await generateUniqueFilename(file.originalname);
    }
    const filePath = join(
      options?.pathPrefix ? options?.pathPrefix : '',
      filename,
    )
      .split(sep)
      .join('/');
    const physicalPath = join(this.physicalRootPath, filePath);
    await fse.mkdir(dirname(physicalPath), { recursive: true });
    const writeStream = createWriteStream(physicalPath);
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () =>
        resolve({
          key: filePath,
        }),
      );
      writeStream.on('error', reject);
      writeStream.write(file.buffer);
      writeStream.end();
    });
  }

  getUrl(key: string): string {
    if (process.env.SERVER_ENV === 'local') {
      const port = process.env.PORT || 3000;
      return `http://localhost:${port}/${key}`;
    }
    return `/${key}`;
  }
}
