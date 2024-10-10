import { Test, TestingModule } from '@nestjs/testing';  
import { SurveyGroupController } from '../controllers/surveyGroup.controller';  
import { SurveyGroupService } from '../services/surveyGroup.service';  
import { HttpException } from '@nestjs/common';  

describe('SurveyGroupController', () => {  
  let controller: SurveyGroupController;  
  let service: SurveyGroupService;  

  const mockService = {  
    create: jest.fn(),  
    findAll: jest.fn(),  
    update: jest.fn(),  
    remove: jest.fn(),  
  };  

  beforeEach(async () => {  
    const module: TestingModule = await Test.createTestingModule({  
      controllers: [SurveyGroupController],  
      providers: [  
        {  
          provide: SurveyGroupService,  
          useValue: mockService,  
        },  
      ],  
    }).compile();  

    controller = module.get<SurveyGroupController>(SurveyGroupController);  
    service = module.get<SurveyGroupService>(SurveyGroupService);  
  });  

  it('should be defined', () => {  
    expect(controller).toBeDefined();  
  });  

  describe('create', () => {  
    it('should create a survey group', async () => {  
      const result = { _id: '1', name: 'Test Group', ownerId: '123' };  // 确保这里返回的对象结构符合预期  
      jest.spyOn(service, 'create').mockResolvedValue(result);  

      // 创建模拟的请求对象  
      const req = {  
          user: {  
              _id: '123', // 模拟的用户ID  
          }  
      };  

      expect(await controller.create({ name: 'Test Group', ownerId: '123' }, req)).toEqual({  
          code: 200,  
          data: {  
              id: result._id,  
          },  
      });  
      expect(service.create).toHaveBeenCalledWith({  
          name: 'Test Group',  
          ownerId: req.user._id.toString(), // 这里用模拟的 req.user._id  
      });  
    });  
}); 

  describe('findAll', () => {  
    it('should return a list of survey groups', async () => {  
      const result = { total: 1, list: [], allList: [] };  
      jest.spyOn(service, 'findAll').mockResolvedValue(result);  

      expect(await controller.findAll('123', '', 0, 10)).toBe(result);  
      expect(service.findAll).toHaveBeenCalledWith('123', '', 0, 10);  
    });  
  });  

  describe('update', () => {  
    it('should update a survey group', async () => {  
      const updatedFields = { name: 'Updated Test Group' };  
      const id = '1';  
      jest.spyOn(service, 'update').mockResolvedValue(updatedFields);  

      expect(await controller.updateOne(id, updatedFields)).toEqual({  
        code: 200,  
        ret: updatedFields,  
      });  
      expect(service.update).toHaveBeenCalledWith(id, updatedFields);  
    });  

    it('should throw error on invalid parameter', async () => {  
      const id = '1';  
      const invalidFields = {};  
      jest.spyOn(service, 'update').mockImplementation(() => {  
        throw new HttpException('参数错误', 400);  
      });  

      await expect(controller.updateOne(id, invalidFields)).rejects.toThrow(HttpException);  
    });  
  });  

  describe('remove', () => {  
    it('should remove a survey group', async () => {  
      const id = '1';  
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);  

      expect(await controller.remove(id)).toEqual({ code: 200 });  
      expect(service.remove).toHaveBeenCalledWith(id);  
    });  
  });  
});