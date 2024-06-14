import { Entity, Column, BeforeInsert, AfterLoad } from 'typeorm';
import pluginManager from '../securityPlugin/pluginManager';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyDownload' })
export class SurveyDownload extends BaseEntity {
  @Column()
  pageId: string;

  @Column()
  surveyPath: string;

  @Column()
  title: string;

  @Column()
  filePath: string;

  @Column()
  onwer:string;

  @Column()
  filename:string;

  @Column()
  fileSize:string;

  @Column()
  fileType:string;


  // @Column()
  // ownerId: string;

  @Column()
  downloadTime: string;


  @BeforeInsert()
  async onDataInsert() {
    return await pluginManager.triggerHook('beforeResponseDataCreate', this);
  }

  @AfterLoad()
  async onDataLoaded() {
    return await pluginManager.triggerHook('afterResponseDataReaded', this);
  }
}
