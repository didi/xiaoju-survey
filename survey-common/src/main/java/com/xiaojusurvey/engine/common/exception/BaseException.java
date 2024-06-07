package com.xiaojusurvey.engine.common.exception;

import lombok.Data;

@Data
public abstract class BaseException extends RuntimeException {

    private static final long serialVersionUID = -1164840626493438227L;
    private String errorMsg;

    private Integer code;

    private String message;

    public BaseException(String errorMsg, Integer code) {
        super(errorMsg);
        this.code=code;
        this.errorMsg=errorMsg;
        this.message=errorMsg;
    }

    public BaseException(String errorMsg, Integer code,Throwable t) {
        super(errorMsg,t);
        this.code=code;
        this.errorMsg=errorMsg;
        this.message=errorMsg;
    }
}
