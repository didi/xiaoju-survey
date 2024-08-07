package com.xiaojusurvey.engine.common.enums;

/**
 * @description: 状态类型
 * @author: wangchenglong
 * @time: 2024/7/30 16:08
 */
public enum RecordStatusEnum {

    // 新建
    NEW("new"),

    // 编辑
    EDITING("editing"),

    // 暂停
    PAUSING("pausing"),

    // 发布
    PUBLISHED("published"),

    // 删除
    REMOVED("removed"),

    // 从回收站删除
    FORCE_REMOVED("forceRemoved");

    private final String statusType;

    RecordStatusEnum(String statusType) {
        this.statusType = statusType;
    }

    public String getStatusType() {
        return this.statusType;
    }

}
