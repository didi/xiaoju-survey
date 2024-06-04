package com.xiaojusurvey.engine.aop;

import com.xiaojusurvey.engine.common.exception.ExceptionDescriptorBuilder;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private ExceptionDescriptorBuilder exDesBuilder;

    private void logError(Throwable e, HttpServletRequest request) {
        String url = request.getRequestURI();
        log.error("请求地址:{},错误信息:{}", url, e.getMessage(), e);
    }

    @ExceptionHandler(RuntimeException.class)
    public RpcResult<Void> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        logError(e, request);
        return RpcResult.fail(exDesBuilder.build(e, request));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public RpcResult<String> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        logError(e, request);
        return RpcResult.fail(exDesBuilder.build(e, request));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public RpcResult<String> handleHttpRequestMethodNotSupported(HttpMessageNotReadableException e, HttpServletRequest request) {
        logError(e, request);
        return RpcResult.fail("参数解析错误", exDesBuilder.build(e, request));
    }

    @ExceptionHandler(BindException.class)
    public RpcResult<String> handleBindException(BindException e, HttpServletRequest request) {
        logError(e, request);
        String message = e.getAllErrors().get(0).getDefaultMessage();
        return RpcResult.fail(message, exDesBuilder.build(e, request));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Object handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        logError(e, request);
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        return RpcResult.fail(message, exDesBuilder.build(e, request));
    }

    /**
     * 数据库唯一约束冲突异常
     */
    @ExceptionHandler(DuplicateKeyException.class)
    public RpcResult<String> handleDuplicateKeyException(DuplicateKeyException e, HttpServletRequest request) {
        logError(e, request);
        return RpcResult.fail("数据重复，不允许操作", exDesBuilder.build(e, request));
    }



    @ExceptionHandler(SQLException.class)
    public RpcResult<String> handleSQLException(SQLException e, HttpServletRequest request) {
        logError(e, request);
        return RpcResult.fail("sql 异常", exDesBuilder.build(e, request));
    }


}
