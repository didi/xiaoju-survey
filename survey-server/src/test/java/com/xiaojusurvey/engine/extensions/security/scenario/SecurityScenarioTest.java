package com.xiaojusurvey.engine.extensions.security.scenario;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
@Slf4j
public class SecurityScenarioTest {

    /**
     * 敏感数据
     */
    private final static JSONObject sensitiveData = new JSONObject();
    /**
     * 加密数据
     */
    private final static JSONObject encryptData = new JSONObject();

    static {
        sensitiveData.put("name", "levi");
        sensitiveData.put("phone", "13156479203");
        sensitiveData.put("address", "西藏自治区那曲市嘉黎县热须村村民委员会");
        sensitiveData.put("email", "levi@gmail.com");
        sensitiveData.put("idCardNumber", "441243194910014698");
        sensitiveData.put("description", "在 JDK 8 里，你能够借助函数式接口把函数当作方法参数来传递。函数式接口指的是仅含一个抽象方法的接口，可使用@FunctionalInterface注解来标记。");
    }

    static {
        encryptData.put("name", "levi");
        encryptData.put("phone", "SNSw9K2uc/GkxRuj8Wq95Q==");
        encryptData.put("address", "baqAfo4DAFINtlDWrZ7u7sONdZ+/UQdHyvF6XfDlGQ29+VYZrcHM4gkQifz9gRwm7ggboc5CzHnIn31eqy+ZKw==");
        encryptData.put("email", "QuELCpxeS9pWjfBufOp/sA==");
        encryptData.put("idCardNumber", "qaRIj8OPTAOGueOr/8n1RvzpNkad+jmOS21SrqWE1aQ=");
        encryptData.put("description", "在 JDK 8 里，你能够借助函数式接口把函数当作方法参数来传递。函数式接口指的是仅含一个抽象方法的接口，可使用@FunctionalInterface注解来标记。");
    }

    @Resource
    private SecurityScenarioService securityScenarioService;

    /**
     * 回收数据分析测试场景（解密、脱敏）
     */
    @Test
    public void testDataAnalysis() {
        log.info("调用方法前，加密数据为 {}", encryptData);
        JSONObject afterData = securityScenarioService.dataAnalysis(encryptData);
        log.info("调用方法后，脱敏数据为 {}", afterData);
    }

    /**
     * 回收数据入库测试场景（加密解密）
     */
    @Test
    public void testDataWarehousing() {
        log.info("调用方法前，原始数据为 {}", sensitiveData);
        JSONObject afterData = securityScenarioService.dataWarehousing(sensitiveData);
        log.info("调用方法后，解密数据为 {}", afterData);
    }

}
