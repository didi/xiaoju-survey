import { Test, TestingModule } from '@nestjs/testing';
import { SurveyUIController } from '../controllers/surveyUI.controller';
import { Response } from 'express';
import { join } from 'path';

describe('SurveyUIController', () => {
  let controller: SurveyUIController;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyUIController],
    }).compile();

    controller = module.get<SurveyUIController>(SurveyUIController);
    res = {
      sendFile: jest.fn().mockResolvedValue(undefined),
    } as unknown as Response;
  });

  it('should send the correct file for the home route', () => {
    controller.home(res);
    const expectedPath = join(process.cwd(), 'public', 'management.html');
    expect(res.sendFile).toHaveBeenCalledWith(expectedPath);
  });

  it('should send the correct file for the management route', () => {
    controller.management(res);
    const expectedPath = join(process.cwd(), 'public', 'management.html');
    expect(res.sendFile).toHaveBeenCalledWith(expectedPath);
  });
});
