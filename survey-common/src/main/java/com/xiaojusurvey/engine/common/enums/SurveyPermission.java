package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

/**
 * @author zhongbo
 */

@Getter
public enum SurveyPermission {
    SURVEY_CONF_MANAGE("SURVEY_CONF_MANAGE"),
    SURVEY_RESPONSE_MANAGE("SURVEY_RESPONSE_MANAGE"),
    SURVEY_COOPERATION_MANAGE("SURVEY_COOPERATION_MANAGE");

    private final String permissionDescription;

    SurveyPermission(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }
}
