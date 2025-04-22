package com.xiaojusurvey.engine.common.constants;

import lombok.Getter;

@Getter
public enum RespErrorCode {
    AUTHENTICATION_FAILED(1001, "没有权限"),
    PARAMETER_ERROR(1002, "参数有误"),
    ENCRYPTION_ERROR(1003, "加密异常"),
    USER_EXISTS(2001, "用户已存在"),
    USER_NOT_EXISTS(2002, "用户不存在"),
    USER_PASSWORD_ERROR(2003, "用户名或密码错误"),
    USER_CREDENTIALS_ERROR(2004, "用户凭证错误"),
    NO_SURVEY_PERMISSION(3001, "没有问卷权限"),
    SURVEY_STATUS_TRANSFORM_ERROR(3002, "问卷状态转换报错"),
    SURVEY_TYPE_ERROR(3003, "问卷类型错误"),
    SURVEY_NOT_FOUND(3004, "问卷不存在"),
    SURVEY_CONTENT_NOT_ALLOW(3005, "存在禁用内容"),
    UPDATE_SURVEY_META_ERROR(3006, "修改问卷失败"),
    DELETE_SURVEY_ERROR(3007, "删除问卷失败"),
    PUBLISH_SURVEY_ERROR(3008, "发布问卷失败"),
    CAPTCHA_INCORRECT(4001, "验证码不正确"),
    RESPONSE_SIGN_ERROR(9001, "签名不正确"),
    RESPONSE_CURRENT_TIME_NOT_ALLOW(9002, "当前时间不允许提交"),
    RESPONSE_OVER_LIMIT(9003, "超出限制"),
    RESPONSE_SCHEMA_REMOVED(9004, "问卷已删除"),
    RESPONSE_DATA_DECRYPT_ERROR(9005, "数据解密失败"),
    UPLOAD_FILE_ERROR(5001, "上传文件错误"),
    WHITELIST_ERROR(4002, "白名单校验错误");

    private final int code;
    private final String message;

    RespErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
