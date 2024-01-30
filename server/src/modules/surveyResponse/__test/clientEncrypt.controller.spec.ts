import { Test, TestingModule } from '@nestjs/testing';
import { ClientEncryptController } from '../controllers/clientEncrpt.controller';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import { ConfigService } from '@nestjs/config';
import { ENCRYPT_TYPE } from 'src/enums/encrypt';
import { ObjectId } from 'mongodb';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';

jest.mock('../services/clientEncrypt.service');
jest.mock('@nestjs/config');

describe('ClientEncryptController', () => {
  let controller: ClientEncryptController;
  let clientEncryptService: ClientEncryptService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ClientEncryptController],
      providers: [ClientEncryptService, ConfigService],
    }).compile();

    controller = module.get<ClientEncryptController>(ClientEncryptController);
    clientEncryptService =
      module.get<ClientEncryptService>(ClientEncryptService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getEncryptInfo', () => {
    it('should return RSA encryption info', async () => {
      const id = new ObjectId();

      jest.spyOn(configService, 'get').mockReturnValueOnce(ENCRYPT_TYPE.RSA);
      jest.spyOn(controller, 'getRsaInfo').mockResolvedValue({
        publicKey: 'testPublicKey',
        privateKey: 'testPrivateKey',
      });
      jest.spyOn(clientEncryptService, 'addRsa').mockImplementation(() => {
        return Promise.resolve({
          _id: id,
          data: {
            publicKey: 'testPublicKey',
          },
        } as ClientEncrypt);
      });

      const result = await controller.getEncryptInfo();

      expect(result).toEqual({
        code: 200,
        data: {
          data: {
            secretKey: 'testPublicKey',
            sessionId: id.toString(),
          },
          encryptType: ENCRYPT_TYPE.RSA,
        },
      });
    });
  });
});
