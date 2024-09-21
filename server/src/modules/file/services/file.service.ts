import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LocalHandler } from './uploadHandlers/local.handler';
// import { QiniuHandler } from './uploadHandlers/qiniu.handler';
// import { AliOssHandler } from './uploadHandlers/alioss.handler';
// import { MinIOHandler } from './uploadHandlers/minio.handler';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async upload({
    configKey,
    file,
    pathPrefix,
    filename,
  }: {
    configKey: string;
    file: Express.Multer.File;
    pathPrefix: string;
    filename?: string;
  }) {
    const handler = this.getHandler(configKey);
    const { key } = await handler.upload(file, {
      pathPrefix,
      filename,
    });
    const url = await handler.getUrl(key);
    return {
      key,
      url,
    };
  }

  getUrl({ configKey, key }) {
    const handler = this.getHandler(configKey);
    return handler.getUrl(key);
  }

  private getHandler(configKey: string) {
    const staticType = this.configService.get<string>(
      `${configKey}.LOCAL_STATIC_RENDER_TYPE`,
    );
    let physicalRootPath;
    if (staticType === 'nginx') {
      physicalRootPath = this.configService.get<string>(
        `${configKey}.NGINX_STATIC_PATH`,
      );
    }
    if (!physicalRootPath) {
      physicalRootPath = 'public';
    }
    return new LocalHandler({ physicalRootPath });

    // qiniu
    // return new QiniuHandler({
    //   accessKey: this.configService.get<string>(`${configKey}.ACCESS_KEY`),
    //   secretKey: this.configService.get<string>(`${configKey}.SECRET_KEY`),
    //   bucket: this.configService.get<string>(`${configKey}.BUCKET`),
    //   endPoint: this.configService.get<string>(`${configKey}.ENDPOINT`),
    //   useSSL: this.configService.get<boolean>(`${configKey}.USE_SSL`),
    //   isPrivateRead: this.configService.get<boolean>(
    //     `${configKey}.IS_PRIVATE_READ`,
    //   ),
    //   expiryTime: this.configService.get<string>(
    //     `${configKey}.LINK_EXPIRY_TIME`,
    //   ),
    // });

    // ali-oss
    // return new AliOssHandler({
    //   accessKey: this.configService.get<string>(`${configKey}.ACCESS_KEY`),
    //   secretKey: this.configService.get<string>(`${configKey}.SECRET_KEY`),
    //   bucket: this.configService.get<string>(`${configKey}.BUCKET`),
    //   endPoint: this.configService.get<string>(`${configKey}.ENDPOINT`),
    //   useSSL: this.configService.get<boolean>(`${configKey}.USE_SSL`),
    //   isPrivateRead: this.configService.get<boolean>(
    //     `${configKey}.IS_PRIVATE_READ`,
    //   ),
    //   expiryTime: this.configService.get<string>(
    //     `${configKey}.LINK_EXPIRY_TIME`,
    //   ),
    //   region: this.configService.get<string>(`${configKey}.REGION`),
    // });

    // minio
    // return new MinIOHandler({
    //   accessKey: this.configService.get<string>(`${configKey}.ACCESS_KEY`),
    //   secretKey: this.configService.get<string>(`${configKey}.SECRET_KEY`),
    //   bucket: this.configService.get<string>(`${configKey}.BUCKET`),
    //   endPoint: this.configService.get<string>(`${configKey}.ENDPOINT`),
    //   useSSL: this.configService.get<boolean>(`${configKey}.USE_SSL`),
    //   isPrivateRead: this.configService.get<boolean>(
    //     `${configKey}.IS_PRIVATE_READ`,
    //   ),
    //   expiryTime: this.configService.get<string>(
    //     `${configKey}.LINK_EXPIRY_TIME`,
    //   ),
    //   region: this.configService.get<string>(`${configKey}.REGION`),
    // });
  }
}
