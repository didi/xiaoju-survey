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
      return this.responseSchemaRepository.save(responseSchema);
    }
  }

  async deleteResponseSchema({ surveyPath }) {
    return this.responseSchemaRepository.updateOne(
      {
        surveyPath,
      },
      {
        $set: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      },
    );
  }

  async recoverResponseSchema({ surveyPath }) {
    return this.responseSchemaRepository.updateOne(
      {
        surveyPath,
      },
      {
        $set: {
          isDeleted: null,
          updatedAt: new Date(),
        },
      },
    );
  }

  async completeDeleteResponseSchema({ surveyPath }) {
    return this.responseSchemaRepository.updateOne(
      {
        surveyPath,
      },
      {
        $set: {
          isCompleteDeleted: true,
          updatedAt: new Date(),
        },
      },
    );
  }
}
