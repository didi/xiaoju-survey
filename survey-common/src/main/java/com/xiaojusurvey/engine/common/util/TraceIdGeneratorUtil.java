package com.xiaojusurvey.engine.common.util;

import org.springframework.stereotype.Component;

import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class TraceIdGeneratorUtil {

    private static final int MIN_COUNT = 1000;
    private static final int MAX_COUNT = 9000;
    private final AtomicInteger count = new AtomicInteger(MIN_COUNT);
    private final String processIdPart;

    public TraceIdGeneratorUtil() {
        String processName = ManagementFactory.getRuntimeMXBean().getName();
        String pid = processName.split("@")[0];
        this.processIdPart = pid.length() > 5
                ? pid.substring(pid.length() - 5)
                : String.format("%05d", Integer.parseInt(pid));
    }

    /**
     * 根据ip地址生成traceId
     *
     * @param ip ip地址
     * @return traceId
     */
    public String generate(String ip) {
        // 处理IP地址
        String processedIp = processIp(ip);

        // 获取当前时间戳（毫秒）
        String timestamp = String.valueOf(Instant.now().toEpochMilli());

        // 获取自增计数
        String countStr = getNextCount();

        // 组合生成TraceID
        return processedIp + timestamp + countStr + processIdPart;
    }

    private static final String IPV6_COMPRESSED_MARKER = "::";
    private static final String IPV6_PREFIX = "::ffff:";
    private static final String IPV6_LOCALHOST = "::1";
    private static final String IPV4_SEPARATOR = "\\.";
    private static final String IPV6_SEPARATOR = ":";
    private static final String IPV4_FORMAT = "%02x";
    private static final String IPV6_FORMAT = "%04x";
    private static final int IPV6_RADIX = 16;


    /**
     * 处理IP地址
     *
     * @param ip 待处理的ip地址
     * @return 返回ip地址
     */
    private String processIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return getLocalIpAddress();
        }

        // 处理IPv4和IPv6地址
        ip = ip.replace(IPV6_PREFIX, "").replace(IPV6_LOCALHOST, "");

        if (ip.contains(IPV6_SEPARATOR)) {
            // 处理IPv6
            String[] segments = ip.split(IPV6_SEPARATOR);
            StringBuilder sb = new StringBuilder();
            for (String segment : segments) {
                if (!segment.isEmpty()) {
                    int value = Integer.parseInt(segment, IPV6_RADIX);
                    sb.append(String.format(IPV6_FORMAT, value));
                }
            }
            return sb.toString();
        } else {
            // 处理IPv4
            String[] parts = ip.split(IPV4_SEPARATOR);
            StringBuilder sb = new StringBuilder();
            for (String part : parts) {
                if (!part.isEmpty()) {
                    int value = Integer.parseInt(part);
                    sb.append(String.format(IPV4_FORMAT, value));
                }
            }
            return sb.toString();
        }
    }

    /**
     * 获取本地IP地址
     *
     * @return IP地址
     */
    private String getLocalIpAddress() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            return "00000000"; // 默认值
        }
    }

    /**
     * 获取下一个数字
     *
     * @return 数字
     */
    private synchronized String getNextCount() {
        int current = count.getAndIncrement();
        if (current > MAX_COUNT) {
            count.set(MIN_COUNT);
            current = MIN_COUNT;
        }
        return String.valueOf(current);
    }
}
