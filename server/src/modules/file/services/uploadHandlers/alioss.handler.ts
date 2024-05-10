import OSS from 'ali-oss';
import { generateUniqueFilename } from '../../utils/generateUniqueFilename';
import { join } from 'path';
import { parseExpiryTimeToSeconds } from '../../utils/parseExpiryTimeToSeconds';
import { FileUploadHandler } from './uploadHandler.interface';

export class AliOssHandler implements FileUploadHandler {
  private client: OSS;
  endPoint: string;
  useSSL: boolean;
  isPrivateRead: boolean;
  expiryTime: string;
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
    client?: OSS;
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
      client = new OSS({
        region,
        accessKeyId: accessKey,
        accessKeySecret: secretKey,
        bucket,
      });
    }
    this.client = client;
    this.endPoint = endPoint;
    this.useSSL = useSSL;
    this.isPrivateRead = isPrivateRead;
    this.expiryTime = expiryTime;
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

    await this.client.put(key, file.buffer);

    return { key };
  }

  getUrl(key: string): string {
    const expireTimeSeconds = parseExpiryTimeToSeconds(this.expiryTime);
    if (this.isPrivateRead) {
      const url = this.client.signatureUrl(key, {
        expires: expireTimeSeconds,
        method: 'GET',
      });
      return url;
    } else {
      return `${this.useSSL ? 'https' : 'http'}://${this.endPoint}/${key}`;
    }
  }
}
