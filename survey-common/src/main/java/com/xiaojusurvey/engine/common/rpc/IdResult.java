package com.xiaojusurvey.engine.common.rpc;

import lombok.Data;

import java.io.Serializable;

@Data
public class IdResult<T> implements Serializable {
    private T id;

}
