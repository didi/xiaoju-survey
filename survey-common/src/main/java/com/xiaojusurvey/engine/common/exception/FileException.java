package com.xiaojusurvey.engine.common.exception;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;

public class FileException extends BaseException {
    public FileException(String errorMsg, Integer code) {
        super(errorMsg, code);
    }

    public FileException(String errorMsg, Integer code, Throwable t) {
        super(errorMsg, code, t);
    }

    public FileException(RespErrorCode errorCode) {
        super(errorCode.getMessage(), errorCode.getCode());
    }
}
