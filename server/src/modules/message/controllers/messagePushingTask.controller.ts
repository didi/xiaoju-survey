import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { MessagePushingTaskService } from '../services/messagePushingTask.service';
import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';
import {
  MessagePushingTaskSucceedResponseDto,
  MessagePushingTaskListSucceedResponse,
  CodeDto,
  TaskIdDto,
} from '../dto/messagePushingTask.dto';
import { QueryMessagePushingTaskListDto } from '../dto/queryMessagePushingTaskList.dto';

import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Authentication } from 'src/guards/authentication.guard';

@UseGuards(Authentication)
@ApiBearerAuth()
@ApiTags('messagePushingTasks')
@Controller('/api/messagePushingTasks')
export class MessagePushingTaskController {
  constructor(
    private readonly messagePushingTaskService: MessagePushingTaskService,
  ) {}

  @ApiResponse({
    description: '创建的推送任务',
    status: 200,
    type: TaskIdDto,
  })
  @Post('')
  async create(
    @Request()
    req,
    @Body() createMessagePushingTaskDto: CreateMessagePushingTaskDto,
  ) {
    const { error, value } = CreateMessagePushingTaskDto.validate(
      createMessagePushingTaskDto,
    );
    if (error) {
      throw new HttpException(
        `参数错误: ${error.message}`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const userId = req.user._id;

    const messagePushingTask = await this.messagePushingTaskService.create({
      ...value,
      ownerId: userId,
    });
    return {
      code: 200,
      data: {
        taskId: messagePushingTask._id.toString(),
      },
    };
  }

  @ApiResponse({
    description: '推送任务列表',
    status: 200,
    type: MessagePushingTaskListSucceedResponse,
  })
  @Get('')
  async findAll(
    @Request()
    req,
    @Query() query: QueryMessagePushingTaskListDto,
  ) {
    const { error, value } = QueryMessagePushingTaskListDto.validate(query);
    if (error) {
      throw new HttpException(
        `参数错误: ${error.message}`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const userId = req.user._id;
    const list = await this.messagePushingTaskService.findAll({
      surveyId: value.surveyId,
      hook: value.triggerHook,
      ownerId: userId,
    });
    return {
      code: 200,
      data: list,
    };
  }

  @ApiResponse({
    description: '查询到的推送任务',
    status: 200,
    type: MessagePushingTaskSucceedResponseDto,
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user._id;
    const task = await this.messagePushingTaskService.findOne({
      ownerId: userId,
      id,
    });
    return {
      code: 200,
      data: task,
    };
  }

  @ApiResponse({
    description: '更新结果',
    status: 200,
    type: MessagePushingTaskSucceedResponseDto,
  })
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMessagePushingTaskDto: UpdateMessagePushingTaskDto,
  ) {
    const userId = req.user._id;
    const newTask = await this.messagePushingTaskService.update({
      id,
      ownerId: userId,
      updateData: updateMessagePushingTaskDto,
    });
    return {
      code: 200,
      data: newTask,
    };
  }

  @ApiResponse({
    description: '删除结果',
    status: 200,
    type: CodeDto,
  })
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user._id;
    const res = await this.messagePushingTaskService.remove({
      id,
      operator: req.user.username,
      operatorId: userId,
    });
    return {
      code: 200,
      data: res.modifiedCount === 1,
    };
  }

  @ApiResponse({
    description: '给任务绑定新问卷',
    status: 200,
  })
  @Post(':taskId/surveys/:surveyId')
  async surveyAuthorizeTask(
    @Request() req,
    @Param('taskId') taskId: string,
    @Param('surveyId') surveyId: string,
  ) {
    const userId = req.user._id;
    const res = await this.messagePushingTaskService.surveyAuthorizeTask({
      taskId,
      surveyId,
      ownerId: userId,
    });
    return {
      code: 200,
      data: res.modifiedCount === 1,
    };
  }
}
