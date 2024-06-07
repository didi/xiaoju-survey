package com.xiaojusurvey.engine.interceptor;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Objects;
import java.util.UUID;

@Component
public class LogFilter extends OncePerRequestFilter {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    public static final String TRACE_ID = "traceId";
    public static final int SLOW_TIME_MILLIS = 5000;
    public static final int LOG_MAX_LENGTH = 1024;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String url = null;
        //计时器
        StopWatch watch = null;

        try {
            // 获取url
            url = getCompleteUrl(request);
            // 设置traceId
            String traceId = request.getHeader(TRACE_ID);
            if (StringUtils.isBlank(traceId)) {
                traceId = UUID.randomUUID().toString();
            }
            MDC.put(TRACE_ID, traceId);

            request = new ContentCachingRequestWrapper(request);
            response = new ContentCachingResponseWrapper(response);

            watch = new StopWatch();
            watch.start();

            logger.info("Start request, ip:{} host:{} url:{} body:{}", getRemoteIP(request),
                    request.getRemoteHost(), url, getRequestBody(request));
            filterChain.doFilter(request, response);

        } finally {
            if (watch != null) {
                watch.stop();
                if (watch.getTotalTimeMillis() > SLOW_TIME_MILLIS && !url.endsWith(".js")) {
                    logger.error("End slow request, ip:{} host:{} url:{} cost:{} ms resp:{}", getRemoteIP(request),
                            request.getRemoteHost(), url, watch.getTotalTimeMillis(), getResponseBody(response));
                } else {
                    logger.info("End request, ip:{} host:{} url:{} cost:{} ms resp:{}", getRemoteIP(request),
                            request.getRemoteHost(), url, watch.getTotalTimeMillis(), getResponseBody(response));
                }
            }
            MDC.clear();
            updateResponse(response);
        }
    }


    private String getRequestBody(HttpServletRequest request) {
        ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper == null) {
            return "";
        }
        return getBody(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
    }

    /**获取body 避免过长
     *
     * @param contentAsByteArray 请求体或响应体
     * @param characterEncoding 字符集
     * @return
     */
    private String getBody(byte[] contentAsByteArray, String characterEncoding) {
        if (contentAsByteArray == null) return null;
        String body = "";
        try {
            body = new String(contentAsByteArray, characterEncoding);
            // 最多打印1024字符
            if (body.length() > LOG_MAX_LENGTH) {
                body = body.substring(0, LOG_MAX_LENGTH) + "...";
            }
        } catch (Exception e) {
            //
        }
        return body;
    }

    private String getResponseBody(HttpServletResponse response) {
        ContentCachingResponseWrapper responseWrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        if (responseWrapper == null) {
            return "";
        }
        return getBody(responseWrapper.getContentAsByteArray(), "UTF-8");
    }

    private void updateResponse(HttpServletResponse response) throws IOException {
        ContentCachingResponseWrapper responseWrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        Objects.requireNonNull(responseWrapper).copyBodyToResponse();
    }

    private String getCompleteUrl(HttpServletRequest request) {
        String url = request.getRequestURL().toString();
        String queryString = "";
        if (StringUtils.isNotEmpty(request.getQueryString())) {
            try {
                queryString = URLDecoder.decode(request.getQueryString(), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                logger.error("URLDecoder.decode error:" + e.getMessage(), e);
            }
            url = url + "?" + queryString;
        }
        return url;
    }


    private String getRemoteIP(HttpServletRequest request) {
        if (request.getHeader("x-forwarded-for") == null) {
            return request.getRemoteAddr();
        }
        return request.getHeader("x-forwarded-for");
    }
}
