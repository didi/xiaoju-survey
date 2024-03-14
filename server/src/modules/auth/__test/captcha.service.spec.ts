import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaService } from '../services/captcha.service';
import { MongoRepository } from 'typeorm';
import { Captcha } from 'src/models/captcha.entity';
import { ObjectId } from 'mongodb';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let captchaRepository: MongoRepository<Captcha>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchaService,
        {
          provide: getRepositoryToken(Captcha),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CaptchaService>(CaptchaService);
    captchaRepository = module.get<MongoRepository<Captcha>>(
      getRepositoryToken(Captcha),
    );
  });

  describe('createCaptcha', () => {
    it('should create a captcha successfully', async () => {
      const mockCaptchaText = 'xsfd';
      jest.spyOn(captchaRepository, 'create').mockImplementation((data) => {
        return {
          ...data,
        } as Captcha;
      });
      jest.spyOn(captchaRepository, 'save').mockImplementation((data) => {
        return Promise.resolve({
          _id: new ObjectId(),
          ...data,
        } as Captcha);
      });

      const result = await service.createCaptcha(mockCaptchaText);

      expect(result.text).toBe(mockCaptchaText);
      expect(captchaRepository.create).toHaveBeenCalledWith({
        text: mockCaptchaText,
      });
    });
  });

  describe('getCaptcha', () => {
    it('should get a captcha by ID successfully', async () => {
      const mockCaptchaId = new ObjectId();
      const mockCaptcha = new Captcha();
      mockCaptcha._id = mockCaptchaId;

      jest
        .spyOn(captchaRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockCaptcha));

      const result = await service.getCaptcha(mockCaptchaId.toString());

      expect(result).toBe(mockCaptcha);
      expect(captchaRepository.findOne).toHaveBeenCalledWith({
        where: { _id: mockCaptchaId },
      });
    });
  });

  describe('deleteCaptcha', () => {
    it('should delete a captcha by ID successfully', async () => {
      const mockCaptchaId = new ObjectId();

      await service.deleteCaptcha(mockCaptchaId.toString());

      expect(captchaRepository.delete).toHaveBeenCalledWith(mockCaptchaId);
    });

    // Add more test cases for different scenarios
  });

  describe('checkCaptchaIsCorrect', () => {
    it('should check if captcha is correct successfully', async () => {
      const mockCaptchaId = new ObjectId();
      const mockCaptcha = new Captcha();
      mockCaptcha._id = mockCaptchaId;
      mockCaptcha.text = 'asfq';
      jest
        .spyOn(captchaRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockCaptcha));

      const mockCaptchaData = {
        captcha: 'asfq',
        id: mockCaptchaId.toString(),
      };
      const result = await service.checkCaptchaIsCorrect(mockCaptchaData);

      expect(result).toBe(true);
      expect(captchaRepository.findOne).toHaveBeenCalledWith({
        where: { _id: mockCaptchaId },
      });
    });
  });
});
