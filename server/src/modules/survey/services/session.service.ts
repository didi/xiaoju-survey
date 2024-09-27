import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Session } from 'src/models/session.entity';
import { ObjectId } from 'mongodb';
import { SESSION_STATUS } from 'src/enums/surveySessionStatus';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: MongoRepository<Session>,
  ) {}

  create({ surveyId, userId }) {
    const session = this.sessionRepository.create({
      surveyId,
      userId,
      status: SESSION_STATUS.DEACTIVATED,
    });
    return this.sessionRepository.save(session);
  }

  findOne(sessionId) {
    return this.sessionRepository.findOne({
      where: {
        _id: new ObjectId(sessionId),
      },
    });
  }

  findLatestEditingOne({ surveyId }) {
    return this.sessionRepository.findOne({
      where: {
        surveyId,
        status: SESSION_STATUS.ACTIVATED,
      },
    });
  }

  updateSessionToEditing({ sessionId, surveyId }) {
    return Promise.all([
      this.sessionRepository.update(
        {
          _id: new ObjectId(sessionId),
        },
        {
          status: SESSION_STATUS.ACTIVATED,
          updatedAt: new Date(),
        },
      ),
      this.sessionRepository.updateMany(
        {
          surveyId,
          _id: {
            $ne: new ObjectId(sessionId),
          },
        },
        {
          $set: {
            status: SESSION_STATUS.DEACTIVATED,
            updatedAt: new Date(),
          },
        },
      ),
    ]);
  }
}
