package com.xiaojusurvey.engine.common.rpc;

import lombok.Data;

import java.io.Serializable;

@Data
public class RpcResult<T> implements Serializable {

    private static final long serialVersionUID = -3324016200311008221L;

    private Integer code = -1;

    private String msg;

    private T data;

    private Boolean success;
}
