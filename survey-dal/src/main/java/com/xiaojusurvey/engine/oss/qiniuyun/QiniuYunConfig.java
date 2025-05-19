package com.xiaojusurvey.engine.oss.qiniuyun;

import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Objects;

@org.springframework.context.annotation.Configuration
@Slf4j
public class QiniuYunConfig {

    @Resource
    private QiniuYunProperties qiniuYunProperties;

    @Bean
    public Auth getAuth() {
        if (Objects.isNull(qiniuYunProperties)) {
            throw new FileException("QiniuYun OSS 实例化失败：配置参数为空", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        log.info("正在连接 QiniuYun OSS，地址：{}", qiniuYunProperties.getEndpoint());
        if (!StringUtils.hasText(qiniuYunProperties.getEndpoint())) {
            throw new FileException("QiniuYun OSS 链接地址为空", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        if (!StringUtils.hasText(qiniuYunProperties.getAccessKey()) || !StringUtils.hasText(qiniuYunProperties.getSecretKey())) {
            throw new FileException("QiniuYun OSS 未配置访问凭据", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        Auth auth = Auth.create(qiniuYunProperties.getAccessKey(), qiniuYunProperties.getSecretKey());
        try {
            BucketManager bucketManager = new BucketManager(auth, getConfiguration());
            String[] buckets = bucketManager.buckets();
            log.info("QiniuYun OSS 连接成功，共有{}个桶", buckets.length);
        } catch (Exception e) {
            throw new FileException("QiniuYun OSS 连接失败，错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        return auth;
    }

    public Configuration getConfiguration() {
        return new Configuration(Region.autoRegion());
    }

    @Bean
    public UploadManager getUploadManager() {
        return new UploadManager(getConfiguration());
    }
}
