import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Request,
  SetMetadata,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';

import { SurveyMetaService } from '../services/surveyMeta.service';
import { SurveyConfService } from '../services/surveyConf.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { SurveyHistoryService } from '../services/surveyHistory.service';

import BannerData from '../template/banner/index.json';
import { CreateSurveyDto } from '../dto/createSurvey.dto';

import { Authentication } from 'src/guards/authentication.guard';
import { HISTORY_TYPE, RECORD_STATUS } from 'src/enums';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Logger } from 'src/logger';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

import { WorkspaceGuard } from 'src/guards/workspace.guard';
import { PERMISSION as WORKSPACE_PERMISSION } from 'src/enums/workspace';
import { SessionService } from '../services/session.service';
import { UserService } from 'src/modules/auth/services/user.service';

import { FilesInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

interface ExcelQuestion {
  title: string;
  type: string;
  options: string;
}

@ApiTags('survey')
@Controller('/api/survey')
export class SurveyController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly surveyConfService: SurveyConfService,
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly contentSecurityService: ContentSecurityService,
    private readonly surveyHistoryService: SurveyHistoryService,
    private readonly logger: Logger,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  @Get('/getBannerData')
  @HttpCode(200)
  async getBannerData() {
    return {
      code: 200,
      data: BannerData,
    };
  }

  @Post('/createSurvey')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.createFrom')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_SURVEY])
  @SetMetadata('workspaceId', { key: 'body.workspaceId', optional: true })
  @UseGuards(Authentication)
  async createSurvey(
    @Body()
    reqBody: CreateSurveyDto,
    @Request()
    req,
  ) {
    const { error, value } = CreateSurveyDto.validate(reqBody);
    if (error) {
      this.logger.error(`createSurvey_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const { title, remark, createMethod, createFrom, groupId, questionList } =
      value;

    let surveyType = '',
      workspaceId = null;
    if (createMethod === 'copy') {
      const survey = req.surveyMeta;
      surveyType = survey.surveyType;
      workspaceId = survey.workspaceId;
    } else {
      surveyType = value.surveyType;
      workspaceId = value.workspaceId;
    }

    const surveyMeta = await this.surveyMetaService.createSurveyMeta({
      title,
      remark,
      surveyType,
      username: req.user.username,
      userId: req.user._id.toString(),
      createMethod,
      createFrom,
      workspaceId,
      groupId,
    });
    await this.surveyConfService.createSurveyConf({
      surveyId: surveyMeta._id.toString(),
      surveyType: surveyType,
      createMethod: value.createMethod,
      createFrom: value.createFrom,
      questionList,
    });
    return {
      code: 200,
      data: {
        id: surveyMeta._id.toString(),
      },
    };
  }

  @Post('/updateConf')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async updateConf(
    @Body()
    surveyInfo,
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
      configData: Joi.any().required(),
      sessionId: Joi.string().required(),
    }).validate(surveyInfo);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    if (!surveyInfo?.configData?.dataConf?.dataList?.length) {
      this.logger.error('确少题目数据');
      throw new HttpException(
        '请添加题目后重新保存问卷',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    const sessionId = value.sessionId;
    const surveyId = value.surveyId;
    const latestEditingOne = await this.sessionService.findLatestEditingOne({
      surveyId,
    });

    if (latestEditingOne && latestEditingOne._id.toString() !== sessionId) {
      const curSession = await this.sessionService.findOne(sessionId);
      if (curSession.createdAt <= latestEditingOne.updatedAt) {
        // 在当前用户打开之后，被其他页面保存过了
        const isSameOperator =
          latestEditingOne.userId === req.user._id.toString();
        let preOperator;
        if (!isSameOperator) {
          preOperator = await this.userService.getUserById(
            latestEditingOne.userId,
          );
        }
        return {
          code: EXCEPTION_CODE.SURVEY_SAVE_CONFLICT,
          errmsg: isSameOperator
            ? '当前问卷已在其它页面开启编辑，刷新以获取最新内容'
            : `当前问卷已由 ${preOperator.username} 编辑，刷新以获取最新内容`,
        };
      }
    }
    await this.sessionService.updateSessionToEditing({ sessionId, surveyId });

    const username = req.user.username;

    const configData = value.configData;
    await this.surveyConfService.saveSurveyConf({
      surveyId,
      schema: configData,
    });
    await this.surveyHistoryService.addHistory({
      surveyId,
      schema: configData,
      type: HISTORY_TYPE.DAILY_HIS,
      user: {
        _id: req.user._id.toString(),
        username,
      },
    });
    return {
      code: 200,
    };
  }

  @HttpCode(200)
  @Post('/removeSurvey')
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async removeSurvey(@Request() req) {
    const surveyMeta = req.surveyMeta;
    const removeMetaRes = await this.surveyMetaService.removeSurveyMeta({
      surveyId: surveyMeta._id.toString(),
      operator: req.user.username,
      operatorId: req.user._id.toString(),
    });
    const removeResponseRes =
      await this.responseSchemaService.removeResponseSchema({
        surveyPath: surveyMeta.surveyPath,
      });

    this.logger.info(JSON.stringify(removeMetaRes));
    this.logger.info(JSON.stringify(removeResponseRes));

    return {
      code: 200,
    };
  }

  @HttpCode(200)
  @Post('/restoreSurvey')
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async restoreSurvey(@Request() req) {
    const surveyMeta = req.surveyMeta;
    const restoreMetaRes = await this.surveyMetaService.restoreSurveyMeta({
      surveyId: surveyMeta._id.toString(),
      operator: req.user.username,
      operatorId: req.user._id.toString(),
    });
    const restoreResponseRes =
      await this.responseSchemaService.restoreResponseSchema({
        surveyPath: surveyMeta.surveyPath,
      });

    this.logger.info(JSON.stringify(restoreMetaRes));
    this.logger.info(JSON.stringify(restoreResponseRes));

    return {
      code: 200,
    };
  }

  @HttpCode(200)
  @Post('/deleteSurvey')
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async deleteSurvey(@Request() req) {
    const surveyMeta = req.surveyMeta;

    const delMetaRes = await this.surveyMetaService.deleteSurveyMeta({
      surveyId: surveyMeta._id.toString(),
      operator: req.user.username,
      operatorId: req.user._id.toString(),
    });
    const delResponseRes =
      await this.responseSchemaService.deleteResponseSchema({
        surveyPath: surveyMeta.surveyPath,
      });

    this.logger.info(JSON.stringify(delMetaRes));
    this.logger.info(JSON.stringify(delResponseRes));

    return {
      code: 200,
    };
  }

  @HttpCode(200)
  @Post('/pausingSurvey')
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async pausingSurvey(@Request() req) {
    const surveyMeta = req.surveyMeta;

    await this.surveyMetaService.pausingSurveyMeta(surveyMeta);
    await this.responseSchemaService.pausingResponseSchema({
      surveyPath: surveyMeta.surveyPath,
    });

    return {
      code: 200,
    };
  }

  @Get('/getSurvey')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
    SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
  ])
  @UseGuards(Authentication)
  async getSurvey(
    @Query()
    queryInfo: {
      surveyId: string;
    },
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate(queryInfo);

    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const surveyId = value.surveyId;
    const surveyMeta = req.surveyMeta;

    if (surveyMeta.curStatus.status == RECORD_STATUS.REMOVED) {
      this.logger.info("survey is removed");
      throw new HttpException('问卷已被删除', EXCEPTION_CODE.SURVEY_REMOVED);
    }

    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);

    surveyMeta.currentUserId = req.user._id.toString();
    if (req.collaborator) {
      surveyMeta.isCollaborated = true;
      surveyMeta.currentPermission = req.collaborator.permissions;
    } else {
      surveyMeta.isCollaborated = false;
    }

    return {
      code: 200,
      data: {
        surveyMetaRes: surveyMeta,
        surveyConfRes: surveyConf,
      },
    };
  }

  @Get('/getPreviewSchema')
  @HttpCode(200)
  async getPreviewSchema(
    @Query()
    queryInfo: {
      surveyPath: string;
    },
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate({ surveyId: queryInfo.surveyPath });

    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const surveyId = value.surveyId;
    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);
    const surveyMeta = await this.surveyMetaService.getSurveyById({ surveyId });
    return {
      code: 200,
      data: {
        ...surveyConf,
        title: surveyMeta?.title,
        surveyPath: surveyMeta?.surveyPath,
      },
    };
  }

  @Post('/publishSurvey')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async publishSurvey(
    @Body()
    surveyInfo,
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate(surveyInfo);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const username = req.user.username;
    const surveyId = value.surveyId;
    const surveyMeta = req.surveyMeta;
    if (surveyMeta.isDeleted) {
      throw new HttpException(
        '问卷已删除，无法发布',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }
    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);

    const { text } = await this.surveyConfService.getSurveyContentByCode(
      surveyConf.code,
    );

    if (await this.contentSecurityService.isForbiddenContent({ text })) {
      throw new HttpException(
        '问卷存在非法关键字，不允许发布',
        EXCEPTION_CODE.SURVEY_CONTENT_NOT_ALLOW,
      );
    }

    await this.surveyMetaService.publishSurveyMeta({
      surveyMeta,
    });

    await this.responseSchemaService.publishResponseSchema({
      title: surveyMeta.title,
      surveyPath: surveyMeta.surveyPath,
      code: surveyConf.code,
      pageId: surveyId,
    });

    // 添加发布历史可以异步添加
    this.surveyHistoryService.addHistory({
      surveyId,
      schema: surveyConf.code,
      type: HISTORY_TYPE.PUBLISH_HIS,
      user: {
        _id: req.user._id.toString(),
        username,
      },
    });
    return {
      code: 200,
    };
  }

  @Post('/getExcelQuestions')
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  async getExcelQuestions(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      let validationError = '';
      const allQuestions: ExcelQuestion[] = [];

      // 验证每个文件
      for (const file of files) {
        validationError = this.validateExcelFile(file).errorType;
        if (validationError) {
          break;
        }

        // 解析文件内容
        const questions = this.parseExcelFile(file);
        allQuestions.push(...questions);
      }

      // 如果有验证错误，返回错误信息
      if (validationError) {
        return {
          code: 400,
          message: '文件不通过校验',
          error: validationError,
        };
      }

      // 返回解析结果
      return {
        code: 200,
        message: '上传成功',
        data: {
          questions: allQuestions,
        },
      };
    } catch (error) {
      this.logger.error(`getExcelQuestions error: ${error.message}`);
      return {
        code: 500,
        message: '文件处理失败',
        error: error.message,
      };
    }
  }

  private validateExcelFile(file: Express.Multer.File): {
    errorType?: 'HEADER_FORMAT' | 'MERGED_CELLS' | 'SIZE_LIMIT' | '';
  } {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 检查文件大小限制（行数和列数）
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const rowCount = range.e.r + 1; // 总行数
    const colCount = range.e.c + 1; // 总列数

    if (rowCount > 10000) {
      return {
        errorType: 'SIZE_LIMIT',
      };
    }

    if (colCount > 3) {
      return {
        errorType: 'SIZE_LIMIT',
      };
    }

    // 检查是否有合并单元格
    if (worksheet['!merges'] && worksheet['!merges'].length > 0) {
      return {
        errorType: 'MERGED_CELLS',
      };
    }

    // 检查表头格式
    const headerA1 = worksheet['A1']?.v?.toString().trim();
    const headerB1 = worksheet['B1']?.v?.toString().trim();
    const headerC1 = worksheet['C1']?.v?.toString().trim();

    if (
      headerA1 !== '题目标题' ||
      headerB1 !== '题型' ||
      headerC1 !== '选项内容'
    ) {
      return {
        errorType: 'HEADER_FORMAT',
      };
    }

    return { errorType: '' };
  }

  private parseExcelFile(file: Express.Multer.File): ExcelQuestion[] {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表转换为JSON数组
    const jsonData = XLSX.utils.sheet_to_json<ExcelQuestion>(worksheet, {
      header: ['title', 'type', 'options'],
      range: 1, // 从第二行开始读取数据
    });

    const questions: ExcelQuestion[] = [];

    for (const row of jsonData) {
      // 过滤空行
      if (!row.title && !row.type && !row.options) {
        continue;
      }

      questions.push({
        title: (row.title || '').toString().trim(),
        type: (row.type || '').toString().trim(),
        options: (row.options || '').toString().trim(),
      });
    }

    return questions;
  }
}
