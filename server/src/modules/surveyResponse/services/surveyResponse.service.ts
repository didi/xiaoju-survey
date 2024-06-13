import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { HttpException } from 'src/exceptions/httpException';
@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: MongoRepository<SurveyResponse>,
    @InjectRepository(ResponseSchema)
    private readonly responseSchemaRepository: MongoRepository<ResponseSchema>,
  ) {}

  //homework: 找到此问卷的scheme
  async getResponseSchemaByPath(surveyPath: string) {
    return this.responseSchemaRepository.findOne({
      where: { surveyPath },
    });
  }

  //homework: 提交问卷之前，计算此问卷(surveyPath)的某选择题(field)里某选项(hash)被选的总数
  async getOptionsInResponseByHash(
    surveyPath: string,
    field: string,
    hash: string,
  ) {
    const myOptionsInResponse = await this.surveyResponseRepository.find({
      where: {
        surveyPath: surveyPath,
        //[`data.${field}`]: { $or: [{ $eq: hash }, { $elemMatch: hash }] },
        $or: [
          {
            [`data.${field}`]: hash,
          },
          {
            [`data.${field}`]: { $elemMatch: { $eq: hash } },
          },
        ],
      },
    });
    const myOptionsCount = myOptionsInResponse.length;
    return myOptionsCount;
  }

  async createSurveyResponse({
    data,
    clientTime,
    difTime,
    surveyId,
    surveyPath,
    optionTextAndId,
  }) {
    const newSubmitData = this.surveyResponseRepository.create({
      surveyPath,
      data,
      secretKeys: [],
      clientTime,
      difTime,
      pageId: surveyId,
      optionTextAndId,
    });

    //homework: 根据提交的数据，判断每个选项是否超额
    const myScheme = await this.getResponseSchemaByPath(
      newSubmitData.surveyPath,
    );
    let myJudge = 1;
    for (const eachDataItem of myScheme.code.dataConf.dataList) {
      if (eachDataItem.type === 'radio') {
        const myField = eachDataItem.field;
        for (const eachOption of eachDataItem.options) {
          const myOptionHash = eachOption.hash;
          if (newSubmitData.data[myField] === myOptionHash) {
            const temCount = await this.getOptionsInResponseByHash(
              newSubmitData.surveyPath,
              myField,
              myOptionHash,
            );
            if (temCount + 1 > eachOption.limit) myJudge = 0;
          }
        }
      }
    }

    // 提交问卷
    if (myJudge === 1) {
      const res = await this.surveyResponseRepository.save(newSubmitData);
      // res是加密后的数据，需要手动调用loaded才会触发解密
      res.onDataLoaded();
      return res;
    } else {
      throw new HttpException(
        '超出提交总数限制',
        EXCEPTION_CODE.RESPONSE_OVER_LIMIT,
      );
    }
  }

  async getSurveyResponseTotalByPath(surveyPath: string) {
    const count = await this.surveyResponseRepository.count({
      where: {
        surveyPath,
        'curStatus.status': {
          $ne: 'removed',
        },
      },
    });
    return count;
  }
}
