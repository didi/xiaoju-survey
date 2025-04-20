package com.xiaojusurvey.engine.extensions.security.scenario.impl;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.DataSecurityInvocation;
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
    public void before(DataSecurityInvocation dataSecurityInvocation) {
        if (Objects.isNull(dataSecurityInvocation)) {
            return;
        }
        encryptData(dataSecurityInvocation.getArguments(), dataSecurityInvocation);
    }

    /**
     * 数据解密
     */
    @Override
    public Object after(DataSecurityInvocation dataSecurityInvocation, Object result) {
        decryptData(result, dataSecurityInvocation);
        return result;
    }

    @Override
    public SecurityScenarioEnum getSecurityScenario() {
        return SecurityScenarioEnum.DATA_WAREHOUSING;
    }
}
