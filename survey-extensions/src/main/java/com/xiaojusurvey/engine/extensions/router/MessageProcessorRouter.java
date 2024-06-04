package com.xiaojusurvey.engine.extensions.router;

import com.xiaojusurvey.engine.extensions.message.MessageProcessor;
import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class MessageProcessorRouter extends BaseRouter implements InitializingBean {

    private List<MessageProcessor> messageProcessorList = new ArrayList<>();


    @Override
    public void afterPropertiesSet() throws Exception {
        Map<String, MessageProcessor> messageProcessorMap = applicationContext.getBeansOfType(MessageProcessor.class);
        if (!CollectionUtils.isEmpty(messageProcessorMap)) {
            messageProcessorMap.entrySet().stream().forEach(e -> messageProcessorList.add(e.getValue()));
        }
    }

    @Override
    public void before(Invocation invocation) {
        for (MessageProcessor messageProcessor : messageProcessorList) {
            messageProcessor.before(invocation);
        }
    }

    @Override
    public Result after(Result result) {
        for (MessageProcessor messageProcessor : messageProcessorList) {
            result = messageProcessor.after(result);
        }
        return result;
    }
}
