package com.xiaojusurvey.engine.extensions.router;

import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import com.xiaojusurvey.engine.extensions.security.SecurityProcessor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SecurityProcessorRouter extends BaseRouter implements InitializingBean {

    private List<SecurityProcessor> securityProcessorList = new ArrayList<>();

    @Override
    public void afterPropertiesSet() throws Exception {
        Map<String, SecurityProcessor> messageProcessorMap = applicationContext.getBeansOfType(SecurityProcessor.class);
        if (!CollectionUtils.isEmpty(messageProcessorMap)) {
            messageProcessorMap.entrySet().stream().forEach(e -> securityProcessorList.add(e.getValue()));
        }
    }

    @Override
    public void before(Invocation invocation) {
        for (SecurityProcessor securityProcessor : securityProcessorList) {
            securityProcessor.before(invocation);
        }
    }

    @Override
    public Result after(Result result) {
        for (SecurityProcessor securityProcessor : securityProcessorList) {
            result= securityProcessor.after(result);
        }
        return result;
    }
}
