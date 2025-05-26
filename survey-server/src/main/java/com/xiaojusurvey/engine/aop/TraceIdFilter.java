package com.xiaojusurvey.engine.aop;

import com.xiaojusurvey.engine.common.util.TraceIdGeneratorUtil;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class TraceIdFilter implements Filter {

    private static final String TRACE_ID_KEY = "traceId";

    @Resource
    TraceIdGeneratorUtil traceIdGeneratorUtil;


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;

            // 从请求头中获取traceId，如果没有则生成一个
            String traceId = httpRequest.getHeader(TRACE_ID_KEY);
            if (traceId == null || traceId.isEmpty()) {
                // 从请求参数获取（可选）
                traceId = httpRequest.getParameter(TRACE_ID_KEY);
                if (traceId == null || traceId.isEmpty()) {
                    // 生成新的traceId（使用客户端IP）
                    String clientIp = getClientIp(httpRequest);
                    traceId = traceIdGeneratorUtil.generate(clientIp);
                }
            }
            // 将traceId放入MDC
            MDC.put(TRACE_ID_KEY, traceId);
            // 继续处理请求
            chain.doFilter(request, response);
        } finally {
            // 请求处理完成后，清除MDC中的traceId
            MDC.remove(TRACE_ID_KEY);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xffHeader = request.getHeader("X-Forwarded-For");
        if (xffHeader == null) {
            return request.getRemoteAddr();
        }
        return xffHeader.split(",")[0];
    }
}