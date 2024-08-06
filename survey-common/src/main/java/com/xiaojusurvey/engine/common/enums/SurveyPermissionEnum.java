package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

/**
 * @author zhongbo
 */

@Getter
public enum SurveyPermissionEnum {
    SURVEY_CONF_MANAGE("SURVEY_CONF_MANAGE"),
    SURVEY_RESPONSE_MANAGE("SURVEY_RESPONSE_MANAGE"),
    SURVEY_COOPERATION_MANAGE("SURVEY_COOPERATION_MANAGE");

    private final String permissionDescription;

    SurveyPermissionEnum(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }
}
