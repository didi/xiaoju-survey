package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷Service
 */
public interface SurveyService {
    IdResult createSurvey(SurveyMeta surveyMeta);

    SurveyMeta getSurveyMeta(String surveyId);

    boolean updateMeta(SurveyMetaUpdateParam param);
}
