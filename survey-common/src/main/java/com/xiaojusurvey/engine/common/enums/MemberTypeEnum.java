package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

@Getter
public enum MemberTypeEnum {

    MOBILE("MOBILE"),
    EMAIL("EMAIL");

    private String type;

    MemberTypeEnum(String type) {
        this.type = type;
    }
}
