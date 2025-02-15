package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

@Getter
public enum OptionQuestionTypeEnum {
    RADIO("radio"),
    CHECKBOX("checkbox"),
    BINARY_CHOICE("binary-choice"),
    VOTE("vote");

    private String type;

    OptionQuestionTypeEnum(String type) {
        this.type = type;
    }
}
