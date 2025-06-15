package com.xiaojusurvey.engine.common.enums;

public enum SecurityScenarioEnum {
    DATA_ANALYSIS("数据分析"),
    DATA_WAREHOUSING("数据入库");

    private final String description;

    SecurityScenarioEnum(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
