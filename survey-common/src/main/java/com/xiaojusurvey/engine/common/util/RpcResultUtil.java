package com.xiaojusurvey.engine.common.util;

import com.xiaojusurvey.engine.common.rpc.IdResult;
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

    /**
     * 为应对前端单独返回id的情况
     * @param id
     * @return
     * @param <T>
     */
    public static <T> RpcResult<IdResult<T>> createSuccessIdResult(T id) {
        IdResult<T> idResult = new IdResult<>();
        idResult.setId(id);
        RpcResult<IdResult<T>> result = new RpcResult<>();
        result.setCode(SUCCESS);
        result.setData(idResult);
        result.setMsg(DEFAULT_SUCC_MSG);
        result.setSuccess(Boolean.TRUE);
        return result;
    }

}
