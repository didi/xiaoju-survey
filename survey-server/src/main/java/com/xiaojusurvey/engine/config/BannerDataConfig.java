package com.xiaojusurvey.engine.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

/**
 * @Author: maple
 * @CreateTime: 2024/6/9 14:23
 * @Description:
 */
@Getter
@Configuration
@Slf4j
public class BannerDataConfig implements InitializingBean {

    @Value("classpath:banner.json")
    private Resource bannerResource;

    private JSONObject bannerData;

    @Override
    public void afterPropertiesSet() throws Exception {
        try {
            String bannerContent = new String(Files.readAllBytes(bannerResource.getFile().toPath()), StandardCharsets.UTF_8);
            bannerData = JSON.parseObject(bannerContent);
        } catch (Exception e) {
            log.error("Initializing BannerDataConfig fail, e:", e);
        }
    }

}
