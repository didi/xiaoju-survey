package com.xiaojusurvey.engine.repository.enums;


public enum ErrorEnum {

    PARAM_NULL_ERROR("%s is null", 1);

    private String errorMsg;

    private Integer code;

    ErrorEnum(String errorMsg, Integer code) {
        this.errorMsg = errorMsg;
        this.code = code;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}
