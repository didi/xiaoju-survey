package com.xiaojusurvey.engine.oss.minio;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "xiaoju.survey.file.minio")
@Getter
@Setter
public class MinioProperties {

    /**
     * 是否启用minio
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
     * minio账号
     */
    private String accessKey;

    /**
     * minio密钥
     */
    private String secretKey;

    /**
     * minio桶名
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
    private Boolean useSSL = true;

    /**
     * 过期时间
     */
    private String expiredTime = "2h";

}