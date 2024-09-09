import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';

@Injectable()
export class ResponseSchemaService {
  constructor(
    @InjectRepository(ResponseSchema)
    private readonly responseSchemaRepository: MongoRepository<ResponseSchema>,
  ) {}

  async publishResponseSchema({ title, surveyPath, code, pageId }) {
    const clientSurvey = await this.responseSchemaRepository.findOne({
      where: { surveyPath },
    });

    if (clientSurvey) {
      clientSurvey.title = title;
      clientSurvey.code = code;
      clientSurvey.curStatus = {
        status: RECORD_STATUS.PUBLISHED,
        date: Date.now(),
      };
      clientSurvey.subStatus = {
        status: RECORD_SUB_STATUS.DEFAULT,
        date: Date.now(),
      };
      return this.responseSchemaRepository.save(clientSurvey);
    } else {
      const curStatus = {
        status: RECORD_STATUS.PUBLISHED,
        date: Date.now(),
      };
      const subStatus = {
        status: RECORD_SUB_STATUS.DEFAULT,
        date: Date.now(),
      };
      const newClientSurvey = this.responseSchemaRepository.create({
        title,
        surveyPath,
        code,
        pageId,
        curStatus,
        statusList: [curStatus],
        subStatus,
      });
      return this.responseSchemaRepository.save(newClientSurvey);
    }
  }

  async getResponseSchemaByPath(surveyPath: string) {
    return this.responseSchemaRepository.findOne({
      where: { surveyPath },
    });
  }

  async getResponseSchemaByPageId(pageId: string) {
    return this.responseSchemaRepository.findOne({
      where: { pageId },
    });
  }

  async pausingResponseSchema({ surveyPath }) {
    const responseSchema = await this.responseSchemaRepository.findOne({
      where: { surveyPath },
    });
    if (responseSchema) {
      const subStatus = {
        status: RECORD_SUB_STATUS.PAUSING,
        date: Date.now(),
      };
      responseSchema.subStatus = subStatus;
      responseSchema.curStatus.status = RECORD_STATUS.PUBLISHED;
      if (Array.isArray(responseSchema.statusList)) {
        responseSchema.statusList.push(subStatus);
      } else {
        responseSchema.statusList = [subStatus];
      }
      return this.responseSchemaRepository.save(responseSchema);
    }
  }

  async deleteResponseSchema({ surveyPath }) {
    const responseSchema = await this.responseSchemaRepository.findOne({
      where: { surveyPath },
    });
    if (responseSchema) {
      const newStatus = {
        status: RECORD_STATUS.PUBLISHED,
        date: Date.now(),
      };
      responseSchema.curStatus = newStatus;
      if (Array.isArray(responseSchema.statusList)) {
        responseSchema.statusList.push(newStatus);
      } else {
        responseSchema.statusList = [newStatus];
      }
      return this.responseSchemaRepository.save(responseSchema);
    }
  }
}
