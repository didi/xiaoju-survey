import { Client } from 'minio';
import { generateUniqueFilename } from '../../utils/generateUniqueFilename';
import { join } from 'path';
import { parseExpiryTimeToSeconds } from '../../utils/parseExpiryTimeToSeconds';
import { FileUploadHandler } from './uploadHandler.interface';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

export class MinIOHandler implements FileUploadHandler {
  private client: Client;
  endPoint: string;
  useSSL: boolean;
  isPrivateRead: boolean;
  expiryTime: string;
  bucket: string;
  constructor({
    client,
    accessKey,
    secretKey,
    bucket,
    region,
    endPoint,
    useSSL,
    isPrivateRead,
    expiryTime,
  }: {
    client?: Client;
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    region?: string;
    endPoint?: string;
    useSSL?: boolean;
    isPrivateRead?: boolean;
    expiryTime?: string;
  }) {
    if (!client) {
      client = new Client({
        endPoint,
        accessKey,
        secretKey,
        region,
        useSSL,
        pathStyle: true,
      });
    }
    this.client = client;
    this.endPoint = endPoint;
    this.useSSL = useSSL;
    this.isPrivateRead = isPrivateRead;
    this.expiryTime = expiryTime;
    this.bucket = bucket;
  }

  async upload(
    file: Express.Multer.File,
    options?: {
      pathPrefix?: string;
    },
  ): Promise<{ key: string }> {
    const { pathPrefix } = options || {};
    const key = join(
      pathPrefix || '',
      await generateUniqueFilename(file.originalname),
    );

    try {
      await this.client.putObject(this.bucket, key, file.buffer);

      return { key };
    } catch (error) {
      throw new HttpException(
        error.message || error.stack || '上传失败',
        EXCEPTION_CODE.UPLOAD_FILE_ERROR,
      );
    }
  }

  async getUrl(key: string): Promise<string> {
    const expireTimeSeconds = parseExpiryTimeToSeconds(this.expiryTime);

    if (this.isPrivateRead) {
      const url = await this.client.presignedGetObject(
        this.bucket,
        key,
        expireTimeSeconds,
      );
      return url;
    }
    return `${this.useSSL ? 'https' : 'http'}://${this.endPoint}/${this.bucket}/${key}`;
  }
}
