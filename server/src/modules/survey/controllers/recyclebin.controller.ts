import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, Query, Request, SetMetadata, UseGuards } from '@nestjs/common';
import { Authentication } from '../../../guards/authentication.guard';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { Logger } from '../../../logger';
import { CollaboratorService } from '../services/collaborator.service';
import { SurveyRecycleBinService } from '../services/surveyRecycleBin.service';
import { WorkspaceGuard } from '../../../guards/workspace.guard';
import { PERMISSION as WORKSPACE_PERMISSION } from '../../../enums/workspace';
import { HttpException } from '../../../exceptions/httpException';
import { EXCEPTION_CODE } from '../../../enums/exceptionCode';
import { getFilter, getOrder } from '../../../utils/surveyUtil';
import { GROUP_STATE } from '../../../enums/surveyGroup';
import moment from 'moment/moment';
import { GetSurveyRecycleListDto } from '../dto/getSurveyRecycleList.dto';

@ApiTags('recycleBin')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/recyclebin')
export class RecycleBinController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly surveyRecycleBinService: SurveyRecycleBinService,
    private readonly logger: Logger,
    private readonly collaboratorService: CollaboratorService,
  ) {}

  @Get()
  @HttpCode(200)
  async count(@Request() req) {
    const userId = req.user._id.toString();
    const total = await this.surveyRecycleBinService.countSurveyRecycle(userId);
    return {
      code: 200,
      data: {
        total,
      },
    };
  }

  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_SURVEY])
  @SetMetadata('workspaceId', { optional: true, key: 'query.workspaceId' })
  @UseGuards(Authentication)
  @Get('/getList')
  @HttpCode(200)
  async getList(
    @Query()
    queryInfo: GetSurveyRecycleListDto,
    @Request()
    req,
  ) {
    const { value, error } = GetSurveyRecycleListDto.validate(queryInfo);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const { curPage, pageSize } = value;
    let filter = {};
    if (value.filter) {
      try {
        filter = getFilter(JSON.parse(decodeURIComponent(value.filter)));
      } catch (error) {
        this.logger.error(error.message);
      }
    }

    const userId = req.user._id.toString();

    const data = await this.surveyRecycleBinService.getSurveyRecycleList({
      pageNum: curPage,
      pageSize: pageSize,
      userId,
      filter,
    });

    const res = {
      code: 200,
      data: {
        count: data.count,
        data: data.data.map((item) => {
          const fmt = 'YYYY-MM-DD HH:mm:ss';
          item.createdAt = moment(item.createdAt).format(fmt);
          item.surveyMetaCreateAt = moment(item.surveyMetaCreateAt).format(fmt);
          return item;
        }),
      },
    };

    return res;
  }
}
