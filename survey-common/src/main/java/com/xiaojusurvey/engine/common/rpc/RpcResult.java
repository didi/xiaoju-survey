package com.xiaojusurvey.engine.common.rpc;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class RpcResult<T> implements Serializable {

    private static final long serialVersionUID = -3324016200311008221L;

    private Integer code = -1;

    @JsonProperty("message")
    private String msg;

    private String errmsg;

    private T data;

    private Boolean success;
}
