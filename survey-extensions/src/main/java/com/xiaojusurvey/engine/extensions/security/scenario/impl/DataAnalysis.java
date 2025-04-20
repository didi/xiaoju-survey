package com.xiaojusurvey.engine.extensions.security.scenario.impl;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.DataSecurityInvocation;
import com.xiaojusurvey.engine.extensions.security.scenario.SecurityScenario;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * 数据分析场景
 */
@Component
@Slf4j
public class DataAnalysis extends SecurityScenario {
    /**
     * 数据解密
     */
    @Override
    public void before(DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        decryptData(dataSecurityInvocation.getArguments(), dataSecurityInvocation);
    }

    /**
     * 数据脱敏
     */
    @Override
    public Object after(DataSecurityInvocation dataSecurityInvocation, Object result) {
        maskData(result, dataSecurityInvocation);
        return result;
    }

    @Override
    public SecurityScenarioEnum getSecurityScenario() {
        return SecurityScenarioEnum.DATA_ANALYSIS;
    }
}
