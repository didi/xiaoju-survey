import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { SurveyMeta } from '../../../models/surveyMeta.entity';
import { RecycleBinListDto } from '../dto/recycleBin.dto';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class RecycleBinService {
  private readonly logger = new Logger(RecycleBinService.name);
  
  constructor(
    @InjectRepository(SurveyMeta)
    private readonly surveyMetaRepository: Repository<SurveyMeta>,
    @InjectRepository(ResponseSchema)
      private readonly responseSchemaRepository: MongoRepository<ResponseSchema>,
  ) {}
  

  /**
   * 获取回收站问卷列表
   * @param userId 用户ID
   * @param dto 分页参数
   * @returns 回收站问卷列表和总数
   */
  async getRecycleBinList(userId: string, dto: RecycleBinListDto) {
    const { value: params } = RecycleBinListDto.validate(dto);
    const { curPage, pageSize } = params;
    const skip = (curPage - 1) * pageSize;

    // 查询已删除的问卷
    const [list, count] = await this.surveyMetaRepository.findAndCount({
      where: {
        isDeleted: true,
        ownerId: userId,
      },
      select: ['_id', 'title', 'createdAt', 'deletedAt', 'ownerId'],
      skip,
      take: pageSize,
      order: {
        deletedAt: 'DESC', // 按删除时间降序排列
      },
    });

    return { list, count };
  }

  /**
   * 恢复问卷
   * @param userId 用户ID
   * @param id 问卷ID
   * @returns 操作结果
   */
  async restoreSurvey(userId: string, id: string) {
    // 查找问卷
    const survey = await this.surveyMetaRepository.findOne({
      where: {
        _id: new ObjectId(id),
        isDeleted: true,
        ownerId: userId,
      },
    });

    if (!survey) {
      throw new NotFoundException('问卷不存在或已被恢复');
    }

    // 恢复问卷
    await this.surveyMetaRepository.update(
      { _id: new ObjectId(id) },
      {
        isDeleted: false,
        deletedAt: null,
      },
    );

    return { success: true };
  }

  /**
   * 永久删除问卷
   * @param userId 用户ID
   * @param id 问卷ID
   * @returns 操作结果
   */
  async permanentDeleteSurvey(userId: string, id: string) {
    // 查找问卷
    const survey = await this.surveyMetaRepository.findOne({
      where: {
        _id: new ObjectId(id),
        isDeleted: true,
        ownerId: userId,
      },
    });

    if (!survey) {
      throw new NotFoundException('问卷不存在');
    }

    // 永久删除问卷
    await this.surveyMetaRepository.delete({ _id: new ObjectId(id) });


    return { success: true };
  }

  /**
   * 将问卷移至回收站
   * @param userId 用户ID
   * @param id 问卷ID
   * @returns 操作结果
   */
  async moveToRecycleBin(userId: string, id: string) {
    try {
      // 先检查 ObjectId 是否有效
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (err) {
        throw new NotFoundException(`无效的问卷ID: ${id}`);
      }
      
      // 查找问卷
      const survey = await this.surveyMetaRepository.findOne({
        where: {
          _id: objectId,
          isDeleted: false,
          ownerId: userId,
        },
      });
      
      if (!survey) {
        throw new NotFoundException('问卷不存在或已在回收站');
      }

      // 移至回收站
      const updateResult = await this.surveyMetaRepository.update(
        { _id: objectId },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
      );
      
      if (updateResult.affected === 0) {
        throw new Error('更新问卷状态失败');
      }
      return { success: true };
    } catch (error) {
      throw error; // 重新抛出异常，让控制器处理
    }
  }
} 