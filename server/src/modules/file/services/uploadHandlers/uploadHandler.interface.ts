export interface FileUploadHandler {
  upload(
    file: Express.Multer.File,
    options?: { pathPrefix?: string },
  ): Promise<{ key: string }>;
  getUrl(key: string): string | Promise<string>;
}
