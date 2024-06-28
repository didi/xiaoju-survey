import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'whitelistVerify' })
export class WhitelistVerify extends BaseEntity {
  @Column()
  surveyPath: string;
}
