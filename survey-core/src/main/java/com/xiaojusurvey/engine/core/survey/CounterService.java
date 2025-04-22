package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.Counter;

public interface CounterService {
    Counter queryCounter(String key, String surveyPath, String type);

    void saveCounter(Counter counter);
}
