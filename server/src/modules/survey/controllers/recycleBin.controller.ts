import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authentication } from 'src/guards/authentication.guard';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Logger } from 'src/logger';

import { RecycleBinService } from '../services/recycleBin.service';
import { RecycleBinListDto, RecycleBinItemDto } from '../dto/recycleBin.dto';

@ApiTags('回收站')
@Controller('/api/survey/recyclebin')
@UseGuards(Authentication)
export class RecycleBinController {
  constructor(
    private readonly recycleBinService: RecycleBinService,
    private readonly logger: Logger,
  ) {}

  @Post('/list')
  @HttpCode(200)
  @ApiOperation({ summary: '获取回收站问卷列表' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async getRecycleBinList(@Request() req, @Body() dto: RecycleBinListDto) {
    const { value, error } = RecycleBinListDto.validate(dto);
    
    if (error) {
      this.logger.error(`getRecycleBinList_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    
    const userId = req.user._id.toString();
    const { list, count } = await this.recycleBinService.getRecycleBinList(userId, value);
    
    return {
      code: 200,
      data: {
        list,
        count,
      },
    };
  }

  @Post('/restore')
  @HttpCode(200)
  @ApiOperation({ summary: '恢复问卷' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async restoreSurvey(@Request() req, @Body() dto: RecycleBinItemDto) {
    const { value, error } = RecycleBinItemDto.validate(dto);
    
    if (error) {
      this.logger.error(`restoreSurvey_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    
    const userId = req.user._id.toString();
    await this.recycleBinService.restoreSurvey(userId, value.id);
    
    return {
      code: 200,
      data: {
        success: true,
      },
    };
  }

  @Post('/delete')
  @HttpCode(200)
  @ApiOperation({ summary: '永久删除问卷' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async permanentDeleteSurvey(@Request() req, @Body() dto: RecycleBinItemDto) {
    const { value, error } = RecycleBinItemDto.validate(dto);
    
    if (error) {
      this.logger.error(`permanentDeleteSurvey_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    
    const userId = req.user._id.toString();
    await this.recycleBinService.permanentDeleteSurvey(userId, value.id);
    
    return {
      code: 200,
      data: {
        success: true,
      },
    };
  }

  @Post('/move')
  @HttpCode(200)
  @ApiOperation({ summary: '将问卷移至回收站' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async moveToRecycleBin(@Request() req, @Body() dto: RecycleBinItemDto) {
    console.log(`[RecycleBin] 收到移动问卷请求:`, JSON.stringify(dto));
    this.logger.info(`moveToRecycleBin_start: ${JSON.stringify(dto)}`);
    this.logger.info(`req.user: ${JSON.stringify(req.user)}`);
    const { value, error } = RecycleBinItemDto.validate(dto);
    
    if (error) {
      const errorMsg = `moveToRecycleBin_parameter error: ${error.message}`;
      console.error(errorMsg);
      this.logger.error(errorMsg);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    
    try {
      const userId = req.user._id.toString();
      console.log(`[RecycleBin] 处理移动问卷: userId=${userId}, surveyId=${value.id}`);
      this.logger.info(`moveToRecycleBin_processing: userId=${userId}, surveyId=${value.id}`);
      
      await this.recycleBinService.moveToRecycleBin(userId, value.id);
      
      console.log(`[RecycleBin] 成功移动问卷: surveyId=${value.id}`);
      this.logger.info(`moveToRecycleBin_success: userId=${userId}, surveyId=${value.id}`);
      return {
        code: 200,
        data: {
          success: true,
        },
      };
    } catch (error) {
      const errorMsg = `moveToRecycleBin_error: ${error.message || '未知错误'}`;
      console.error(`[RecycleBin] 错误:`, errorMsg);
      console.error(`[RecycleBin] 堆栈:`, error.stack);
      this.logger.error(errorMsg);
      this.logger.error(`moveToRecycleBin_stack: ${error.stack || 'No stack trace'}`);
      
      return {
        code: 500,
        errmsg: error.message || '移动到回收站失败',
      };
    }
  }
} 