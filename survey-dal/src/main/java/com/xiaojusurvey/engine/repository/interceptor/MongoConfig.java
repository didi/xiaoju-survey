package com.xiaojusurvey.engine.repository.interceptor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * @description: MongoEntityInterceptor
 * @author: wangchenglong
 * @time: 2024/7/30 17:36
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
    @Bean
    public MongoEntityInterceptor auditEntityMongoListener() {
        return new MongoEntityInterceptor();
    }

}
