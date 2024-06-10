package com.xiaojusurvey.engine.extensions.router;

import com.xiaojusurvey.engine.extensions.processor.annotation.Security;
import com.xiaojusurvey.engine.extensions.security.SecurityProcessor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class SecurityProcessorRouter extends BaseRouter<SecurityProcessor> {

    @Override
    public void afterPropertiesSet() throws Exception {
        initExtensionProcessors(SecurityProcessor.class);
    }

    @Override
    public Class<?> annotationClass() {
        return Security.class;
    }
}
