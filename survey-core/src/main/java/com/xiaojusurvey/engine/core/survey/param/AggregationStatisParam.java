package com.xiaojusurvey.engine.core.survey.param;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @Author: WYX
 * @CreateTime: 2025/9/2
 * @Description: 分题统计请求参数
 */
@Data
public class AggregationStatisParam {

    @NotBlank(message = "问卷ID不为空")
    private String surveyId;
}
