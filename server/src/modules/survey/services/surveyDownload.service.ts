import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';

import moment from 'moment';
import _, { keyBy } from 'lodash';
import { DataItem } from 'src/interfaces/survey';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { getListHeadByDataList } from '../utils';
//后添加
import { writeFile, stat,promises } from 'fs';
import { join } from 'path';
import { SurveyDownload } from 'src/models/surveyDownload.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import e from 'express';
import { XiaojuSurveyPluginManager } from 'src/securityPlugin/pluginManager';
import { RECORD_STATUS } from 'src/enums';
import * as cron from 'node-cron';

@Injectable()
export class SurveyDownloadService implements OnModuleInit{
  private radioType = ['radio-star', 'radio-nps'];

  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: MongoRepository<SurveyResponse>,
    @InjectRepository(SurveyDownload)
    private readonly SurveyDownloadRepository: MongoRepository<SurveyDownload>,
    @InjectRepository(SurveyMeta)
    private readonly SurveyDmetaRepository: MongoRepository<SurveyMeta>,
    private readonly pluginManager: XiaojuSurveyPluginManager,
  ) { }
  //初始化一个自动删除过期文件的方法
  async onModuleInit() {
    cron.schedule('0 0 * * *', async () => {

      try {
        const files = await this.SurveyDownloadRepository.find({
          where: {
            'curStatus.status': {
              $ne: RECORD_STATUS.REMOVED,
            },
        }
      });
        const now = Date.now();

        for (const file of files) {
          if (!file.downloadTime || !file.filePath) {
            continue;
          }

          const fileSaveDate = Number(file.downloadTime);
          const diffDays = (now-fileSaveDate) / (1000 * 60 * 60 * 24);

          if (diffDays > 10) {
            this.deleteDownloadFile({
              owner: file.onwer,
              fileName: file.filename,
            })
          }
        }
      } catch (err) {
        console.error('删除文件错误', err);
      }
    });
  }
  

  async createDownload({
    surveyId,
    responseSchema,
  }: {
    surveyId: string;
    responseSchema: ResponseSchema;
  }) {
    const [surveyMeta] = await this.SurveyDmetaRepository.find({
      where: {
        surveyPath: responseSchema.surveyPath,
      },
    });
    const newSurveyDownload = this.SurveyDownloadRepository.create({
      pageId: surveyId,
      surveyPath: responseSchema.surveyPath,
      title: responseSchema.title,
      fileSize: "计算中",
      downloadTime: String(Date.now()),
      onwer: surveyMeta.owner,
    });
    newSurveyDownload.curStatus = {
      status: RECORD_STATUS.COMOPUTETING,
      date: Date.now(),
    };
    return (await this.SurveyDownloadRepository.save(newSurveyDownload))._id;

  }

  private formatHead(listHead = []) {
    const head = []

    listHead.forEach((headItem) => {
      head.push({
        field: headItem.field,
        title: headItem.title
      })

      if (headItem.othersCode?.length) {
        headItem.othersCode.forEach((item) => {
          head.push({
            field: item.code,
            title: `${headItem.title}-${item.option}`
          })
        })
      }
    })

    return head
  }
  async getDownloadPath({
    surveyId,
    responseSchema,
    isDesensitive,
    id,
  }: {
    surveyId: string;
    responseSchema: ResponseSchema;
    isDesensitive: boolean;
    id: object;
  }) {
    const dataList = responseSchema?.code?.dataConf?.dataList || [];
    const Head = getListHeadByDataList(dataList);
    const listHead=this.formatHead(Head);
    const dataListMap = keyBy(dataList, 'field');
    const where = {
      pageId: surveyId,
      'curStatus.status': {
        $ne: 'removed',
      },
    };
    const [surveyResponseList, total] =
      await this.surveyResponseRepository.findAndCount({
        where,
        order: {
          createDate: -1,
        },
      });
    const [surveyMeta] = await this.SurveyDmetaRepository.find({
      where: {
        surveyPath: responseSchema.surveyPath,
      },
    });
    const listBody = surveyResponseList.map((submitedData) => {
      const data = submitedData.data;
      const dataKeys = Object.keys(data);

      for (const itemKey of dataKeys) {
        if (typeof itemKey !== 'string') {
          continue;
        }
        if (itemKey.indexOf('data') !== 0) {
          continue;
        }
        // 获取题目id
        const itemConfigKey = itemKey.split('_')[0];
        // 获取题目
        const itemConfig: DataItem = dataListMap[itemConfigKey];
        // 题目删除会出现，数据列表报错
        if (!itemConfig) {
          continue;
        }
        // 处理选项的更多输入框
        if (
          this.radioType.includes(itemConfig.type) &&
          !data[`${itemConfigKey}_custom`]
        ) {
          data[`${itemConfigKey}_custom`] =
            data[`${itemConfigKey}_${data[itemConfigKey]}`];
        }
        // 将选项id还原成选项文案
        if (
          Array.isArray(itemConfig.options) &&
          itemConfig.options.length > 0
        ) {
          const optionTextMap = keyBy(itemConfig.options, 'hash');
          data[itemKey] = Array.isArray(data[itemKey])
            ? data[itemKey]
              .map((item) => optionTextMap[item]?.text || item)
              .join(',')
            : optionTextMap[data[itemKey]]?.text || data[itemKey];
        }
      }
      return {
        ...data,
        difTime: (submitedData.difTime / 1000).toFixed(2),
        createDate: moment(submitedData.createDate).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      };
    });
    if (isDesensitive) {
      // 脱敏
      listBody.forEach((item) => {
        this.pluginManager.triggerHook('desensitiveData', item);
      });
    }

    let titlesCsv = listHead.map(question => `"${question.title.replace(/<[^>]*>/g, '')}"`).join(',') + '\n';
    // 获取工作区根目录的路径
    const rootDir = process.cwd();
    const timestamp = Date.now();
    const fs = require('fs');
    const path = require('path');
    const filePath = join(rootDir, 'download',`${surveyMeta.owner}`, `${surveyMeta.title}_${timestamp}.csv`);
    const dirPath = path.dirname(filePath);
    fs.mkdirSync(dirPath, { recursive: true });
    listBody.forEach(row => {
      const rowValues = listHead.map(head => {
        const value = row[head.field];
        if (typeof value === 'string') {
          // 处理字符串中的特殊字符
          return `"${value.replace(/"/g, '""').replace(/<[^>]*>/g, '')}"`;
        }
        return `"${value}"`; // 其他类型的值（数字、布尔等）直接转换为字符串
      });
      titlesCsv += rowValues.join(',') + '\n';
    });
    const BOM = '\uFEFF';
    let size = 0;
    const newSurveyDownload= await this.SurveyDownloadRepository.findOne({
      where: {
        _id: id,
    }
  });
    fs.writeFile(filePath, BOM + titlesCsv, { encoding: 'utf8' }, (err) => {
      if (err) {
        console.error('保存文件时出错:', err);
      } else {
        console.log('文件已保存:', filePath);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('获取文件大小时出错:', err);
          } else {
            console.log('文件大小:', stats.size);
            size = stats.size;
            const filename = `${surveyMeta.title}_${timestamp}.csv`;
            const fileType = 'csv';
            newSurveyDownload.pageId= surveyId,
            newSurveyDownload.surveyPath=responseSchema.surveyPath,
            newSurveyDownload.title=responseSchema.title,
            newSurveyDownload.filePath= filePath,
            newSurveyDownload.filename=filename,
            newSurveyDownload.fileType=fileType,
            newSurveyDownload.fileSize=String(size),
            newSurveyDownload.downloadTime=String(Date.now()),
            newSurveyDownload.onwer=surveyMeta.owner
            newSurveyDownload.curStatus = {
              status: RECORD_STATUS.NEW,
              date: Date.now(),
            };
            
            this.SurveyDownloadRepository.save(newSurveyDownload);
          }
        });
      }
    });


    return {
      filePath
    }
  }

  async getDownloadList({
    ownerId,
    page,
    pageSize,
  }: {
    ownerId: string;
    page: number;
    pageSize: number;
  }) {
    const where = {
      onwer: ownerId,
      'curStatus.status': {
        $ne: RECORD_STATUS.REMOVED,
      },
    };
    const [surveyDownloadList, total] =
      await this.SurveyDownloadRepository.findAndCount({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        order: {
          createDate: -1,
        },
      });
    const listBody = surveyDownloadList.map((data) => {
      return {
        _id: data._id,
        filename: data.filename,
        fileType: data.fileType,
        fileSize: data.fileSize,
        downloadTime: data.downloadTime,
        curStatus: data.curStatus.status,
        owner: data.onwer,
      };
    });
    return {
      total,
      listBody,
    };
  }
  async test({
    fileName,
  }: {
    fileName: string;
  }) {return null;}

  async deleteDownloadFile({
    owner,
    fileName,
  }: {
    owner: string;
    fileName: string;
  }) {
    const a=fileName;
    const where = {
      filename: fileName,
    };
  
    const [surveyDownloadList] =
      await this.SurveyDownloadRepository.find({
        where,
      });
    if (surveyDownloadList.curStatus.status === RECORD_STATUS.REMOVED) {
      return 0;
    }
    
    const newStatusInfo = {
      status: RECORD_STATUS.REMOVED,
      date: Date.now(),
    };
    surveyDownloadList.curStatus = newStatusInfo;
    // if (Array.isArray(survey.statusList)) {
    //   survey.statusList.push(newStatusInfo);
    // } else {
    //   survey.statusList = [newStatusInfo];
    // }
    const rootDir = process.cwd(); // 获取当前工作目录
    const filePath = join(rootDir, 'download', owner,fileName);
    try {
      await promises.unlink(filePath);
      console.log(`File at ${filePath} has been successfully deleted.`);
    } catch (error) {
      console.error(`Failed to delete file at ${filePath}:`, error);
    }
    await this.SurveyDownloadRepository.save(surveyDownloadList);
    return {
      code: 200,
      data: {
        message: '删除成功',
      },
    };
  }
}