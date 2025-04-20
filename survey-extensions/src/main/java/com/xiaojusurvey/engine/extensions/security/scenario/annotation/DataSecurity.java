package com.xiaojusurvey.engine.extensions.security.scenario.annotation;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataSecurity {
    /**
     * 安全场景
     */
    SecurityScenarioEnum securityScenario();

    /**
     * 算法（加密时使用）
     */
    String algorithm() default "aes";

    /**
     * 密钥
     */
    String secretKey();

    /**
     * 占位符，数据脱敏时使用
     */
    String placeHolder() default "*";
}
