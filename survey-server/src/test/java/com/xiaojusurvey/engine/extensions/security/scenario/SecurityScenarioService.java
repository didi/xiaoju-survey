package com.xiaojusurvey.engine.extensions.security.scenario;

import com.alibaba.fastjson.JSONObject;
import com.xiaojusurvey.engine.common.constants.SecurityConstant;
import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SecurityScenarioService {


    /**
     * 测试数据分析场景（解密、脱敏）
     *
     * @param encryptData 加密数据
     * @return 脱敏数据
     */
    @DataSecurity(securityScenario = SecurityScenarioEnum.DATA_ANALYSIS, secretKey = SecurityConstant.SECRET_KEY)
    public JSONObject dataAnalysis(JSONObject encryptData) {
        log.info("数据分析方法中的参数 原始数据 {}", encryptData);
        return encryptData;
    }

    /**
     * 测试数据入库方法（加密、解密）
     *
     * @param sensitiveData 敏感数据
     * @return
     */
    @DataSecurity(securityScenario = SecurityScenarioEnum.DATA_WAREHOUSING, secretKey = SecurityConstant.SECRET_KEY)
    public JSONObject dataWarehousing(JSONObject sensitiveData) {
        log.info("数据入库方法中的参数 敏感数据加密 {}", sensitiveData);
        return sensitiveData;
    }


}

