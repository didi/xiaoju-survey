package com.xiaojusurvey.engine.extensions.router;

import com.xiaojusurvey.engine.extensions.message.MessageProcessor;
import com.xiaojusurvey.engine.extensions.processor.annotation.Message;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(0)
public class MessageProcessorRouter extends BaseRouter<MessageProcessor> {

    @Override
    public void afterPropertiesSet() throws Exception {
        initExtensionProcessors(MessageProcessor.class);
    }

    @Override
    public Class<?> annotationClass() {
        return Message.class;
    }
}
