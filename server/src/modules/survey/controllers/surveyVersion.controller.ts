import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SurveyVersionService } from '../services/surveyVersion.service';
import { Authentication } from 'src/guards/authentication.guard';
import { SurveyGuard } from 'src/guards/survey.guard';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import {
  CreateVersionDto,
  RestoreVersionDto,
  TagVersionDto,
  CompareVersionsDto,
} from '../dto/surveyVersion.dto';

@Controller('survey/version')
export class SurveyVersionController {
  constructor(private readonly surveyVersionService: SurveyVersionService) {}

  /**
   * 获取问卷的版本历史列表
   */
  @Get('history/:surveyId')
  @UseGuards(Authentication, SurveyGuard)
  async getVersionHistory(@Param('surveyId') surveyId: string) {
    return await this.surveyVersionService.getVersionHistory(surveyId);
  }

  /**
   * 获取特定版本的详细信息
   */
  @Get('detail/:versionId')
  @UseGuards(Authentication)
  async getVersionDetail(@Param('versionId') versionId: string) {
    return await this.surveyVersionService.getVersionDetail(versionId);
  }

  /**
   * 创建新版本
   */
  @Post('create/:surveyId')
  @UseGuards(Authentication, SurveyGuard)
  async createVersion(
    @Param('surveyId') surveyId: string,
    @Body() dto: CreateVersionDto,
    @Req() req,
  ) {
    const { error, value } = CreateVersionDto.validate(dto);
    if (error) {
      throw new HttpException(`参数错误: ${error.message}`, EXCEPTION_CODE.PARAMETER_ERROR);
    }

    return await this.surveyVersionService.autoSaveVersion({
      surveyId,
      schema: req.body.schema,
      createdBy: req.user.username,
      createdById: req.user.userId,
      changesSummary: value.changesSummary,
    });
  }

  /**
   * 恢复到指定版本
   */
  @Post('restore/:surveyId')
  @UseGuards(Authentication, SurveyGuard)
  async restoreVersion(
    @Param('surveyId') surveyId: string,
    @Body() dto: RestoreVersionDto,
    @Req() req,
  ) {
    const { error, value } = RestoreVersionDto.validate(dto);
    if (error) {
      throw new HttpException(`参数错误: ${error.message}`, EXCEPTION_CODE.PARAMETER_ERROR);
    }

    return await this.surveyVersionService.restoreVersion({
      surveyId,
      versionId: value.versionId,
      restoreReason: value.restoreReason,
      restorableBy: req.user.username,
      restoreableById: req.user.userId,
    });
  }

  /**
   * 对比两个版本
   */
  @Post('compare/:surveyId')
  @UseGuards(Authentication, SurveyGuard)
  async compareVersions(
    @Param('surveyId') surveyId: string,
    @Body() dto: CompareVersionsDto,
  ) {
    const { error, value } = CompareVersionsDto.validate(dto);
    if (error) {
      throw new HttpException(`参数错误: ${error.message}`, EXCEPTION_CODE.PARAMETER_ERROR);
    }

    return await this.surveyVersionService.compareVersions(
      value.versionId1,
      value.versionId2,
    );
  }

  /**
   * 标记版本
   */
  @Post('tag/:surveyId/:versionId')
  @UseGuards(Authentication, SurveyGuard)
  async tagVersion(
    @Param('surveyId') surveyId: string,
    @Param('versionId') versionId: string,
    @Body() dto: TagVersionDto,
  ) {
    const { error, value } = TagVersionDto.validate(dto);
    if (error) {
      throw new HttpException(`参数错误: ${error.message}`, EXCEPTION_CODE.PARAMETER_ERROR);
    }

    return await this.surveyVersionService.tagVersion(
      versionId,
      surveyId,
      value.tag,
    );
  }

  /**
   * 删除版本
   */
  @Post('delete/:surveyId/:versionId')
  @UseGuards(Authentication, SurveyGuard)
  async deleteVersion(
    @Param('surveyId') surveyId: string,
    @Param('versionId') versionId: string,
  ) {
    return await this.surveyVersionService.deleteVersion(versionId, surveyId);
  }

  /**
   * 获取版本统计信息
   */
  @Get('stats/:surveyId')
  @UseGuards(Authentication, SurveyGuard)
  async getVersionStats(@Param('surveyId') surveyId: string) {
    return await this.surveyVersionService.getVersionStats(surveyId);
  }
}
