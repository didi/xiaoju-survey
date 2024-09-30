import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceMemberController } from '../controllers/workspaceMember.controller';
import { WorkspaceMemberService } from '../services/workspaceMember.service';
import { CreateWorkspaceMemberDto } from '../dto/createWorkspaceMember.dto';
import { UpdateWorkspaceMemberDto } from '../dto/updateWorkspaceMember.dto';
import { DeleteWorkspaceMemberDto } from '../dto/deleteWorkspaceMember.dto';
import { HttpException } from 'src/exceptions/httpException';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { ROLE as WORKSPACE_ROLE } from 'src/enums/workspace';

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('WorkspaceMemberController', () => {
  let controller: WorkspaceMemberController;
  let workspaceMemberService: WorkspaceMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceMemberController],
      providers: [
        {
          provide: WorkspaceMemberService,
          useValue: {
            create: jest.fn(),
            findAllByWorkspaceId: jest.fn(),
            updateRole: jest.fn(),
            deleteMember: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkspaceMemberController>(
      WorkspaceMemberController,
    );
    workspaceMemberService = module.get<WorkspaceMemberService>(
      WorkspaceMemberService,
    );
  });

  describe('create', () => {
    it('should create a workspace member and return memberId', async () => {
      const createDto: CreateWorkspaceMemberDto = {
        workspaceId: 'workspaceId',
        userId: 'userId',
        role: WORKSPACE_ROLE.ADMIN,
      };
      const createdMember = { _id: 'memberId' };

      jest
        .spyOn(workspaceMemberService, 'create')
        .mockResolvedValue(createdMember as unknown as WorkspaceMember);

      const result = await controller.create(createDto);

      expect(result).toEqual({
        code: 200,
        data: {
          memberId: createdMember._id,
        },
      });
      expect(workspaceMemberService.create).toHaveBeenCalledWith({
        userId: createDto.userId,
        workspaceId: createDto.workspaceId,
        role: createDto.role,
      });
    });

    it('should throw an exception if validation fails', async () => {
      const createDto: CreateWorkspaceMemberDto = {
        workspaceId: '',
        userId: '',
        role: '',
      };

      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return a list of workspace members', async () => {
      const req = { query: { workspaceId: 'workspaceId' } };
      const members = [{ userId: 'userId1', role: 'USER' }];

      jest
        .spyOn(workspaceMemberService, 'findAllByWorkspaceId')
        .mockResolvedValue(members as unknown as Array<WorkspaceMember>);

      const result = await controller.findAll(req);

      expect(result).toEqual({
        code: 200,
        data: members,
      });
      expect(workspaceMemberService.findAllByWorkspaceId).toHaveBeenCalledWith({
        workspaceId: 'workspaceId',
      });
    });

    it('should throw an exception if workspaceId is not provided', async () => {
      const req = { query: {} };

      await expect(controller.findAll(req)).rejects.toThrow(HttpException);
    });
  });

  describe('updateRole', () => {
    it('should update the role of a workspace member and return modifiedCount', async () => {
      const updateDto: UpdateWorkspaceMemberDto = {
        workspaceId: 'workspaceId',
        userId: 'userId',
        role: WORKSPACE_ROLE.ADMIN,
      };
      const updateResult = { modifiedCount: 1 };

      // Mock request object
      const req = {
        user: { username: 'admin', _id: 'operatorId' },
      };

      jest
        .spyOn(workspaceMemberService, 'updateRole')
        .mockResolvedValue(updateResult);

      const result = await controller.updateRole(updateDto, req);

      expect(result).toEqual({
        code: 200,
        data: {
          modifiedCount: updateResult.modifiedCount,
        },
      });
      expect(workspaceMemberService.updateRole).toHaveBeenCalledWith({
        role: updateDto.role,
        workspaceId: updateDto.workspaceId,
        userId: updateDto.userId,
        operator: req.user.username,
        operatorId: req.user._id.toString(),
      });
    });

    it('should throw an exception if validation fails', async () => {
      const updateDto: UpdateWorkspaceMemberDto = {
        workspaceId: '',
        userId: '',
        role: '',
      };
      const req = {
        user: { username: 'admin', _id: 'operatorId' },
      };

      await expect(controller.updateRole(updateDto, req)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a workspace member and return deletedCount', async () => {
      const deleteDto: DeleteWorkspaceMemberDto = {
        workspaceId: 'workspaceId',
        userId: 'userId',
      };
      const deleteResult = { acknowledged: true, deletedCount: 1 };

      jest
        .spyOn(workspaceMemberService, 'deleteMember')
        .mockResolvedValue(deleteResult);

      const result = await controller.delete(deleteDto);

      expect(result).toEqual({
        code: 200,
        data: {
          deletedCount: deleteResult.deletedCount,
        },
      });
      expect(workspaceMemberService.deleteMember).toHaveBeenCalledWith(
        deleteDto,
      );
    });

    it('should throw an exception if validation fails', async () => {
      const deleteDto: DeleteWorkspaceMemberDto = {
        userId: '',
        workspaceId: '',
      };
      await expect(controller.delete(deleteDto)).rejects.toThrow(HttpException);
    });
  });
});
