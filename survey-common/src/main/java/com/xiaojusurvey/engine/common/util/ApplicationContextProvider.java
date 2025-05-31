package com.xiaojusurvey.engine.common.util;

import lombok.Getter;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 获取SpringBoot运行上下文
 */
@Component
public class ApplicationContextProvider implements ApplicationContextAware {
    @Getter
    private static ApplicationContext applicationContext;


    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ApplicationContextProvider.applicationContext = applicationContext;
    }
}
