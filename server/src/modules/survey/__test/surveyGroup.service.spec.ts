import { Test, TestingModule } from '@nestjs/testing';  
import { SurveyGroupService } from '../services/surveyGroup.service';  
import { SurveyGroup } from 'src/models/surveyGroup.entity';  
import { SurveyMeta } from 'src/models/surveyMeta.entity';  
import { getMongoRepository } from 'typeorm';  
import { Repository } from 'typeorm';  

describe('SurveyGroupService', () => {  
    let service: SurveyGroupService;  
    let surveyGroupRepository: Repository<SurveyGroup>;  
    let surveyMetaRepository: Repository<SurveyMeta>;  

    const surveyGroupMock = {  
        _id: 'mockGroupId',  
        name: 'Mock Group',  
        ownerId: 'ownerId',  
        createdAt: new Date(),  
        updatedAt: new Date(),  
    };  

    const surveyMetaMock = {  
        groupId: 'mockGroupId',  
        surveyId: 'mockSurveyId',  
    };  

    beforeEach(async () => {  
        const module: TestingModule = await Test.createTestingModule({  
            providers: [  
                SurveyGroupService,  
                {  
                    provide: getMongoRepository(SurveyGroup),  
                    useValue: {  
                        create: jest.fn().mockReturnValue(surveyGroupMock),  
                        save: jest.fn().mockResolvedValue(surveyGroupMock),  
                        count: jest.fn().mockResolvedValue(1),  
                        find: jest.fn().mockResolvedValue([surveyGroupMock]),  
                        update: jest.fn().mockResolvedValue({ affected: 1 }),  
                        delete: jest.fn().mockResolvedValue({ affected: 1 }),  
                    },  
                },  
                {  
                    provide: getMongoRepository(SurveyMeta),  
                    useValue: {  
                        updateMany: jest.fn().mockResolvedValue({ affected: 1 }),  
                    },  
                },  
            ],  
        }).compile();  

        service = module.get<SurveyGroupService>(SurveyGroupService);  
        surveyGroupRepository = module.get(getMongoRepository(SurveyGroup));  
        surveyMetaRepository = module.get(getMongoRepository(SurveyMeta));  
    });  

    describe('create', () => {  
        it('should create a new survey group', async () => {  
            const params = { name: 'Test Group', ownerId: 'ownerId' };  
            const result = await service.create(params);  
            expect(result).toEqual(surveyGroupMock);  
            expect(surveyGroupRepository.save).toHaveBeenCalledWith(expect.objectContaining(params));  
        });  
    });  

    describe('findAll', () => {  
        it('should return total and list of survey groups', async () => {  
            const result = await service.findAll('ownerId', '', 0, 10);  
            expect(result).toEqual({  
                total: 1,  
                list: [surveyGroupMock],  
                allList: [surveyGroupMock],  
            });  
            expect(surveyGroupRepository.count).toHaveBeenCalled();  
            expect(surveyGroupRepository.find).toHaveBeenCalledWith(expect.any(Object));  
            expect(surveyGroupRepository.find).toHaveBeenCalledTimes(2); // 一次 for list, 一次 for allList  
        });  
    });  

    describe('findOne', () => {  
        it('should return a survey group', async () => {  
            const result = await service.findOne(1); // 假设传入的 ID 为 1  
            expect(result).toEqual('This action returns a #1 surveyGroup');  
        });  
    });  

    describe('update', () => {  
        it('should update a survey group', async () => {  
            const updatedFields = { name: 'Updated Group Name' };  
            const result = await service.update('mockGroupId', updatedFields);  
            expect(surveyGroupRepository.update).toHaveBeenCalledWith('mockGroupId', expect.objectContaining(updatedFields));  
        });  
    });  

    describe('remove', () => {  
        it('should remove a survey group and update related survey metas', async () => {  
            await service.remove('mockGroupId');  
            expect(surveyMetaRepository.updateMany).toHaveBeenCalledWith(  
                { groupId: 'mockGroupId' },  
                { $set: { groupId: null } }  
            );  
            expect(surveyGroupRepository.delete).toHaveBeenCalledWith('mockGroupId');  
        });  
    });  
});  
