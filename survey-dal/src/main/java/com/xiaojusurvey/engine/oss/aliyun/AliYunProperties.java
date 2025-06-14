package com.xiaojusurvey.engine.oss.aliyun;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "xiaoju.survey.file.aliyun")
@Getter
@Setter
public class AliYunProperties {
    /**
     * 是否启用阿里云
     */
    private Boolean enabled = false;

    /**
     * 是否开启鉴权读取
     */
    private Boolean needPrivateRead = true;

    /**
     * 文件前缀
     */
    private String pathPrefix = "userUpload";

    /**
     * 账号
     */
    private String accessKey;

    /**
     * 密钥
     */
    private String secretKey;

    /**
     * 桶名
     */
    private String bucket;

    /**
     * 地区
     */
    private String region;

    /**
     * 连接地址
     */
    private String endpoint;

    /**
     * 是否使用ssl
     */
    private Boolean useSsl = true;

    /**
     * 过期时间
     */
    private String expiredTime = "2h";
}
