package com.xiaojusurvey.engine.core.util;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author likui63@163.com
 * @Date 2024/7/30 19:15
 */
public class WebUtils {

    private static final String LOCALHOST = "127.0.0.1";
    private static final String DOT = ".";
    private static final int IP_LEN_0 = 0;
    private static final int IP_LEN_15 = 15;
    private static final String HEADER_X_FORWARDED_FOR = "x-forwarded-for";
    private static final String HEADER_PROXY_CLIENT_IP = "Proxy-Client-IP";
    private static final String HEADER_WL_PROXY_CLIENT_IP = "WL-Proxy-Client-IP";
    private static final String UNKNOWN = "unknown";


    public static ServletRequestAttributes getServletRequestAttributes() {
        return (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    }

    /**
     * 得到当前线程的请求对象
     *
     * @return
     */
    public static HttpServletRequest getHttpServletRequest() {
        return getServletRequestAttributes().getRequest();
    }

    /**
     * 得到访问的ip地址
     *
     * @return
     */
    public static String getRequestIp() {
        HttpServletRequest request = getHttpServletRequest();
        String ip = null;
        ip = request.getHeader(HEADER_X_FORWARDED_FOR);
        if ((ip == null) || (ip.length() == IP_LEN_0) || (UNKNOWN.equalsIgnoreCase(ip))) {
            ip = request.getHeader(HEADER_PROXY_CLIENT_IP);
        }
        if ((ip == null) || (ip.length() == IP_LEN_0) || (UNKNOWN.equalsIgnoreCase(ip))) {
            ip = request.getHeader(HEADER_WL_PROXY_CLIENT_IP);
        }
        if ((ip == null) || (ip.length() == IP_LEN_0) || (UNKNOWN.equalsIgnoreCase(ip))) {
            ip = request.getRemoteAddr();
            if (LOCALHOST.equals(ip)) {
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }
        if ((ip != null) && (ip.length() > IP_LEN_15)) {
            if (ip.indexOf(DOT) > IP_LEN_0) {
                ip = ip.substring(IP_LEN_0, ip.indexOf(","));
            }
        }
        return ip;
    }

    /**
     * 得到当前线程的响应对象
     */
    public static HttpServletResponse getHttpServletResponse() {
        return getServletRequestAttributes().getResponse();
    }

    /**
     * 得到session对象
     */
    public static HttpSession getHttpSession() {
        return getHttpServletRequest().getSession();
    }

    /**
     * 得到servletContext对象
     */
    public static ServletContext getServletContext() {
        return getHttpServletRequest().getServletContext();
    }
}
