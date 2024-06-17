package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;

import java.util.List;

public interface SurveyHistoryService {

    SurveyHistory addHistory(SurveyHistory surveyHistory);

    List<SurveyHistory> getHistoryList(String surveyId, String historyType);
}
