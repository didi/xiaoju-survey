import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { ResponseSchema } from 'src/models/ResponseSchema.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';

@Injectable()
export class UpgradeService {
  constructor(
    @InjectRepository(SurveyMeta)
    private readonly SurveyMeta: MongoRepository<SurveyMeta>,
    @InjectRepository(ResponseSchema)
    private readonly ResponseSchema: MongoRepository<ResponseSchema>,
  ) {}

  async upgradeSubStatus() {
    const surveyMetaList = await this.SurveyMeta.find();
    const responseSchemaList = await this.ResponseSchema.find();

    const callBack = (v: SurveyMeta | ResponseSchema) => {
      // 将主状态的REMOVED，EDITING刷到子状态
      //  主状态查一下历史数据删除前最近的状态是“新建”or“已发布
      if (
        v.curStatus.status == (RECORD_SUB_STATUS.REMOVED as any) ||
        v.curStatus.status == (RECORD_SUB_STATUS.EDITING as any)
      ) {
        const subStatus = {
          status: v.curStatus.status,
          date: v.curStatus.date,
        };
        v.subStatus = subStatus as any;
        console.log('subStatus', subStatus);
        if (v.curStatus.status == (RECORD_SUB_STATUS.EDITING as any)) {
          v.curStatus.status = RECORD_STATUS.PUBLISHED;
        }
        if (v.curStatus.status == (RECORD_SUB_STATUS.REMOVED as any)) {
          for (let index = v.statusList.length; index > 0; index--) {
            const item = v.statusList[index];
            if (
              item?.status == RECORD_STATUS.PUBLISHED ||
              item?.status == RECORD_STATUS.NEW
            ) {
              v.curStatus.status = item.status;
              break;
            }
          }
        }
        return v;
      }
      if (
        v.curStatus.status == RECORD_STATUS.PUBLISHED ||
        v.curStatus.status == RECORD_STATUS.NEW
      ) {
        const subStatus = {
          status: RECORD_SUB_STATUS.DEFAULT,
          date: v.statusList[0].date,
        };
        v.subStatus = subStatus;
      }
      return v;
    };

    surveyMetaList.map(async (v) => {
      const item = callBack(v);
      await this.SurveyMeta.save(item);
    });

    responseSchemaList.map(async (v) => {
      const item = callBack(v);
      await this.ResponseSchema.save(item);
    });
  }
}
