package com.xiaojusurvey.engine.extensions.security.scenario;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity;
import com.xiaojusurvey.engine.extensions.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.*;

import static com.xiaojusurvey.engine.extensions.utils.SecurityUtils.DataSecurityFunction;
import static com.xiaojusurvey.engine.extensions.utils.SecurityUtils.isPrimitiveOrWrapper;

/**
 * 安全场景
 */
@Slf4j
public abstract class SecurityScenario {
    /**
     * 递归对象，并对其中的String进行指定操作dataSecurityFunction（加密、解密、脱敏）
     * <p>对于{@link Collection}类型数据，支持：{@link ArrayList}、{@link LinkedList}、{@link TreeSet}、{@link HashSet}</p>
     * <p>对于不可集合，会打印错误信息/p>
     *
     * @param obj                  对象
     * @param str                  加解密-密钥；脱敏-占位符
     * @param dataSecurityFunction 对应{@link SecurityUtils} 中的encryptData、decryptData、maskData
     */
    protected static void securityOperationProperties(Object obj, String str, DataSecurityFunction dataSecurityFunction) {
        if (Objects.isNull(obj)) {
            return;
        }
        Class<?> clazz = obj.getClass();
        // 如果对象为基本类型（其包装类型）、接口、枚举类型，则跳过
        if (SecurityUtils.isPrimitiveOrWrapper(clazz) || clazz.isInterface() || clazz.isEnum()) {
            return;
        }
        if (obj instanceof String) {
            log.error("{} 基于String的不可变性，不支持修改String {}", obj.getClass().getName(), obj);
        }

        // 如果对象是map，则只操作其value
        if (obj instanceof Map<?, ?>) {
            Map<Object, Object> map = (Map<Object, Object>) obj;
            for (Map.Entry<Object, Object> entry : map.entrySet()) {
                Object value = entry.getValue();
                if (Objects.isNull(value)) {
                    continue;
                }
                if (isPrimitiveOrWrapper(value.getClass()) || value.getClass().isInterface() || value.getClass().isEnum()) {
                    continue;
                }
                if (value instanceof String) {
                    Object newValue = dataSecurityFunction.function(value, str);
                    map.put(entry.getKey(), newValue);
                } else {
                    securityOperationProperties(value, str, dataSecurityFunction);
                }
            }
            return;
        }

        // 如果对象为普通数组，则其元素都遍历一次
        if (obj.getClass().isArray()) {
            int length = Array.getLength(obj);
            for (int i = 0; i < length; i++) {
                Object value = Array.get(obj, i);
                if (Objects.isNull(value)) {
                    continue;
                }
                // 如果对象为基本类型（其包装类型）、接口、枚举类型，则跳过
                if (SecurityUtils.isPrimitiveOrWrapper(value.getClass()) || value.getClass().isInterface() || value.getClass().isEnum()) {
                    continue;
                }
                if (value instanceof String) {
                    Object newValue = dataSecurityFunction.function(value, str);
                    Array.set(obj, i, newValue);
                } else {
                    securityOperationProperties(value, str, dataSecurityFunction);
                }
            }
            return;
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
                // 如果对象为基本类型（其包装类型）、接口、枚举类型，则跳过
                if (SecurityUtils.isPrimitiveOrWrapper(field.getClass()) || field.getClass().isInterface() || field.getClass().isEnum()) {
                    continue;
                }
                // 如果对象为集合，则循环操作其元素（不可修改数组通过这种方式修改）
                if (fieldValue instanceof Collection<?>) {
                    Collection<Object> originalCollection = (Collection<Object>) fieldValue;
                    Collection<Object> newCollection;
                    // 以下根据需要添加初始化集合方式
                    if (fieldValue instanceof ArrayList) {
                        newCollection = new ArrayList<>();
                    } else if (fieldValue instanceof LinkedList) {
                        newCollection = new LinkedList<>();
                    } else if (fieldValue instanceof HashSet) {
                        newCollection = new HashSet<>();
                    } else if (fieldValue instanceof TreeSet) {
                        newCollection = new TreeSet<>();
                    } else {
                        log.error("{} 无法操作的集合类型：{}", field.getName(), fieldValue.getClass());
                        continue;
                    }
                    for (Object value : originalCollection) {
                        if (Objects.isNull(value)) {
                            continue;
                        }
                        if (isPrimitiveOrWrapper(value.getClass()) || value.getClass().isInterface() || value.getClass().isEnum()) {
                            newCollection.add(value);
                            continue;
                        }
                        if (value instanceof String) {
                            Object newValue = dataSecurityFunction.function(value, str);
                            newCollection.add(newValue);
                        } else {
                            securityOperationProperties(value, str, dataSecurityFunction);
                            newCollection.add(value);
                        }
                    }
                    field.set(obj, newCollection);
                } else if (fieldValue instanceof String) {
                    Object value = dataSecurityFunction.function(fieldValue, str);
                    field.set(obj, value);
                } else {
                    securityOperationProperties(fieldValue, str, dataSecurityFunction);
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
                return;
            }
        }
    }

    /**
     * 进入方法前执行
     *
     * @param dataSecurityInvocation 方法执行前的入参
     */
    public abstract void before(DataSecurityInvocation dataSecurityInvocation, DataWrapper dataWrapper);

    /**
     * 方法执行完后
     *
     * @param dataSecurityInvocation 方法执行前的入参
     * @param dataWrapper            方法执行后的返回值
     */
    public abstract void after(DataSecurityInvocation dataSecurityInvocation, DataWrapper dataWrapper);

    /**
     * 获取安全场景
     *
     * @return {@link SecurityScenarioEnum}
     */
    public abstract SecurityScenarioEnum getSecurityScenario();

    /**
     * 加密数据
     *
     * @param result                 加密内容
     * @param dataSecurityInvocation 数据安全信息
     */
    protected void encryptData(DataWrapper result, DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation) || Objects.isNull(result)) {
            return;
        }
        if (Objects.isNull(result.getValue())) {
            result.setValue(dataSecurityInvocation.getArguments());
        }
        if (Objects.isNull(result.getValue())) {
            return;
        }
        DataSecurity dataSecurity = dataSecurityInvocation.getDataSecurity();
        if (Objects.isNull(dataSecurity)) {
            return;
        }
        String secretKey = dataSecurity.secretKey();
        securityOperationProperties(result, secretKey, SecurityUtils::aesEncryptSensitiveData);
    }

    /**
     * 解密数据
     *
     * @param result                 解密内容
     * @param dataSecurityInvocation 数据安全信息
     */
    protected void decryptData(DataWrapper result, DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation) || Objects.isNull(result)) {
            return;
        }
        if (Objects.isNull(result.getValue())) {
            result.setValue(dataSecurityInvocation.getArguments());
        }
        if (Objects.isNull(result.getValue())) {
            return;
        }
        DataSecurity dataSecurity = dataSecurityInvocation.getDataSecurity();
        if (Objects.isNull(dataSecurity)) {
            return;
        }
        String secretKey = dataSecurity.secretKey();
        securityOperationProperties(result, secretKey, SecurityUtils::aesDecryptData);
    }

    /**
     * 数据脱敏
     *
     * @param result                 脱敏内容
     * @param dataSecurityInvocation 数据安全信息
     */
    protected void maskData(DataWrapper result, DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation) || Objects.isNull(result)) {
            return;
        }
        if (Objects.isNull(result.getValue())) {
            result.setValue(dataSecurityInvocation.getArguments());
        }
        if (Objects.isNull(result.getValue())) {
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
        securityOperationProperties(result, placeHolder, SecurityUtils::maskSensitiveData);
    }
}
