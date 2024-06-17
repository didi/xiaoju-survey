package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

/**
 * @Author: maple
 * @CreateTime: 2024/6/10 21:28
 * @Description: 历史记录枚举值
 */
@Getter
public enum HistoryTypeEnum {

    //保存历史
    DAILY_HIS("dailyHis"),

    //发布历史
    PUBLISH_HIS("publishHis");

    private final String historyType;

    HistoryTypeEnum(String historyType) {
        this.historyType = historyType;
    }

}
