package com.xiaojusurvey.engine.common.exception;

public class StackSummary {


    private String targetClass;
    private String targetMethod;
    private Integer lineNo;
    public StackSummary() {
    }

    public StackSummary(StackTraceElement stack) {
        this.targetClass=stack.getClassName();
        this.targetMethod=stack.getMethodName();
        this.lineNo=stack.getLineNumber();
    }


    public String getTargetClass() {
        return targetClass;
    }

    public void setTargetClass(String targetClass) {
        this.targetClass = targetClass;
    }

    public String getTargetMethod() {
        return targetMethod;
    }

    public void setTargetMethod(String targetMethod) {
        this.targetMethod = targetMethod;
    }

    public Integer getLineNo() {
        return lineNo;
    }

    public void setLineNo(Integer lineNo) {
        this.lineNo = lineNo;
    }
}