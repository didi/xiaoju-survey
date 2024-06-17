package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;

public interface SurveyConfService {

    void saveSurveyConfig(SurveyConf surveyConf);

    SurveyConf getSurveyConfBySurveyId(String surveyId);
}
