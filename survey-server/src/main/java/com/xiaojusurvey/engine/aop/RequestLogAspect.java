package com.xiaojusurvey.engine.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
@Slf4j
public class RequestLogAspect {

    /**
     * 请求体最大体积
     */
    private static final long MAX_BODY_SIZE = 1024 * 1024; // 1MB
    @Resource
    private HttpServletRequest request;

    /**
     * 判断请求体是否大于配置
     *
     * @return true-过大
     */
    private boolean isLargeRequest() {
        long contentLength = request.getContentLengthLong();
        return contentLength > MAX_BODY_SIZE;
    }

    /**
     * 根据Content-Type判断参数是否为二进制数据
     *
     * @param contentType 请求类型
     * @return true-二进制数据
     */
    private boolean isBinaryData(String contentType) {
        return contentType != null
                && (contentType.contains("image/")
                || contentType.contains("video/")
                || contentType.contains("application/octet-stream")
                || contentType.contains("application/zip")
                || contentType.contains("audio/")
        );
    }

    @Around("execution(* com.xiaojusurvey.engine.controller.*.*(..))")  // 拦截控制器所有方法
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        // 仅当日志级别为INFO及以上时执行
        if (!log.isInfoEnabled()) {
            return joinPoint.proceed();
        }
        long startTime = System.currentTimeMillis();
        // 获取用户IP和User-Agent
        String clientIp = getClientIp();
        String userAgent = request.getHeader("User-Agent");
        // 跳过请求体太大或请求体为二进制数据的情况
        if (isLargeRequest() || isBinaryData(request.getContentType())) {
            log.info("[REQUEST-IN] : {} {} |  IP: {} | UA: {} | Params is too large size or Param is binary data {}", request.getMethod(), request.getRequestURI(), clientIp,
                    userAgent, request.getContentLength());
        } else {
            // 记录请求入参
            log.info("[REQUEST-IN] : {} {} |  IP: {} | UA: {} | Params: {}", request.getMethod(), request.getRequestURI(), clientIp,
                    userAgent, getRequestParams(joinPoint));
        }
        try {
            // 执行目标方法
            Object result = joinPoint.proceed();
            // 记录响应结果
            long endTime = System.currentTimeMillis();
            log.info("[REQUEST-OUT] : {} {} | Time: {}ms ",
                    request.getMethod(),
                    request.getRequestURI(),
                    endTime - startTime);
            return result;
        } catch (Exception e) {
            // 记录异常信息
            long endTime = System.currentTimeMillis();
            log.error("[REQUEST-ERROR] : {} {} | Time: {}ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    endTime - startTime,
                    e);
            throw e;
        }
    }

    /**
     * 获取方法请求的参数
     *
     * @param joinPoint AOP通知体
     * @return 方法参数及其值
     */
    private Map<String, Object> getRequestParams(ProceedingJoinPoint joinPoint) {
        Map<String, Object> requestParams = new HashMap<>();
        // 1. 获取URL参数
        Map<String, String[]> parameterMap = request.getParameterMap();
        if (!parameterMap.isEmpty()) {
            requestParams.put("query", parameterMap);
        }
        // 2. 获取方法参数
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();
        if (parameterNames != null && parameterNames.length > 0) {
            Map<String, Object> methodParams = new HashMap<>();
            for (int i = 0; i < parameterNames.length; i++) {
                methodParams.put(parameterNames[i], args[i]);
            }
            requestParams.put("method", methodParams);
        }
        return requestParams;
    }

    /**
     * 获取请求的IP
     *
     * @return IP地址
     */
    private String getClientIp() {
        String xffHeader = request.getHeader("X-Forwarded-For");
        if (xffHeader == null) {
            return request.getRemoteAddr();
        }
        return xffHeader.split(",")[0].trim();
    }
}