package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

/**
 * @Author: WYX
 * @CreateTime: 2025/9/1
 * @Description:
 */
@Getter
public enum QuestionTypeEnum {
    // 单行输入框
    TEXT("text"),

    // 多行输入框
    TEXTAREA("textarea"),

    // 单项选择
    RADIO("radio"),

    // 多项选择
    CHECKBOX("checkbox"),

    // 多项选择
    BINARY_CHOICE("binary-choice"),

    // 评分
    RADIO_STAR("radio-star"),

    // nps评分
    RADIO_NPS("radio-nps"),

    // 投票
    VOTE("vote"),

    // 多级联动
    CASCADER("cascader");

    private final String type;

    QuestionTypeEnum(String type) {
        this.type = type;
    }

    /**
     * 获取支持聚合统计的问题类型列表
     */
    public static QuestionTypeEnum[] getAggerationSupportTypes() {
        return new QuestionTypeEnum[]{
                RADIO, CHECKBOX, BINARY_CHOICE, RADIO_STAR, RADIO_NPS, VOTE, CASCADER
        };
    }

    /**
     * 根据类型字符串获取枚举
     */
    public static QuestionTypeEnum fromType(String type) {
        for (QuestionTypeEnum questionType : values()) {
            if (questionType.type.equals(type)) {
                return questionType;
            }
        }
        return null;
    }

    /**
     * 判断是否为评分类题型
     */
    public boolean isRatingType() {
        return this == QuestionTypeEnum.RADIO_NPS || this == QuestionTypeEnum.RADIO_STAR;
    }

    /**
     * 判断是否为选项类体现
     */
    public boolean isOptionType() {
        return this == RADIO || this == CHECKBOX || this == VOTE || this == BINARY_CHOICE;
    }

}
