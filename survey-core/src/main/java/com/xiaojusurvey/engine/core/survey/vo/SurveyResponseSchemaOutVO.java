package com.xiaojusurvey.engine.core.survey.vo;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.Map;

/**
 * 问卷schema
 *
 * @author zsh
 * @date: 2025/1/21
 */
@Data
public class SurveyResponseSchemaOutVO extends BaseEntity implements Serializable  {

    private static final long serialVersionUID = 98953698447536L;

    private  String title;

    private  String surveyPath;

    private String pageId;

    private Map<String, Object> code;
}
