import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Session } from 'src/models/session.entity';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from 'src/enums';

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
        'curStatus.status': {
          $ne: RECORD_STATUS.NEW,
        },
      },
    });
  }

  updateSessionToEditing({ sessionId, surveyId }) {
    const now = Date.now();
    const editingStatus = {
      status: RECORD_STATUS.EDITING,
      date: now,
    };
    const newStatus = {
      status: RECORD_STATUS.NEW,
      date: now,
    };
    return Promise.all([
      this.sessionRepository.updateOne(
        {
          _id: new ObjectId(sessionId),
        },
        {
          $set: {
            curStatus: editingStatus,
            updateDate: now,
          },
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
            curStatus: newStatus,
            updateDate: now,
          },
        },
      ),
    ]);
  }
}
