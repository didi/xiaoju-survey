import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { RECORD_STATUS } from 'src/enums';

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
      return this.responseSchemaRepository.save(clientSurvey);
    } else {
      const curStatus = {
        status: RECORD_STATUS.PUBLISHED,
        date: Date.now(),
      };
      const newClientSurvey = this.responseSchemaRepository.create({
        title,
        surveyPath,
        code,
        pageId,
        curStatus,
        statusList: [curStatus],
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
