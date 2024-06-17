package com.xiaojusurvey.engine.core.survey.vo;

import lombok.Data;

import java.util.Map;

/**
 * @Author: maple
 * @CreateTime: 2024/6/15 20:16
 * @Description:
 */
@Data
public class SurveyHistoryOutVO {

    private String id;

    private String type;

    private Long createDate;

    private Map<String, Object> operator;
}
