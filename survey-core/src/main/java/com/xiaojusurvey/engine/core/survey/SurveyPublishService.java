package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.survey.SurveyPublish;

/**
 * 问卷发布配置服务
 *
 * @author likui63@163.com
 * @date: 2024/7/27 13:54
 */
public interface SurveyPublishService {

    boolean save(SurveyPublish surveyPublish);

    boolean delete(SurveyMeta param);

    SurveyPublish getByPageId(String surveyId);
}
