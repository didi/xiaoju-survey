package com.xiaojusurvey.engine.aop;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 全局异常处理器
 */
@RestControllerAdvice
public class ValidatedExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ValidatedExceptionHandler.class);

    /**
     * 自定义验证异常
     */
    @ExceptionHandler(BindException.class)
    public RpcResult handleBindException(BindException e) {
        log.error(e.getMessage(), e);
        String message = e.getAllErrors().get(0).getDefaultMessage();
        return RpcResultUtil.createFailedResult(RespErrorCode.PARAMETER_ERROR.getCode(), message);
    }

}
