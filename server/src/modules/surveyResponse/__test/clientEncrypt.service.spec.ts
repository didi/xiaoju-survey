import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { ENCRYPT_TYPE } from 'src/enums/encrypt';
import { ObjectId } from 'mongodb';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClientEncryptService', () => {
  let service: ClientEncryptService;
  let repository: MongoRepository<ClientEncrypt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientEncryptService,
        {
          provide: getRepositoryToken(ClientEncrypt),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientEncryptService>(ClientEncryptService);
    repository = module.get<MongoRepository<ClientEncrypt>>(
      getRepositoryToken(ClientEncrypt),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAes', () => {
    it('should save AES encrypt info', async () => {
      const secretKey = 'my-secret-key';
      const encryptInfo = {
        data: { secretKey },
        type: ENCRYPT_TYPE.AES,
      } as ClientEncrypt;
      jest.spyOn(repository, 'create').mockReturnValue(encryptInfo);
      jest.spyOn(repository, 'save').mockResolvedValue(encryptInfo);

      const result = await service.addAes({ secretKey });

      expect(repository.create).toHaveBeenCalledWith(encryptInfo);
      expect(repository.save).toHaveBeenCalledWith(encryptInfo);
      expect(result).toEqual(encryptInfo);
    });
  });

  describe('addRsa', () => {
    it('should save RSA encrypt info', async () => {
      const publicKey = 'my-public-key';
      const privateKey = 'my-private-key';
      const encryptInfo = {
        data: { publicKey, privateKey },
        type: ENCRYPT_TYPE.RSA,
      } as ClientEncrypt;
      jest.spyOn(repository, 'create').mockReturnValue(encryptInfo);
      jest.spyOn(repository, 'save').mockResolvedValue(encryptInfo);

      const result = await service.addRsa({ publicKey, privateKey });

      expect(repository.create).toHaveBeenCalledWith(encryptInfo);
      expect(repository.save).toHaveBeenCalledWith(encryptInfo);
      expect(result).toEqual(encryptInfo);
    });
  });

  describe('getEncryptInfoById', () => {
    it('should return encrypt info by id', async () => {
      const id = new ObjectId().toHexString();
      const encryptInfo = {
        id,
        type: ENCRYPT_TYPE.AES,
      } as unknown as ClientEncrypt;
      jest.spyOn(repository, 'findOne').mockResolvedValue(encryptInfo);

      const result = await service.getEncryptInfoById(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          _id: new ObjectId(id),
        },
      });
      expect(result).toEqual(encryptInfo);
    });

    it('should return null if encrypt info not found', async () => {
      const id = new ObjectId().toHexString();
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.getEncryptInfoById(id);

      expect(result).toBeNull();
    });
  });

  describe('deleteEncryptInfo', () => {
    it('should delete encrypt info by id', async () => {
      const id = new ObjectId().toHexString();
      const deleteResult = { matchedCount: 1, modifiedCount: 1 };
      jest
        .spyOn(repository, 'deleteOne')
        .mockResolvedValue(deleteResult as any);

      const result = await service.deleteEncryptInfo(id);
      expect(result).toEqual(deleteResult);
    });
  });
});
