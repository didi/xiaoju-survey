package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.enums.HistoryTypeEnum;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.config.BannerDataConfig;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyInfoInVO;
import com.xiaojusurvey.engine.core.survey.vo.SurveyInfoOutVO;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷Controller
 */
@RequestMapping("/api/survey")
@RestController
public class SurveyController {
    @Resource
    private SurveyService surveyService;

    @Resource
    private SurveyConfService surveyConfService;

    @Resource
    private SurveyHistoryService surveyHistoryService;

    @Resource
    private BannerDataConfig bannerDataConfig;

    /**
     * 创建问卷
     */
    @RequestMapping("/createSurvey")
    public RpcResult<IdResult> createSurvey(@Validated @RequestBody SurveyMeta surveyMeta) {
        return RpcResultUtil.createSuccessResult(surveyService.createSurvey(surveyMeta));
    }

    /**
     * 获取banner数据
     */
    @GetMapping("/getBannerData")
    public RpcResult<Object> getBannerData() {
        return RpcResultUtil.createSuccessResult(bannerDataConfig.getBannerData());
    }

    /**
     * 更新问卷
     */
    @PostMapping("/updateConf")
    public RpcResult<Boolean> updateConf(HttpServletRequest request,
                                         @RequestBody @Validated(SurveyInfoInVO.UpdateConf.class) SurveyInfoInVO infoInVO) {
        SurveyConf surveyConf  = new SurveyConf();
        surveyConf.setCode(infoInVO.getConfigData());
        surveyConf.setPageId(infoInVO.getSurveyId());
        surveyConfService.saveSurveyConfig(surveyConf);

        User user = (User) request.getAttribute("user");
        SurveyHistory surveyHistory = new SurveyHistory();
        surveyHistory.setPageId(infoInVO.getSurveyId());
        surveyHistory.setType(HistoryTypeEnum.DAILY_HIS.getHistoryType());
        surveyHistory.setSchema(infoInVO.getConfigData());
        surveyHistory.setCreateDate(System.currentTimeMillis());
        surveyHistory.setUpdateDate(System.currentTimeMillis());
        Map<String, Object> operator = new HashMap<>(2);
        operator.put("_id", user.getId());
        operator.put("username", user.getUsername());
        surveyHistory.setOperator(operator);
        surveyHistoryService.addHistory(surveyHistory);
        return RpcResultUtil.createSuccessResult(true);
    }

    /**
     * 获取问卷
     */
    @GetMapping("/getSurvey")
    public RpcResult<SurveyInfoOutVO> getSurvey(@RequestParam("surveyId") @NotBlank String surveyId) {
        SurveyMeta surveyMeta = surveyService.getSurveyMeta(surveyId);
        if (null == surveyMeta) {
            return RpcResultUtil.createFailedResult(RespErrorCode.SURVEY_NOT_FOUND.getCode(), RespErrorCode.SURVEY_NOT_FOUND.getMessage());
        }
        SurveyConf surveyConf = surveyConfService.getSurveyConfBySurveyId(surveyId);
        return RpcResultUtil.createSuccessResult(new SurveyInfoOutVO(surveyMeta, surveyConf));
    }

    /**
     * 修改问卷
     */
    @PostMapping("/updateMeta")
    public RpcResult updateMeta(@RequestBody @Validated(SurveyMetaUpdateParam.Update.class) SurveyMetaUpdateParam param) {
        boolean flag  = surveyService.updateMeta(param);
        if (flag) {
            return RpcResultUtil.createSuccessResult(null);
        }
        return RpcResultUtil.createFailedResult(RespErrorCode.UPDATE_SURVEY_META_ERROR.getCode(),RespErrorCode.UPDATE_SURVEY_META_ERROR.getMessage());
    }

    /**
     * 删除问卷
     * @param param
     * @return
     */
    @PostMapping("/deleteSurvey")
    public RpcResult deleteSurvey(@RequestBody @Validated(SurveyMetaUpdateParam.Delete.class) SurveyMetaUpdateParam param) {
        boolean flag  = surveyService.deleteSurvey(param.getSurveyId());
        if (flag) {
            return RpcResultUtil.createSuccessResult(null);
        }
        return RpcResultUtil.createFailedResult(RespErrorCode.DELETE_SURVEY_ERROR.getCode(),RespErrorCode.DELETE_SURVEY_ERROR.getMessage());
    }
}
