package com.xiaojusurvey.engine.extensions.security.scenario.impl;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.DataSecurityInvocation;
import com.xiaojusurvey.engine.extensions.security.scenario.DataWrapper;
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
    public void before(DataSecurityInvocation dataSecurityInvocation, DataWrapper dataWrapper) {
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        decryptData(dataWrapper, dataSecurityInvocation);
    }

    /**
     * 数据脱敏
     */
    @Override
    public void after(DataSecurityInvocation dataSecurityInvocation, DataWrapper dataWrapper) {
        maskData(dataWrapper, dataSecurityInvocation);
    }

    @Override
    public SecurityScenarioEnum getSecurityScenario() {
        return SecurityScenarioEnum.DATA_ANALYSIS;
    }
}
