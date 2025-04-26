package com.xiaojusurvey.engine.extensions.security.scenario.impl;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.DataSecurityInvocation;
import com.xiaojusurvey.engine.extensions.security.scenario.DataWrapper;
import com.xiaojusurvey.engine.extensions.security.scenario.SecurityScenario;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * 回收数据入库场景
 */
@Component
@Slf4j
public class DataWarehousing extends SecurityScenario {
    /**
     * 数据加密
     */
    @Override
    public void before(DataSecurityInvocation dataSecurityInvocation, DataWrapper dataWrapper) {
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        encryptData(dataWrapper, dataSecurityInvocation);
    }

    /**
     * 数据解密
     */
    @Override
    public void after(DataSecurityInvocation dataSecurityInvocation, DataWrapper dataWrapper) {
        decryptData(dataWrapper, dataSecurityInvocation);
    }

    @Override
    public SecurityScenarioEnum getSecurityScenario() {
        return SecurityScenarioEnum.DATA_WAREHOUSING;
    }
}
