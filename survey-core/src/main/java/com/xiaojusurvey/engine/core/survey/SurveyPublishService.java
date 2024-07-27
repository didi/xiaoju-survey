package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;

/**
 * 问卷发布配置服务
 *
 * @author likui63@163.com
 * @date: 2024/7/27 13:54
 */
public interface SurveyPublishService {


    boolean delete(SurveyMeta param);
}
