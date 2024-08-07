package com.xiaojusurvey.engine.bean;

import org.dozer.DozerBeanMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @description: net.sf.dozer
 * @author: wangchenglong
 * @time: 2024/7/24 22:25
 */
@Configuration
public class ConvertorConfig {
    @Bean
    public DozerBeanMapper dozerBeanMapper() {
        return new DozerBeanMapper();
    }
}
