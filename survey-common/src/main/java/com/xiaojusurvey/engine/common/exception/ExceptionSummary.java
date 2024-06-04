package com.xiaojusurvey.engine.common.exception;

public class ExceptionSummary {


    private String exceptionType;
    private String message;

    public ExceptionSummary() {
    }
    public ExceptionSummary(Throwable ex) {
        this.exceptionType=ex.getClass().getName();
        this.message=ex.getMessage();
    }
    public String getExceptionType() {
        return exceptionType;
    }

    public void setExceptionType(String exceptionType) {
        this.exceptionType = exceptionType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
