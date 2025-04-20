package com.xiaojusurvey.engine.extensions.security.scenario;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity;
import com.xiaojusurvey.engine.extensions.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;

import static com.xiaojusurvey.engine.extensions.utils.SecurityUtils.DataSecurityFunction;

/**
 * 安全场景
 */
@Slf4j
public abstract class SecurityScenario {
    /**
     * 递归对象，并对其中的String进行指定操作dataSecurityFunction（加密、解密、脱敏）
     *
     * @param obj                  对象
     * @param algorithm            加解密算法
     * @param str                  加解密-密钥；脱敏-占位符
     * @param dataSecurityFunction 对应{@link SecurityUtils} 中的encryptData、decryptData、maskData
     */
    protected static void securityOperationProperties(Object obj, String algorithm, String str, DataSecurityFunction dataSecurityFunction) {
        if (Objects.isNull(obj)) {
            return;
        }
        Class<?> clazz = obj.getClass();
        // 如果对象为基本类型（其包装类型）、接口、枚举类型，则跳过
        if (SecurityUtils.isPrimitiveOrWrapper(clazz) || clazz.isInterface() || clazz.isEnum()) {
            return;
        }

        // 如果对象为String，则进行操作
        if (obj instanceof String) {
            log.info("field = {}", obj);
            String originalValue = (String) obj;
            Object value = dataSecurityFunction.function(originalValue, algorithm, str);
            // 将value的值给obj
            try {
                Field field = obj.getClass().getDeclaredField("value");
                field.setAccessible(true);
                char[] charArray = ((String) value).toCharArray();
                field.set(obj, charArray);
            } catch (Exception e) {
                log.warn("获取String的value属性错误", e);
                return;
            }
            return;
        }

        // 如果对象为集合，则循环操作其元素
        if (obj instanceof Collection<?>) {
            Collection<?> collection = (Collection<?>) obj;
            for (Object item : collection) {
                securityOperationProperties(item, algorithm, str, dataSecurityFunction);
            }
            return;
        }

        // 如果对象是map，则只操作其value
        if (obj instanceof Map<?, ?>) {
            Map<String, Object> map = (Map<String, Object>) obj;
            map.values().forEach(value -> {
                securityOperationProperties(value, algorithm, str, dataSecurityFunction);
            });
            return;
        }

        // 如果对象为普通数组，则其元素都遍历一次
        if (obj.getClass().isArray()) {
            int length = Array.getLength(obj);
            for (int i = 0; i < length; i++) {
                Object o = Array.get(obj, i);
                securityOperationProperties(o, algorithm, str, dataSecurityFunction);
            }
        }

        // 如果对象为复杂对象，则对于每个属性都遍历一次
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object fieldValue = field.get(obj);
                if (Objects.isNull(fieldValue)) {
                    continue;
                }
                securityOperationProperties(fieldValue, algorithm, str, dataSecurityFunction);
            } catch (IllegalAccessException e) {
                log.warn("获取指定字段值错误", e);
                return;
            }
        }
    }

    /**
     * 进入方法前执行
     *
     * @param dataSecurityInvocation 方法执行前的入参
     */
    public abstract void before(DataSecurityInvocation dataSecurityInvocation);

    /**
     * 方法执行完后
     *
     * @param dataSecurityInvocation 方法执行前的入参
     * @param result                 方法执行后的返回值
     */
    public abstract Object after(DataSecurityInvocation dataSecurityInvocation, Object result);

    /**
     * 获取安全场景
     *
     * @return {@link SecurityScenarioEnum}
     */
    public abstract SecurityScenarioEnum getSecurityScenario();

    /**
     * 加密数据
     *
     * @param value                  加密内容
     * @param dataSecurityInvocation 数据安全信息
     */
    protected void encryptData(Object value, DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        DataSecurity dataSecurity = dataSecurityInvocation.getDataSecurity();
        if (Objects.isNull(dataSecurity)) {
            return;
        }
        String algorithm = dataSecurity.algorithm();
        String secretKey = dataSecurity.secretKey();
        if (!StringUtils.hasText(algorithm) || !StringUtils.hasText(secretKey)) {
            return;
        }
        if (Objects.isNull(value)) {
            value = dataSecurityInvocation.getArguments();
        }
        if (Objects.isNull(value)) {
            return;
        }
        securityOperationProperties(value, algorithm, secretKey, SecurityUtils::encryptSensitiveData);
    }

    /**
     * 解密数据
     *
     * @param value                  解密内容
     * @param dataSecurityInvocation 数据安全信息
     */
    protected void decryptData(Object value, DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        if (Objects.isNull(value)) {
            value = dataSecurityInvocation.getArguments();
        }
        if (Objects.isNull(value)) {
            return;
        }
        DataSecurity dataSecurity = dataSecurityInvocation.getDataSecurity();
        if (Objects.isNull(dataSecurity)) {
            return;
        }
        String algorithm = dataSecurity.algorithm();
        String secretKey = dataSecurity.secretKey();
        if (!StringUtils.hasText(algorithm) || !StringUtils.hasText(secretKey)) {
            return;
        }
        securityOperationProperties(value, algorithm, secretKey, SecurityUtils::decryptData);

    }

    /**
     * 数据脱敏
     *
     * @param value                  脱敏内容
     * @param dataSecurityInvocation 数据安全信息
     */
    protected void maskData(Object value, DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(value)) {
            return;
        }
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        DataSecurity dataSecurity = dataSecurityInvocation.getDataSecurity();
        if (Objects.isNull(dataSecurity)) {
            return;
        }
        String placeHolder = dataSecurity.placeHolder();
        if (!StringUtils.hasText(placeHolder)) {
            return;
        }
        securityOperationProperties(value, null, placeHolder, SecurityUtils::maskSensitiveData);
    }
}
