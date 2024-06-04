package com.xiaojusurvey.engine.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@Slf4j
public class ApiLogInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String traceId = UUID.randomUUID().toString().replace("-","");
        MDC.put("traceId", traceId);
        request.setAttribute("logBeginTime", System.currentTimeMillis());
        String uri = request.getRequestURI();
        log.info("[stage=request][uri={}] ", uri);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String uri = request.getRequestURI();
        log.info("[stage=response][uri={}] [time={}]", uri, (System.currentTimeMillis() - (Long) request.getAttribute("logBeginTime")));
        if (ex == null) {
            MDC.remove("traceId");
        }
    }
}