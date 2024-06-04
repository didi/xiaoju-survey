package com.xiaojusurvey.engine.common.util;

import com.xiaojusurvey.engine.common.rpc.RpcResult;

public class RpcResultUtil {

    private static final int SUCCESS = 200;
    static final int SYSTEM_ERROR = -1;
    private static final String DEFAULT_SUCC_MSG = "success";

    public static <T> RpcResult<T> createSuccessResult(T data) {
        return createSuccessResult(data, DEFAULT_SUCC_MSG);
    }

    public static <T> RpcResult<T> createSuccessResult(T data, String message) {
        RpcResult<T> result = new RpcResult<>();
        result.setCode(SUCCESS);
        result.setMsg(message);
        result.setData(data);
        result.setSuccess(Boolean.TRUE);
        return result;
    }

    public static <T> RpcResult<T> createFailedResult(T failed, Integer errorCode, String msg) {
        RpcResult<T> result = new RpcResult<>();
        result.setCode(errorCode);
        result.setMsg(msg);
        result.setData(failed);
        result.setSuccess(Boolean.FALSE);
        return result;
    }

    public static <T> RpcResult<T> createFailedResult(int errorCode, String msg) {
        RpcResult<T> result = new RpcResult<>();
        result.setCode(errorCode);
        result.setMsg(msg);
        result.setSuccess(Boolean.FALSE);
        return result;
    }

    public static <T> RpcResult<T> createFailedResult(String msg) {
        RpcResult<T> result = new RpcResult<>();
        result.setCode(SYSTEM_ERROR);
        result.setMsg(msg);
        result.setSuccess(Boolean.FALSE);
        return result;
    }
}
