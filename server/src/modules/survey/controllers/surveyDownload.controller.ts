import {
  Controller,
  Get,
  Query,
  HttpCode,
  UseGuards,
  SetMetadata,
  Request,
  Res,
  // Response,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';

import { Authentication } from 'src/guards/authentication.guard';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
//后添加
import { SurveyDownloadService } from '../services/surveyDownload.service';
import {
  DownloadFileByNameDto,
  GetDownloadDto,
  GetDownloadListDto,
} from '../dto/getdownload.dto';
import { join } from 'path';
import * as util from 'util';
import * as fs from 'fs';
import { Response } from 'express';
import moment from 'moment';
import { MessageService } from '../services/message.service';

@ApiTags('survey')
@ApiBearerAuth()
@Controller('/api/survey/surveyDownload')
export class SurveyDownloadController {
  constructor(
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly surveyDownloadService: SurveyDownloadService,
    private readonly logger: Logger,
    private readonly messageService: MessageService,
  ) {}

  @Get('/download')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE])
  @UseGuards(Authentication)
  async download(
    @Query()
    queryInfo: GetDownloadDto,
    @Request() req,
  ) {
    const { value, error } = GetDownloadDto.validate(queryInfo);
    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const { surveyId, isDesensitive } = value;
    const responseSchema =
      await this.responseSchemaService.getResponseSchemaByPageId(surveyId);
    const id = await this.surveyDownloadService.createDownload({
      surveyId,
      responseSchema,
    });
    this.messageService.addMessage({
      responseSchema,
      surveyId,
      isDesensitive,
      id,
    });
    return {
      code: 200,
      data: { message: '正在生成下载文件，请稍后查看' },
    };
  }
  @Get('/getdownloadList')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE])
  @UseGuards(Authentication)
  async downloadList(
    @Query()
    queryInfo: GetDownloadListDto,
    @Request() req,
  ) {
    const { value, error } = GetDownloadListDto.validate(queryInfo);
    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const { ownerId, page, pageSize } = value;
    const { total, listBody } =
      await this.surveyDownloadService.getDownloadList({
        ownerId,
        page,
        pageSize,
      });
    return {
      code: 200,
      data: {
        total: total,
        listBody: listBody.map((data) => {
          const fmt = 'YYYY-MM-DD HH:mm:ss';
          const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          let unitIndex = 0;
          let size = Number(data.fileSize);
          while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
          }
          data.downloadTime = moment(Number(data.downloadTime)).format(fmt);
          data.fileSize = `${size.toFixed()} ${units[unitIndex]}`;
          return data;
        }),
      },
    };
  }

  @Get('/getdownloadfileByName')
  // @HttpCode(200)
  // @UseGuards(SurveyGuard)
  // @SetMetadata('surveyId', 'query.surveyId')
  // @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE])
  // @UseGuards(Authentication)
  async getDownloadfileByName(
    @Query() queryInfo: DownloadFileByNameDto,
    @Res() res: Response,
  ) {
    const { value, error } = DownloadFileByNameDto.validate(queryInfo);
    if (error) {
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const { owner, fileName } = value;
    const rootDir = process.cwd(); // 获取当前工作目录
    const filePath = join(rootDir, 'download', owner, fileName);

    // 使用 util.promisify 将 fs.access 转换为返回 Promise 的函数
    const access = util.promisify(fs.access);
    try {
      console.log('检查文件路径:', filePath);
      await access(filePath, fs.constants.F_OK);

      // 文件存在，设置响应头并流式传输文件
      res.setHeader('Content-Type', 'application/octet-stream');
      console.log('文件存在，设置响应头');
      const encodedFileName = encodeURIComponent(fileName);
      const contentDisposition = `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`;
      res.setHeader('Content-Disposition', contentDisposition);
      console.log('设置响应头成功，文件名:', encodedFileName);

      const fileStream = fs.createReadStream(filePath);
      console.log('创建文件流成功');
      fileStream.pipe(res);

      fileStream.on('end', () => {
        console.log('文件传输完成');
      });

      fileStream.on('error', (streamErr) => {
        console.error('文件流错误:', streamErr);
        res.status(500).send('文件传输中出现错误');
      });
    } catch (err) {
      console.error('文件不存在:', filePath);
      res.status(404).send('文件不存在');
    }
  }

  @Get('/deletefileByName')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE])
  @UseGuards(Authentication)
  async deleteFileByName(
    @Query() queryInfo: DownloadFileByNameDto,
    @Res() res: Response,
  ) {
    const { value, error } = DownloadFileByNameDto.validate(queryInfo);
    if (error) {
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const { owner, fileName } = value;

    try {
      const result = await this.surveyDownloadService.deleteDownloadFile({
        owner,
        fileName,
      });

      // 根据 deleteDownloadFile 的返回值执行不同操作
      if (result === 0) {
        return res.status(404).json({
          code: 404,
          message: '文件状态已删除或文件不存在',
        });
      }

      return res.status(200).json({
        code: 200,
        message: '文件删除成功',
        data: {},
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: '删除文件时出错',
        error: error.message,
      });
    }
  }
}
