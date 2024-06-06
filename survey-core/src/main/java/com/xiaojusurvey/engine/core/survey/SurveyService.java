package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.rpc.IdResult;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷Service
 */
public interface SurveyService {
    IdResult<String> createSurvey(SurveyMeta surveyMeta);
}
