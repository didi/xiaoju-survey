package com.xiaojusurvey.engine.common.exception;

public class ServiceException extends BaseException {

    public ServiceException(String errorMsg, Integer code) {
        super(errorMsg, code);
    }

    public ServiceException(String errorMsg, Integer code, Throwable t) {
        super(errorMsg, code, t);
    }
}
