package com.xiaojusurvey.engine.core.survey.dto;

import lombok.Data;

@Data
public class SurveyListParamDTO extends BaseQuery {

    private String filter;

    private String order;

    private String workspaceId;
    /**
     * 所有者
     */
    private String username;

    /**
     * 所有者Id
     */
    private String userId;
}
