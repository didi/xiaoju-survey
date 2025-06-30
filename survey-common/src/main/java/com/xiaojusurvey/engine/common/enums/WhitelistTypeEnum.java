package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

@Getter
public enum WhitelistTypeEnum {
    ALL("ALL"),
    MEMBER("MEMBER"),
    CUSTOM("CUSTOM");
    private String type;

    WhitelistTypeEnum(String type) {
        this.type = type;
    }
}
