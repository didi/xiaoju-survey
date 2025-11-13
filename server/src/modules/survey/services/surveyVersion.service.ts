import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyVersion } from 'src/models/surveyVersion.entity';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { SurveySchemaInterface } from 'src/interfaces/survey';

@Injectable()
export class SurveyVersionService {
  constructor(
    @InjectRepository(SurveyVersion)
    private readonly surveyVersionRepository: MongoRepository<SurveyVersion>,
    @InjectRepository(SurveyConf)
    private readonly surveyConfRepository: MongoRepository<SurveyConf>,
    @InjectRepository(SurveyMeta)
    private readonly surveyMetaRepository: MongoRepository<SurveyMeta>,
  ) {}

  /**
   * 创建新版本
   */
  async createVersion(params: {
    surveyId: string;
    schema: SurveySchemaInterface;
    title: string;
    description?: string;
    changesSummary?: string;
    createdBy: string;
    createdById: string;
    tags?: string[];
  }) {
    const {
      surveyId,
      schema,
      title,
      description = '',
      changesSummary = '',
      createdBy,
      createdById,
      tags = [],
    } = params;

    // 获取当前版本号
    const latestVersion = await this.surveyVersionRepository.findOne({
      where: { surveyId },
      order: { versionNumber: -1 },
    });

    const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

    // 将之前的版本设为非当前版本
    if (latestVersion) {
      latestVersion.isCurrentVersion = false;
      await this.surveyVersionRepository.save(latestVersion);
    }

    // 创建新版本
    const newVersion = this.surveyVersionRepository.create({
      surveyId,
      versionNumber,
      title,
      schema,
      description,
      changesSummary,
      createdBy,
      createdById,
      tags,
      isCurrentVersion: true,
    });

    return this.surveyVersionRepository.save(newVersion);
  }

  /**
   * 保存问卷时自动创建版本
   */
  async autoSaveVersion(params: {
    surveyId: string;
    schema: SurveySchemaInterface;
    createdBy: string;
    createdById: string;
    changesSummary?: string;
  }) {
    const { surveyId, schema, createdBy, createdById, changesSummary } =
      params;

    const surveyMeta = await this.surveyMetaRepository.findOne({
      where: { _id: surveyId },
    });

    if (!surveyMeta) {
      throw new HttpException(
        '问卷不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    return this.createVersion({
      surveyId,
      schema,
      title: surveyMeta.title,
      changesSummary: changesSummary || '自动保存',
      createdBy,
      createdById,
    });
  }

  /**
   * 获取问卷的所有版本
   */
  async getVersionHistory(surveyId: string) {
    const versions = await this.surveyVersionRepository.find({
      where: { surveyId },
      order: { versionNumber: -1 },
    });

    if (!versions || versions.length === 0) {
      throw new HttpException(
        '版本历史不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    return versions.map((v) => ({
      _id: v._id,
      versionNumber: v.versionNumber,
      title: v.title,
      description: v.description,
      createdBy: v.createdBy,
      createdAt: v.createdAt,
      changesSummary: v.changesSummary,
      isCurrentVersion: v.isCurrentVersion,
      tags: v.tags,
    }));
  }

  /**
   * 获取特定版本的详细信息
   */
  async getVersionDetail(versionId: string) {
    const version = await this.surveyVersionRepository.findOne({
      where: { _id: versionId },
    });

    if (!version) {
      throw new HttpException(
        '版本不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    return version;
  }

  /**
   * 恢复到指定版本
   */
  async restoreVersion(params: {
    surveyId: string;
    versionId: string;
    restoreReason: string;
    restorableBy: string;
    restoreableById: string;
  }) {
    const { surveyId, versionId, restoreReason, restorableBy, restoreableById } =
      params;

    // 获取要恢复的版本
    const versionToRestore =
      await this.surveyVersionRepository.findOne({
        where: { _id: versionId },
      });

    if (!versionToRestore || versionToRestore.surveyId !== surveyId) {
      throw new HttpException(
        '版本不存在或不属于此问卷',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    // 获取当前问卷配置
    const surveyConf = await this.surveyConfRepository.findOne({
      where: { pageId: surveyId },
    });

    if (!surveyConf) {
      throw new HttpException(
        '问卷配置不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    // 保存当前版本作为新版本（备份）
    const backupVersion = await this.createVersion({
      surveyId,
      schema: surveyConf.code,
      title: `备份 - 恢复前`,
      description: `在恢复到版本 ${versionToRestore.versionNumber} 前创建的备份`,
      changesSummary: restoreReason,
      createdBy: restorableBy,
      createdById: restoreableById,
    });

    // 更新问卷配置为恢复的版本
    surveyConf.code = versionToRestore.schema;
    await this.surveyConfRepository.save(surveyConf);

    // 创建恢复后的新版本记录
    const restoredVersion = await this.createVersion({
      surveyId,
      schema: versionToRestore.schema,
      title: `从版本 ${versionToRestore.versionNumber} 恢复`,
      description: `恢复原因: ${restoreReason}`,
      changesSummary: `恢复到版本 ${versionToRestore.versionNumber}`,
      createdBy: restorableBy,
      createdById: restoreableById,
      tags: ['restored'],
    });

    return {
      backupVersion,
      restoredVersion,
      message: `成功恢复到版本 ${versionToRestore.versionNumber}`,
    };
  }

  /**
   * 对比两个版本
   */
  async compareVersions(versionId1: string, versionId2: string) {
    const version1 = await this.getVersionDetail(versionId1);
    const version2 = await this.getVersionDetail(versionId2);

    if (!version1 || !version2) {
      throw new HttpException(
        '版本不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    const differences = this.findSchemaDifferences(
      version1.schema,
      version2.schema,
    );

    return {
      version1: {
        versionNumber: version1.versionNumber,
        createdAt: version1.createdAt,
        createdBy: version1.createdBy,
      },
      version2: {
        versionNumber: version2.versionNumber,
        createdAt: version2.createdAt,
        createdBy: version2.createdBy,
      },
      differences,
    };
  }

  /**
   * 找出两个 schema 之间的差异
   */
  private findSchemaDifferences(schema1: any, schema2: any): any[] {
    const differences: any[] = [];

    // 对比问题列表
    const dataList1 = schema1.dataConf?.dataList || [];
    const dataList2 = schema2.dataConf?.dataList || [];

    const maxLength = Math.max(dataList1.length, dataList2.length);

    for (let i = 0; i < maxLength; i++) {
      const question1 = dataList1[i];
      const question2 = dataList2[i];

      if (!question1) {
        differences.push({
          type: 'deleted',
          index: i,
          question: question2,
          description: `删除了问题: ${question2.title}`,
        });
      } else if (!question2) {
        differences.push({
          type: 'added',
          index: i,
          question: question1,
          description: `新增了问题: ${question1.title}`,
        });
      } else if (JSON.stringify(question1) !== JSON.stringify(question2)) {
        differences.push({
          type: 'modified',
          index: i,
          oldQuestion: question1,
          newQuestion: question2,
          description: `修改了问题: ${question1.title}`,
        });
      }
    }

    return differences;
  }

  /**
   * 删除版本
   */
  async deleteVersion(versionId: string, surveyId: string) {
    const version = await this.surveyVersionRepository.findOne({
      where: { _id: versionId },
    });

    if (!version || version.surveyId !== surveyId) {
      throw new HttpException(
        '版本不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    if (version.isCurrentVersion) {
      throw new HttpException(
        '不能删除当前版本',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    await this.surveyVersionRepository.remove(version);
    return { message: '版本已删除' };
  }

  /**
   * 标记版本
   */
  async tagVersion(versionId: string, surveyId: string, tag: string) {
    const version = await this.surveyVersionRepository.findOne({
      where: { _id: versionId },
    });

    if (!version || version.surveyId !== surveyId) {
      throw new HttpException(
        '版本不存在',
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }

    if (!version.tags) {
      version.tags = [];
    }

    if (!version.tags.includes(tag)) {
      version.tags.push(tag);
      await this.surveyVersionRepository.save(version);
    }

    return version;
  }

  /**
   * 获取版本的元数据统计
   */
  async getVersionStats(surveyId: string) {
    const versions = await this.surveyVersionRepository.find({
      where: { surveyId },
    });

    if (!versions || versions.length === 0) {
      return {
        totalVersions: 0,
        currentVersion: null,
      };
    }

    const currentVersion = versions.find((v) => v.isCurrentVersion);

    return {
      totalVersions: versions.length,
      currentVersion: currentVersion?.versionNumber || 1,
      oldestVersion: versions[versions.length - 1].versionNumber,
      contributors: [...new Set(versions.map((v) => v.createdBy))],
      lastModified: currentVersion?.createdAt,
    };
  }
}
