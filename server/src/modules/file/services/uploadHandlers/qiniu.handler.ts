import qiniu from 'qiniu';
import { join } from 'path';
import { generateUniqueFilename } from '../../utils/generateUniqueFilename';
import { parseExpiryTimeToSeconds } from '../../utils/parseExpiryTimeToSeconds';
import { FileUploadHandler } from './uploadHandler.interface';

export class QiniuHandler implements FileUploadHandler {
  private bucket: string;
  private endPoint: string;
  private useSSL: boolean;
  private isPrivateRead: boolean;
  private expiryTime: string;
  private mac: qiniu.auth.digest.Mac;

  constructor({
    accessKey,
    secretKey,
    bucket,
    endPoint,
    useSSL,
    isPrivateRead,
    expiryTime,
  }) {
    this.bucket = bucket;
    this.endPoint = endPoint;
    this.useSSL = useSSL;
    this.isPrivateRead = isPrivateRead;
    this.expiryTime = expiryTime;

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    this.mac = mac;
  }

  async upload(
    file: Express.Multer.File,
    options?: { pathPrefix?: string },
  ): Promise<{ key: string }> {
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = join(
      options?.pathPrefix ? options?.pathPrefix : '',
      await generateUniqueFilename(file.originalname),
    );

    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.bucket + ':' + key,
    });

    const uploadToken = putPolicy.uploadToken(this.mac);

    return new Promise<{ key: string }>((resolve, reject) => {
      formUploader.put(
        uploadToken,
        key,
        file.buffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
          }
          if (respInfo.statusCode === 200) {
            resolve({ key });
          } else {
            reject(respBody);
          }
        },
      );
    });
  }

  getUrl(key: string): string {
    const config = new qiniu.conf.Config({
      useHttpsDomain: this.useSSL,
    });
    const bucketManager = new qiniu.rs.BucketManager(this.mac, config);
    let url;
    if (this.isPrivateRead) {
      const deadline =
        Math.floor(Date.now() / 1000) +
        parseExpiryTimeToSeconds(this.expiryTime);
      url = bucketManager.privateDownloadUrl(this.endPoint, key, deadline);
    } else {
      url = bucketManager.publicDownloadUrl(this.endPoint, key);
    }

    return this.useSSL ? `https://${url}` : `http://${url}`;
  }
}
