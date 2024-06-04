package com.xiaojusurvey.engine.common.rpc;

import com.xiaojusurvey.engine.common.constant.RpcResultCode;
import com.xiaojusurvey.engine.common.exception.ExceptionDescriptor;
import lombok.Data;

import java.io.Serializable;

@Data
public class RpcResult<T> implements Serializable {

    private static final long serialVersionUID = -3324016200311008221L;

    private Integer code = -1;

    private String msg;

    private T data;

    private Boolean success;
    
    private ExceptionDescriptor exceptionDescriptor;

    public static <T> RpcResult<T> ok() {
        return new RpcResult(RpcResultCode.success, "ok", null, null);
    }
    public static <T> RpcResult<T> ok(T data) {
        return new RpcResult(RpcResultCode.success, "ok", data, null);
    }

    public static <T> RpcResult<T> fail(String msg, ExceptionDescriptor descriptor) {
        return new RpcResult(RpcResultCode.error, msg, null, descriptor);
    }

    public static <T> RpcResult<T> fail(String msg) {
        return new RpcResult(RpcResultCode.error, msg, null, null);
    }

    public static <T> RpcResult<T> fail(ExceptionDescriptor descriptor) {
        return new RpcResult(RpcResultCode.error, descriptor != null ? descriptor.getInfo() : "服务端异常", null, descriptor);
    }

    public RpcResult() {
    }

    public RpcResult(int code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    public RpcResult(int code, String msg, T data, ExceptionDescriptor exceptionDescriptor) {
        this(code, msg, data);
        this.exceptionDescriptor = exceptionDescriptor;
    }
}
