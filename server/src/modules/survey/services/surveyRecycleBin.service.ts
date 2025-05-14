import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyRecycleBin } from '../../../models/surveyRecycleBin.entity';

@Injectable()
export class SurveyRecycleBinService {
  constructor(
    @InjectRepository(SurveyRecycleBin)
    private readonly surveyRecycleBinRepository: MongoRepository<SurveyRecycleBin>,
    @InjectRepository(SurveyMeta)
    private surveyMetaRepository: MongoRepository<SurveyMeta>,
  ) {}

  async count(ownerId: string) {
    const count = await this.surveyRecycleBinRepository.count({
      where: { ownerId: ownerId },
    });
    return count;
  }
}
