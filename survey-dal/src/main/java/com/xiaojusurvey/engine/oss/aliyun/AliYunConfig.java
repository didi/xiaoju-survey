package com.xiaojusurvey.engine.oss.aliyun;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.Bucket;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

@Configuration
@Slf4j
public class AliYunConfig {

    @Resource
    private AliYunProperties aliYunProperties;

    @Bean
    @ConditionalOnExpression("'${xiaoju.survey.file.provider}' == 'ali_oss' || '${xiaoju.survey.file.aliyun.enabled}' == 'true'")
    public OSS ossClient() {
        if (Objects.isNull(aliYunProperties)) {
            throw new FileException("AliYun OSS 实例化失败：配置参数为空", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        log.info("正在连接 AliYun OSS，地址：{}", aliYunProperties.getEndpoint());
        if (!StringUtils.hasText(aliYunProperties.getEndpoint())) {
            throw new FileException("AliYun OSS 链接地址为空", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }

        if (!StringUtils.hasText(aliYunProperties.getAccessKey()) || !StringUtils.hasText(aliYunProperties.getSecretKey())) {
            throw new FileException("AliYun OSS 未配置访问凭据", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        OSS ossClient = new OSSClientBuilder().build(aliYunProperties.getEndpoint(), aliYunProperties.getAccessKey(), aliYunProperties.getSecretKey());
        try {
            List<Bucket> buckets = ossClient.listBuckets();
            log.info("AliYun OSS 连接成功，共有{}个桶", buckets.size());
        } catch (Exception e) {
            throw new FileException("AliYun OSS 连接失败，错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode(), e);
        }
        return ossClient;
    }

}
