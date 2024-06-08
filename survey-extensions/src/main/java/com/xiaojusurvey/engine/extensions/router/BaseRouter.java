package com.xiaojusurvey.engine.extensions.router;

import com.xiaojusurvey.engine.extensions.processor.ExtensionProcessor;
import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;


public abstract class BaseRouter<T extends ExtensionProcessor> implements ApplicationContextAware, InitializingBean {

    protected ApplicationContext applicationContext;

    protected List<T> extensionProcessors = new ArrayList<>();

    public void before(Invocation invocation) {
        for (T extensionProcessor : extensionProcessors) {
            extensionProcessor.before(invocation);
        }
    }

    public Result after(Result result) {
        for (T extensionProcessor : extensionProcessors) {
            result = extensionProcessor.after(result);
        }
        return result;
    }

    public abstract Class<?> annotationClass();

    protected void initExtensionProcessors(Class<T> clazz) {
        Map<String, T> messageProcessorMap = applicationContext.getBeansOfType(clazz);
        if (!CollectionUtils.isEmpty(messageProcessorMap)) {
            messageProcessorMap.entrySet().stream().forEach(e -> extensionProcessors.add(e.getValue()));
            extensionProcessors.sort(Comparator.comparing(ExtensionProcessor::getOrder));
        }
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
