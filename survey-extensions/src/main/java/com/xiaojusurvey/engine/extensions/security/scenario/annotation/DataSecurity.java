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
     * 密钥，默认从配置文件中获取
     */
    String secretKey() default "";

    /**
     * 占位符，数据脱敏时使用
     */
    String placeHolder() default "*";
}
