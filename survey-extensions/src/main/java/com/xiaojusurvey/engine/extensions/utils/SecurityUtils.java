package com.xiaojusurvey.engine.extensions.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

@Slf4j
public class SecurityUtils {

    // 手机号码正则表达式
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    // 身份证号码正则表达式
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)");
    // 地址正则表达式
    private static final Pattern ADDRESS_PATTERN = Pattern.compile(".*省|.*自治区|.*市|.*区|.*镇|.*县");
    // 邮箱正则
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    // 性别
    private static final List<String> GENDER_LIST = Arrays.asList("男", "女");


    // 支持的对称加密算法列表
    private static final String[] SUPPORTED_ALGORITHMS = {"AES", "DES", "DESEDE", "BLOWFISH"};

    /**
     * 检查数据是否敏感
     * <p>数据必须为{@link String}</p>
     *
     * @param value 数据
     * @return true-敏感数据；false-非敏感数据
     */
    public static Boolean isDataSensitive(Object value) {
        String str;
        if (value instanceof String) {
            str = (String) value;
        } else if (Objects.nonNull(value)) {
            str = value.toString();
        } else {
            return false;
        }
        return PHONE_PATTERN.asPredicate().test(str)
                || ID_CARD_PATTERN.asPredicate().test(str)
                || ADDRESS_PATTERN.asPredicate().test(str)
                || EMAIL_PATTERN.asPredicate().test(str)
                || GENDER_LIST.contains(str);
    }

    /**
     * 对敏感数据使用指定的对称加密算法和密钥进行加密
     * <p>对敏感数据脱敏，非敏感数据不处理</p>
     *
     * @param value     待加密的数据对象，若为字符串则进行加密，否则直接返回
     * @param algorithm 加密算法，如 "AES", "DES", "DESede", "Blowfish"
     * @param secretKey 加密使用的密钥
     * @return 加密后的数据（Base64 编码的字符串），若不满足加密条件则返回原始值
     */
    public static Object encryptSensitiveData(Object value, String algorithm, String secretKey) {
        if (!StringUtils.hasText(algorithm)) {
            return value;
        }
        if (!isAlgorithmSupported(algorithm)) {
            return value;
        }
        String str;
        if (value instanceof String) {
            str = (String) value;
        } else if (Objects.nonNull(value)) {
            str = value.toString();
        } else {
            return null;
        }
        // 非敏感数据不加密
        if (!isDataSensitive(str)) {
            return value;
        }
        try {
            // 调用 generateSecretKey 方法根据算法和密钥生成加密所需的 SecretKeySpec 对象
            SecretKeySpec secretKeySpec = generateSecretKey(algorithm, secretKey);
            // 获取 Cipher 实例，用于执行加密操作
            Cipher cipher = Cipher.getInstance(algorithm);
            // 初始化 Cipher 为加密模式，并传入生成的密钥
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            // 将待加密的字符串转换为字节数组，使用 UTF-8 编码
            byte[] inputBytes = str.getBytes(StandardCharsets.UTF_8);
            // 执行加密操作，得到加密后的字节数组
            byte[] encryptedBytes = cipher.doFinal(inputBytes);
            // 将加密后的字节数组进行 Base64 编码，方便存储和传输
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            log.warn("加密数据错误", e);
            return value;
        }
    }

    /**
     * 对传入的加密字符串值使用指定的对称加密算法和密钥进行解密
     *
     * @param value     待解密的数据对象，若为字符串则进行解密，否则直接返回
     * @param algorithm 解密使用的算法，如 "AES", "DES", "DESede", "Blowfish"
     * @param secretKey 解密使用的密钥
     * @return 解密后的数据，若不满足解密条件则返回原始值
     */
    public static Object decryptData(Object value, String algorithm, String secretKey) {
        if (!StringUtils.hasText(algorithm)) {
            log.warn("algorithm is empty");
            return value;
        }
        if (!isAlgorithmSupported(algorithm)) {
            log.warn("algorithm not supported: {}", algorithm);
            return value;
        }
        String str;
        if (value instanceof String) {
            str = (String) value;
        } else if (Objects.nonNull(value)) {
            str = value.toString();
        } else {
            return null;
        }
        try {
            // 调用 generateSecretKey 方法根据算法和密钥生成解密所需的 SecretKeySpec 对象
            SecretKeySpec secretKeySpec = generateSecretKey(algorithm, secretKey);
            // 获取 Cipher 实例，用于执行解密操作
            Cipher cipher = Cipher.getInstance(algorithm);
            // 初始化 Cipher 为解密模式，并传入生成的密钥
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            // 将 Base64 编码的加密字符串解码为字节数组
            byte[] encryptedBytes = Base64.getDecoder().decode(str);
            // 执行解密操作，得到解密后的字节数组
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            // 将解密后的字节数组转换为字符串，使用 UTF-8 编码
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.warn("解密数据错误", e);
            return value;
        }
    }

    /**
     * 对敏感数据进行数据脱敏处理。
     * <p>对敏感数据脱敏，非敏感数据不处理</p>
     * <p>如果传入的值是字符串，会根据字符串的长度进行不同规则的脱敏；</p>
     * <p>如果不是字符串或者占位符为空，会使用默认占位符替代</p>
     *
     * @param value       待脱敏的数据对象
     * @param str         无意义参数
     * @param placeHolder 用于脱敏的占位符，如果为空则默认使用 "*"
     * @return 脱敏后的数据对象
     */
    public static Object maskSensitiveData(Object value, String str, String placeHolder) {
        if (!StringUtils.hasText(placeHolder)) {
            placeHolder = "*";
        }
        if (value instanceof String) {
            str = (String) value;
        } else if (Objects.nonNull(value)) {
            str = value.toString();
        } else {
            return null;
        }
        if (!isDataSensitive(str)) {
            return value;
        }
        if (!StringUtils.hasText(str) || str.length() == 1) {
            return placeHolder;
        } else if (str.length() == 2) {
            return str.charAt(0) + placeHolder;
        } else {
            return str.charAt(0)
                    + placeHolder
                    + placeHolder
                    + placeHolder
                    + str.charAt(str.length() - 1);
        }
    }

    /**
     * 检查算法是否在支持列表中
     *
     * @param algorithm 算法
     * @return true-支持；false-不支持
     */
    public static boolean isAlgorithmSupported(String algorithm) {
        for (String supportedAlgorithm : SUPPORTED_ALGORITHMS) {
            if (supportedAlgorithm.equalsIgnoreCase(algorithm)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据指定的算法和密钥生成加密所需的 SecretKeySpec 对象
     *
     * @param algorithm 加密算法，如 "AES", "DES", "DESede", "Blowfish"
     * @param secretKey 加密使用的密钥
     * @return 生成的 SecretKeySpec 对象
     * @throws Exception 生成密钥过程中可能出现的异常
     */
    private static SecretKeySpec generateSecretKey(String algorithm, String secretKey) throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(algorithm);
        SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
        secureRandom.setSeed(secretKey.getBytes());
        switch (algorithm.toUpperCase()) {
            case "AES":
                keyGenerator.init(128, secureRandom);
                break;
            case "DES":
                keyGenerator.init(56, secureRandom);
                break;
            case "DESEDE":
                keyGenerator.init(192, secureRandom);
                break;
            case "BLOWFISH":
                keyGenerator.init(128, secureRandom);
                break;
        }
        SecretKey secretKeyGenerated = keyGenerator.generateKey();
        return new SecretKeySpec(secretKeyGenerated.getEncoded(), algorithm);
    }

    /**
     * 判断clazz是否为基本类型或者其包装类型
     *
     * @param clazz 类
     * @return true-基本类型；false-非基本类型
     */
    public static boolean isPrimitiveOrWrapper(Class<?> clazz) {
        if (clazz.isPrimitive()) {
            return true;
        }
        return clazz == Boolean.class ||
                clazz == Character.class ||
                clazz == Byte.class ||
                clazz == Short.class ||
                clazz == Integer.class ||
                clazz == Long.class ||
                clazz == Float.class ||
                clazz == Double.class;
    }

    @FunctionalInterface
    public interface DataSecurityFunction {
        /**
         * 兼容{@link SecurityUtils} 中的encryptData、decryptData、maskData
         *
         * @param value     操作的值
         * @param algorithm 算法
         * @param str       加解密-密钥；脱敏-占位符
         * @return 操作结束的对象
         */
        Object function(Object value, String algorithm, String str);
    }
}
