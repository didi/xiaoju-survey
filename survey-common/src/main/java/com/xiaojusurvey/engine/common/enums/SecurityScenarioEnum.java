package com.xiaojusurvey.engine.common.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum SecurityScenarioEnum {

    DATA_ANALYSIS("数据分析"),
    DATA_WAREHOUSING("数据入库"),
    ;
    final String description;
}
