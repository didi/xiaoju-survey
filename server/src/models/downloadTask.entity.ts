import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'downloadTask' })
export class DownloadTask extends BaseEntity {
  @Column()
  surveyId: string;

  @Column()
  surveyPath: string;

  // 文件路径
  @Column()
  url: string;

  // 文件key
  @Column()
  fileKey: string;

  // 任务创建人
  @Column()
  creatorId: string;

  // 任务创建人
  @Column()
  creator: string;

  // 文件名
  @Column()
  filename: string;

  // 文件大小
  @Column()
  fileSize: string;

  @Column()
  params: string;
}
