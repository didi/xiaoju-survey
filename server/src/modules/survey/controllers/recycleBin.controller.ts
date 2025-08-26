import { Controller, Get, HttpCode, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Authentication } from "src/guards/authentication.guard";
import { CollaboratorService } from '../services/collaborator.service';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { WorkspaceService } from "src/modules/workspace/services/workspace.service";



@ApiTags('recycleBin')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/recycleBin')
export class RecycleBinController {
  constructor(
    private readonly collaboratorService: CollaboratorService,
    private readonly surveyMetaService: SurveyMetaService,
    private readonly workspaceService: WorkspaceService,
  ) {}

    @Get('')
    @HttpCode(200)
    async getCount(@Request() req) {
        const userId = req.user._id.toString();
        // 查询当前用户协作的问卷
        let cooperationList = []
        cooperationList = await this.collaboratorService.getManageListByUserId({ userId });
        const surveyIdList1 = cooperationList.map((item) => item.surveyId);
        // 查询当前用户参与的空间下的回收站的问卷
        const surveyIdList2 = (await this.workspaceService.getAllSurveyIdListByUserId(userId, true)).data.surveyIdList
        const surveyIdList = [...new Set([...surveyIdList1, ...surveyIdList2])];
        // 查询回收站中所有问卷总数
        const allSurveyTotal =
          await this.surveyMetaService.countSurveyMetaByGroupId({
            userId,
            surveyIdList,
            groupId: 'all',
            isRecycleBin: true,
          });


        return {
            code: 200,
            data: {
                count: allSurveyTotal,
            }
        }
    }
}