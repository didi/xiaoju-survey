import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from '../controllers/session.controller';
import { SessionService } from '../services/session.service';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { Authentication } from 'src/guards/authentication.guard';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SessionGuard } from 'src/guards/session.guard';

describe('SessionController', () => {
  let controller: SessionController;
  let sessionService: jest.Mocked<SessionService>;
  let logger: jest.Mocked<Logger>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: {
            create: jest.fn(),
            updateSessionToEditing: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(Authentication)
      .useValue({ canActivate: () => true })
      .overrideGuard(SurveyGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(SessionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SessionController>(SessionController);
    sessionService = module.get<jest.Mocked<SessionService>>(SessionService);
    logger = module.get<jest.Mocked<Logger>>(Logger);
  });

  it('should create a session', async () => {
    const reqBody = { surveyId: '123' };
    const req = { user: { _id: 'userId' } };
    const session: any = { _id: 'sessionId' };

    sessionService.create.mockResolvedValue(session);

    const result = await controller.create(reqBody, req);

    expect(sessionService.create).toHaveBeenCalledWith({
      surveyId: '123',
      userId: 'userId',
    });
    expect(result).toEqual({ code: 200, data: { sessionId: 'sessionId' } });
  });

  it('should throw an exception if validation fails', async () => {
    const reqBody = { surveyId: null };
    const req = { user: { _id: 'userId' } };

    try {
      await controller.create(reqBody, req);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(logger.error).toHaveBeenCalled();
    }
  });

  it('should seize a session', async () => {
    const req = {
      sessionInfo: { _id: 'sessionId', surveyId: 'surveyId' },
    };

    await controller.seize(req);

    expect(sessionService.updateSessionToEditing).toHaveBeenCalledWith({
      sessionId: 'sessionId',
      surveyId: 'surveyId',
    });
  });
});
