package com.xiaojusurvey.engine.common.enums;

import com.xiaojusurvey.engine.common.entity.Status;

/**
 * Survey状态
 *
 * @author likui63@163.com
 * @Date 2024/7/26 23:32
 */
public enum SurveyStatusEnum {
    NEW("new"),
    EDITING("editing"),
    PAUSING("pausing"),
    PUBLISHED("published"),
    REMOVED("removed"),
    FORCE_REMOVED("FORCE_REMOVED");

    private String status;

    private SurveyStatusEnum(String status){
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }


    public static Status getSpecStatus(SurveyStatusEnum statusEnum){
        Status newStatus = new Status();
        newStatus.setStatus(statusEnum.getStatus());
        newStatus.setDate(System.currentTimeMillis());
        return newStatus;
    }

}
