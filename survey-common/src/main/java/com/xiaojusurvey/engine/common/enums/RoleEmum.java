package com.xiaojusurvey.engine.common.enums;

/**
 * @description: 用户角色枚举
 * @author: wangchenglong
 * @time: 2024/7/24 14:47
 */
public enum RoleEmum {

    USER(0, "user"),

    ADMIN(1, "admin");

    private final Integer state;

    private final String value;

    RoleEmum(Integer state, String value) {
        this.state = state;
        this.value = value;
    }

    public Integer getState() {
        return this.state;
    }

    public String getValue(){
        return this.value;
    }

}
