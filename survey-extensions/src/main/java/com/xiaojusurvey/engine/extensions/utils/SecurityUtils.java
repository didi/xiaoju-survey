package com.xiaojusurvey.engine.extensions.utils;

import com.xiaojusurvey.engine.common.util.ApplicationContextProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

@Slf4j
public class SecurityUtils {

    /**
     * 手机号码正则表达式
     */
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");

    /**
     * 身份证号码正则表达式
     */
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)");

    /**
     * 地址正则表达式
     */
    private static final Pattern ADDRESS_PATTERN = Pattern.compile(".*省|.*自治区|.*市|.*区|.*镇|.*县");

    /**
     * 邮箱正则
     */
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    /**
     * 性别
     */
    private static final List<String> GENDER_LIST = Arrays.asList("男", "女");

    /**
     * 对称加密算法（AES的CBC模式）
     */
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";

    /**
     * 加密的线程安全Cipher
     */
    private static final ThreadLocal<Cipher> ENCRYPT_CIPHER_THREAD_LOCAL = new ThreadLocal<>();

    /**
     * 解密的线程安全Cipher
     */
    private static final ThreadLocal<Cipher> DECRYPT_CIPHER_THREAD_LOCAL = new ThreadLocal<>();

    /**
     * 获取线程安全的加密Cipher
     *
     * @param secretKey 密钥
     * @return
     * @throws Exception
     */
    private static Cipher getEncryptCipher(String secretKey) throws Exception {
        Cipher cipher = ENCRYPT_CIPHER_THREAD_LOCAL.get();
        if (cipher == null) {
            // 获取 Cipher 实例，用于执行加密操作
            cipher = Cipher.getInstance(ALGORITHM);
            // 获取密钥规范
            SecretKeySpec secretKeySpec = getSecretKeySpec(secretKey);
            // 初始化 Cipher 为加密模式，并传入生成的密钥
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, new IvParameterSpec(getIV()));
            ENCRYPT_CIPHER_THREAD_LOCAL.set(cipher);
        }
        return cipher;
    }

    /**
     * 获取线程安全的解密Cipher
     *
     * @param secretKey 密钥
     * @return
     */
    private static Cipher getDecryptCipher(String secretKey) throws Exception {
        Cipher cipher = DECRYPT_CIPHER_THREAD_LOCAL.get();
        if (cipher == null) {
            // 获取 Cipher 实例，用于执行加密操作
            cipher = Cipher.getInstance(ALGORITHM);
            // 获取密钥规范
            SecretKeySpec secretKeySpec = getSecretKeySpec(secretKey);
            // 初始化 Cipher 为加密模式，并传入生成的密钥
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new IvParameterSpec(getIV()));
            DECRYPT_CIPHER_THREAD_LOCAL.set(cipher);
        }
        return cipher;
    }

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
        return PHONE_PATTERN.asPredicate().test(str) || ID_CARD_PATTERN.asPredicate().test(str) || ADDRESS_PATTERN.asPredicate().test(str) || EMAIL_PATTERN.asPredicate().test(str) || GENDER_LIST.contains(str);
    }

    /***
     * 初始化向量（IV）用于增加加密和解密的安全性
     * @return 初始化向量
     */
    public static byte[] getIV() {
        String str = getSecretKey();
        return str.getBytes(StandardCharsets.UTF_8);
    }

    /**
     * 获取配置文件中的XIAOJU_SURVEY_RESPONSE_AES_ENCRYPT_SECRET_KEY，必须为16位
     * <p>默认值：EncryptSecretKey</p>
     *
     * @return AES密码
     */
    public static String getSecretKey() {
        ApplicationContext applicationContext = ApplicationContextProvider.getApplicationContext();
        if (Objects.isNull(applicationContext)) {
            return "EncryptSecretKey";
        }
        Environment environment = applicationContext.getBean(Environment.class);
        String aesSecretKey = environment.getProperty("XIAOJU_SURVEY_RESPONSE_AES_SECRET_KEY");
        if (!StringUtils.hasText(aesSecretKey)) {
            aesSecretKey = "EncryptSecretKey";
        }
        return aesSecretKey;
    }

    /**
     * 获取加密Key
     *
     * @param key 密钥
     * @return
     */
    public static SecretKeySpec getSecretKeySpec(String key) {
        if (!StringUtils.hasText(key)) {
            return null;
        }
        return new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
    }

    /**
     * 对敏感数据使用指定的对称加密算法和密钥进行加密
     * <p>对敏感数据脱敏，非敏感数据不处理</p>
     *
     * @param value 待加密的数据对象，若为字符串则进行加密，否则直接返回
     * @return 加密后的数据（Base64 编码的字符串），若不满足加密条件则返回原始值
     */
    public static Object aesEncryptSensitiveData(Object value, String secretKey) {
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
        if (!StringUtils.hasText(secretKey)) {
            secretKey = getSecretKey();
        }
        if (!StringUtils.hasText(secretKey)) {
            return value;
        }
        try {
            Cipher cipher = getEncryptCipher(secretKey);
            // 将待加密的字符串转换为字节数组，使用 UTF-8 编码，执行加密操作，得到加密后的字节数组
            byte[] encryptedBytes = cipher.doFinal(str.getBytes(StandardCharsets.UTF_8));
            // 将加密后的字节数组进行 Base64 编码，方便存储和传输
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (IllegalArgumentException | IllegalBlockSizeException e) {
            log.error("加密参数错误，请检查密文或密钥，错误 {} 待解密串 {} ", e.getMessage(), value);
            return value;
        } catch (BadPaddingException e) {
            log.error("密钥或填充的初始向量长度不为16字节，请检查密钥以及初始向量", e);
            return value;
        } catch (Exception e) {
            log.error("未知错误 ", e);
            return value;
        }
    }

    /**
     * 对传入的加密字符串值使用指定的对称加密算法和密钥进行解密
     *
     * @param value 待解密的数据对象，若为字符串则进行解密，否则直接返回
     * @return 解密后的数据，若不满足解密条件则返回原始值
     */
    public static Object aesDecryptData(Object value, String secretKey) {
        String str;
        if (value instanceof String) {
            str = (String) value;
        } else if (Objects.nonNull(value)) {
            str = value.toString();
        } else {
            return null;
        }
        if (!StringUtils.hasText(secretKey)) {
            secretKey = getSecretKey();
        }
        if (!StringUtils.hasText(secretKey)) {
            return value;
        }
        try {
            Cipher cipher = getDecryptCipher(secretKey);
            // 将 Base64 编码的加密字符串解码为字节数组，执行解密操作，得到解密后的字节数组
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(str));
            // 将解密后的字节数组转换为字符串，使用 UTF-8 编码
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException | IllegalBlockSizeException e) {
            log.error("解密参数错误，请检查密文或密钥，错误 {} 待解密串 {} ", e.getMessage(), value);
            return value;
        } catch (BadPaddingException e) {
            log.error("密钥或填充的初始向量长度不为16字节，请检查密钥以及初始向量", e);
            return value;
        } catch (Exception e) {
            log.error("未知错误 ", e);
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
     * @param placeHolder 用于脱敏的占位符，如果为空则默认使用 "*"
     * @return 脱敏后的数据对象
     */
    public static Object maskSensitiveData(Object value, String placeHolder) {
        if (!StringUtils.hasText(placeHolder)) {
            placeHolder = "*";
        }
        String str;
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
            return str.charAt(0) + placeHolder + placeHolder + placeHolder + str.charAt(str.length() - 1);
        }
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
        return clazz == Boolean.class || clazz == Character.class || clazz == Byte.class || clazz == Short.class || clazz == Integer.class || clazz == Long.class || clazz == Float.class || clazz == Double.class;
    }

    @FunctionalInterface
    public interface DataSecurityFunction {
        /**
         * 兼容{@link SecurityUtils} 中的aesEncryptData、aesDecryptData、maskData
         *
         * @param value 操作的值
         * @param str   加解密-密钥；脱敏-占位符
         * @return 操作结束的对象
         */
        Object function(Object value, String str);
    }
}
