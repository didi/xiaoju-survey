package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;

/**
 * 问卷提交服务
 *
 * @author zsh
 * @date: 2025/1/21
 */
public interface SurveyResponseService {


    SurveyResponseSchemaOutVO getResponseSchema(String surveyPath);
}
