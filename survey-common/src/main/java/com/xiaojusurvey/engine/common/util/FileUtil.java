package com.xiaojusurvey.engine.common.util;


import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

public class FileUtil {

    private final static SecureRandom secureRandom = new SecureRandom();
    /**
     * 时间单位与秒的映射关系
     * s: 秒
     * m: 分
     * h: 小时
     * d: 天
     * w: 周
     */
    private static final Map<String, Integer> UNIT_MAPPING = new HashMap<>();

    // 静态初始化块，初始化时间单位映射
    static {
        UNIT_MAPPING.put("s", 1);
        UNIT_MAPPING.put("m", 60);
        UNIT_MAPPING.put("h", 3600);
        UNIT_MAPPING.put("d", 86400);
        UNIT_MAPPING.put("w", 604800);
    }

    /**
     * 生成随机文件名
     *
     * @param originalFilename 原文件名
     * @return 新的随机文件名
     */
    public static String generateUniqueFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isEmpty()) {
            return generateSecureRandomString();
        }

        String randomPart = generateSecureRandomString();
        String extension = StringUtils.getFilenameExtension(originalFilename);
        if (!StringUtils.hasText(extension)) {
            return randomPart;
        }
        return randomPart + "." + extension;
    }

    /**
     * 生成安全随机字符串
     *
     * @return 随机字符串
     */
    private static String generateSecureRandomString() {
        // 生成 128 位随机数 (16 字节) 并转换为 UUID 格式
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);

        // 设置 UUID 版本和变体
        randomBytes[6] &= 0x0F;  // 清除版本
        randomBytes[6] |= 0x40;  // 设置版本为 4 (随机生成)
        randomBytes[8] &= 0x3F;  // 清除变体
        randomBytes[8] |= 0x80;  // 设置变体为 RFC 4122

        // 转换为 UUID 字符串
        long mostSignificantBits = 0;
        long leastSignificantBits = 0;
        for (int i = 0; i < 8; i++) {
            mostSignificantBits = (mostSignificantBits << 8) | (randomBytes[i] & 0xff);
        }
        for (int i = 8; i < 16; i++) {
            leastSignificantBits = (leastSignificantBits << 8) | (randomBytes[i] & 0xff);
        }

        UUID uuid = new UUID(mostSignificantBits, leastSignificantBits);
        return uuid.toString().replace("-", "");
    }

    /**
     * 拼接并规范化路径
     *
     * @param paths 要拼接的路径片段
     * @return 规范化后的路径
     * @throws IllegalArgumentException 如果任何路径片段为空或不是有效路径
     */
    public static String join(String... paths) {
        if (paths == null || paths.length == 0) {
            return "";
        }

        return Arrays.stream(paths)
                .filter(p -> p != null && !p.trim().isEmpty())
                .map(p -> p.startsWith("/") ? p.substring(1) : p)
                .map(p -> p.endsWith("/") ? p.substring(0, p.length() - 1) : p)
                .collect(Collectors.joining("/"));
    }

    /**
     * 将带单位的时间字符串转换为秒数
     *
     * @param expiryTime 时间字符串，格式为数字+单位（如5m, 2h）
     * @return 转换后的秒数
     * @throws IllegalArgumentException 当输入为空或格式不正确时抛出
     */
    public static int parseExpiryTimeToSeconds(String expiryTime) {
        // 输入验证
        if (expiryTime == null || expiryTime.isEmpty()) {
            throw new IllegalArgumentException("Expiry time cannot be null or empty");
        }
        // 提取单位部分（最后一个字符）
        String unit = expiryTime.substring(expiryTime.length() - 1).toLowerCase(Locale.ROOT);
        // 提取数字部分（除最后一个字符外的部分）
        int time = Integer.parseInt(expiryTime.substring(0, expiryTime.length() - 1));

        // 检查是否为支持的时间单位
        if (!UNIT_MAPPING.containsKey(unit)) {
            throw new IllegalArgumentException("Unsupported time unit: " + unit);
        }
        // 根据单位计算总秒数
        return UNIT_MAPPING.get(unit) * time;
    }

}
