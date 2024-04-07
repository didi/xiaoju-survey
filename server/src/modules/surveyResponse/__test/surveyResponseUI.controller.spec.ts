import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponseUIController } from '../controllers/surveyResponseUI.controller';
import { Response } from 'express';
import { join } from 'path';

describe('SurveyResponseUIController', () => {
  let controller: SurveyResponseUIController;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResponseUIController],
    }).compile();

    controller = module.get<SurveyResponseUIController>(
      SurveyResponseUIController,
    );
    res = {
      sendFile: jest.fn().mockResolvedValue(undefined),
    } as unknown as Response;
  });

  it('should render the survey response with the correct path', () => {
    const expectedFilePath = join(process.cwd(), 'public', 'render.html');

    controller.render(res);

    expect(res.sendFile).toHaveBeenCalledWith(expectedFilePath);
  });
});
