package com.xiaojusurvey.engine.common.exception;

public class DaoException extends BaseException{

    public DaoException(String errorMsg, Integer code) {
        super(errorMsg, code);
    }

    public DaoException(String errorMsg, Integer code, Throwable t) {
        super(errorMsg, code, t);
    }
}
