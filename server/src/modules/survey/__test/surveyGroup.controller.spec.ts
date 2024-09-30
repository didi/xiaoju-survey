import { Test, TestingModule } from '@nestjs/testing';  
import { SurveyGroupController } from '../controllers/surveyGroup.controller';  
import { SurveyGroupService } from '../services/surveyGroup.service';  
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';  
import { Logger } from 'src/logger';  
import { HttpException } from 'src/exceptions/httpException';  
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';  
import { CreateSurveyGroupDto } from '../dto/createSurveyGroup.dto';  
import { UpdateSurveyGroupDto } from '../dto/updateSurveyGroup.dto';  
import { GetGroupListDto } from '../dto/getGroupList.dto';  

describe('SurveyGroupController', () => {  
    let controller: SurveyGroupController;  
    let surveyGroupService: SurveyGroupService;  
    let surveyMetaService: SurveyMetaService;  

    beforeEach(async () => {  
        const module: TestingModule = await Test.createTestingModule({  
            controllers: [SurveyGroupController],  
            providers: [  
                {  
                    provide: SurveyGroupService,  
                    useValue: {  
                        create: jest.fn(),  
                        findAll: jest.fn(),  
                        findOne: jest.fn(),  
                        update: jest.fn(),  
                        remove: jest.fn(),  
                    },  
                },  
                {  
                    provide: SurveyMetaService,  
                    useValue: {  
                        countSurveyMetaByGroupId: jest.fn(),  
                    },  
                },  
                {  
                    provide: Logger,  
                    useValue: {  
                        error: jest.fn(),  
                    },  
                },  
            ],  
        }).compile();  

        controller = module.get<SurveyGroupController>(SurveyGroupController);  
        surveyGroupService = module.get<SurveyGroupService>(SurveyGroupService);  
        surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);  
    });  

    describe('create', () => {  
        it('should create a survey group', async () => {  
            const requestBody: CreateSurveyGroupDto = { name: 'Test Group' };  
            const userId = '12345';  
            const req = { user: { _id: userId } };  
            const createdGroup = { _id: 'groupId' };  

            jest.spyOn(surveyGroupService, 'create').mockResolvedValue(createdGroup);  

            const result = await controller.create(requestBody, req);  
            expect(result).toEqual({  
                code: 200,  
                data: {  
                    id: createdGroup._id  
                }  
            });  
            expect(surveyGroupService.create).toHaveBeenCalledWith({ name: 'Test Group', ownerId: userId });  
        });  

        it('should throw HttpException if validation fails', async () => {  
            const requestBody: CreateSurveyGroupDto = { name: '' }; // 传入无效数据  
            const req = { user: { _id: '12345' } };  

            await expect(controller.create(requestBody, req)).rejects.toThrow(HttpException);  
        });  
    });  

    describe('findAll', () => {  
        it('should return all survey groups', async () => {  
            const req = { user: { _id: '12345' } };  
            const queryInfo: GetGroupListDto = { curPage: 1, pageSize: 10 };  
            const surveyGroups = [{ _id: 'groupId', name: 'Group 1', createdAt: new Date() }];  
            const total = 1;  

            jest.spyOn(surveyGroupService, 'findAll').mockResolvedValue({ total, list: surveyGroups });  
            jest.spyOn(surveyMetaService, 'countSurveyMetaByGroupId').mockResolvedValue(0);  

            const result = await controller.findAll(req, queryInfo);  
            expect(result).toEqual({  
                code: 200,  
                data: {  
                    total: total,  
                    list: [{  
                        ...surveyGroups[0],  
                        createdAt: expect.any(String), // 确保其格式化  
                        surveyTotal: 0,  
                    }],  
                    allList: undefined, // 根据实际返回的数据包含此字段  
                }  
            });  
        });  
    });  

    describe('findOne', () => {  
        it('should return a survey group by id', async () => {  
            const findOneResult = { _id: 'groupId', name: 'Group Name' };  
            jest.spyOn(surveyGroupService, 'findOne').mockResolvedValue(findOneResult);  

            const result = await controller.findOne('groupId');  
            expect(result).toEqual(findOneResult);  
        });  
    });  

    describe('updateOne', () => {  
        it('should update a survey group', async () => {  
            const requestBody: UpdateSurveyGroupDto = { name: 'Updated Group Name' };  
            const req = { user: { _id: '12345' } };  

            jest.spyOn(surveyGroupService, 'update').mockResolvedValue(requestBody);  

            const result = await controller.updateOne('groupId', requestBody, req);  
            expect(result).toEqual({  
                code: 200,  
                ret: requestBody,  
            });  
        });  
    });  

    describe('remove', () => {  
        it('should remove a survey group', async () => {  
            jest.spyOn(surveyGroupService, 'remove').mockResolvedValue(undefined);  

            const result = await controller.remove('groupId');  
            expect(result).toEqual({ code: 200 });  
        });  
    });  
});  