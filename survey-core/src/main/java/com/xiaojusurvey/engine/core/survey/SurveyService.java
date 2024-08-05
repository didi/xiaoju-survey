package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.param.SurveyListParam;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyListVO;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷Service
 */
public interface SurveyService {
    IdResult createSurvey(SurveyMeta surveyMeta);

    SurveyMeta getSurveyMeta(String surveyId);

    boolean updateMeta(SurveyMetaUpdateParam param);

    boolean deleteSurvey(String surveyId);

    /**
     * 发布问卷
     *
     * @param surveyId
     * @return
     */
    boolean publishSurvey(String surveyId);

    /**
     * 获取问卷列表
     * @param param
     * @return
     */
    SurveyListVO getSurveyList(SurveyListParam param);


}
