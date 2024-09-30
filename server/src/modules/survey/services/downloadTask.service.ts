import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { DownloadTask } from 'src/models/downloadTask.entity';
import { ObjectId } from 'mongodb';
import { ResponseSchemaService } from 'src/modules/surveyResponse/services/responseScheme.service';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { DataStatisticService } from './dataStatistic.service';
import xlsx from 'node-xlsx';
import { load } from 'cheerio';
import { get } from 'lodash';
import { FileService } from 'src/modules/file/services/file.service';
import { Logger } from 'src/logger';
import moment from 'moment';
import { DOWNLOAD_TASK_STATUS } from 'src/enums/downloadTaskStatus';

@Injectable()
export class DownloadTaskService {
  static taskList: Array<any> = [];
  static isExecuting: boolean = false;

  constructor(
    @InjectRepository(DownloadTask)
    private readonly downloadTaskRepository: MongoRepository<DownloadTask>,
    private readonly responseSchemaService: ResponseSchemaService,
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: MongoRepository<SurveyResponse>,
    private readonly dataStatisticService: DataStatisticService,
    private readonly fileService: FileService,
    private readonly logger: Logger,
  ) {}

  async createDownloadTask({
    surveyId,
    responseSchema,
    creatorId,
    creator,
    params,
  }: {
    surveyId: string;
    responseSchema: ResponseSchema;
    creatorId: string;
    creator: string;
    params: any;
  }) {
    const filename = `${responseSchema.title}-${params.isMasked ? '脱敏' : '原'}回收数据-${moment().format('YYYYMMDDHHmmss')}.xlsx`;
    const downloadTask = this.downloadTaskRepository.create({
      surveyId,
      surveyPath: responseSchema.surveyPath,
      fileSize: '计算中',
      creatorId,
      creator,
      params: {
        ...params,
        title: responseSchema.title,
      },
      filename,
      status: DOWNLOAD_TASK_STATUS.WAITING,
    });
    await this.downloadTaskRepository.save(downloadTask);
    return downloadTask._id.toString();
  }

  async getDownloadTaskList({
    creatorId,
    pageIndex,
    pageSize,
  }: {
    creatorId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    const where = {
      creatorId,
      isDeleted: {
        $ne: true,
      },
    };
    const [surveyDownloadList, total] =
      await this.downloadTaskRepository.findAndCount({
        where,
        take: pageSize,
        skip: (pageIndex - 1) * pageSize,
        order: {
          createdAt: -1,
        },
      });
    return {
      total,
      list: surveyDownloadList,
    };
  }

  async getDownloadTaskById({ taskId }) {
    const res = await this.downloadTaskRepository.find({
      where: {
        _id: new ObjectId(taskId),
      },
    });
    if (Array.isArray(res) && res.length > 0) {
      return res[0];
    }
    return null;
  }

  async deleteDownloadTask({
    taskId,
    operator,
    operatorId,
  }: {
    taskId: string;
    operator: string;
    operatorId: string;
  }) {
    return this.downloadTaskRepository.updateOne(
      {
        _id: new ObjectId(taskId),
      },
      {
        $set: {
          isDeleted: true,
          operator,
          operatorId,
          deletedAt: new Date(),
        },
      },
    );
  }

  processDownloadTask({ taskId }) {
    DownloadTaskService.taskList.push(taskId);
    if (!DownloadTaskService.isExecuting) {
      this.executeTask();
      DownloadTaskService.isExecuting = true;
    }
  }

  async executeTask() {
    try {
      while (DownloadTaskService.taskList.length > 0) {
        const taskId = DownloadTaskService.taskList.shift();
        this.logger.info(`handle taskId: ${taskId}`);
        const taskInfo = await this.getDownloadTaskById({ taskId });
        if (!taskInfo || taskInfo.isDeleted) {
          // 不存在或者已删除的，不处理
          continue;
        }
        await this.handleDownloadTask({ taskInfo });
      }
    } finally {
      DownloadTaskService.isExecuting = false;
    }
  }

  async handleDownloadTask({ taskInfo }) {
    try {
      // 更新任务状态为计算中
      const updateRes = await this.downloadTaskRepository.updateOne(
        {
          _id: taskInfo._id,
        },
        {
          $set: {
            status: DOWNLOAD_TASK_STATUS.COMPUTING,
            updatedAt: new Date(),
          },
        },
      );

      this.logger.info(JSON.stringify(updateRes));

      // 开始计算任务
      const surveyId = taskInfo.surveyId;
      const responseSchema =
        await this.responseSchemaService.getResponseSchemaByPageId(surveyId);
      const where = {
        pageId: surveyId,
      };
      const total = await this.surveyResponseRepository.count(where);
      const pageSize = 200;
      const pageTotal = Math.ceil(total / pageSize);
      const xlsxHead = [];
      const xlsxBody = [];
      for (let pageIndex = 1; pageIndex <= pageTotal; pageIndex++) {
        const { listHead, listBody } =
          await this.dataStatisticService.getDataTable({
            surveyId,
            pageNum: pageIndex,
            pageSize,
            responseSchema,
          });
        if (xlsxHead.length === 0) {
          for (const item of listHead) {
            const $ = load(item.title);
            const text = $.text();
            xlsxHead.push(text);
          }
        }
        for (const bodyItem of listBody) {
          const bodyData = [];
          for (const headItem of listHead) {
            const field = headItem.field;
            const val = get(bodyItem, field, '');
            if (typeof val === 'string') {
              const $ = load(val);
              const text = $.text();
              bodyData.push(text);
            } else {
              bodyData.push(val);
            }
          }
          xlsxBody.push(bodyData);
        }
      }
      const xlsxData = [xlsxHead, ...xlsxBody];
      const buffer = await xlsx.build([
        { name: 'sheet1', data: xlsxData, options: {} },
      ]);

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: taskInfo.filename,
        encoding: '7bit',
        mimetype: 'application/octet-stream',
        filename: taskInfo.filename,
        size: buffer.length,
        buffer: buffer,
        stream: null,
        destination: null,
        path: '',
      };
      const { url, key } = await this.fileService.upload({
        configKey: 'SERVER_LOCAL_CONFIG',
        file,
        pathPrefix: 'exportfile',
        filename: taskInfo.filename,
      });

      // 更新计算结果
      const updateFinishRes = await this.downloadTaskRepository.updateOne(
        {
          _id: taskInfo._id,
        },
        {
          $set: {
            status: DOWNLOAD_TASK_STATUS.SUCCEED,
            url,
            fileKey: key,
            fileSize: buffer.length,
            updatedAt: new Date(),
          },
        },
      );
      this.logger.info(JSON.stringify(updateFinishRes));
    } catch (error) {
      await this.downloadTaskRepository.updateOne(
        {
          _id: taskInfo._id,
        },
        {
          $set: {
            status: DOWNLOAD_TASK_STATUS.FAILED,
            updatedAt: new Date(),
          },
        },
      );
      this.logger.error(
        `导出文件失败 taskId: ${taskInfo._id.toString()}, surveyId: ${taskInfo.surveyId}, message: ${error.message}`,
      );
    }
  }
}
