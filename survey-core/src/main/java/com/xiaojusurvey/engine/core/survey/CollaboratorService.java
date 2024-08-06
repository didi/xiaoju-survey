package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.core.reslut.IdResult;

public interface CollaboratorService {
    IdResult createSurvey(SurveyMeta surveyMeta);
}
