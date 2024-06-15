package com.xiaojusurvey.engine.core.survey.vo;

import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author: maple
 * @CreateTime: 2024/6/9 14:16
 * @Description:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SurveyInfoOutVO {

    private SurveyMeta surveyMetaRes;

    private SurveyConf surveyConfRes;
}
