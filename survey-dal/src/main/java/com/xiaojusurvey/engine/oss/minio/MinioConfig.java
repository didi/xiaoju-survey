package com.xiaojusurvey.engine.oss.minio;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import io.minio.MinioClient;
import io.minio.messages.Bucket;
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
public class MinioConfig {

    @Resource
    private MinioProperties minioProperties;

    /**
     * 动态配置Minio Client
     * <p>当配置项xiaoju.survey.file.minio.enable=true时或xiaoju.survey.file.provider=minio时会注入</p>
     *
     * @return {@link MinioClient}
     */
    @Bean
    @ConditionalOnExpression("'${xiaoju.survey.file.provider:}' == 'minio' || '${xiaoju.survey.file.minio.enabled:false}' == 'true'")
    public MinioClient minioClient() {
        if (Objects.isNull(minioProperties)) {
            throw new FileException("Minio 实例化失败：配置参数为空", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        log.info("正在连接 Minio Client，地址：{}", minioProperties.getEndpoint());
        if (!StringUtils.hasText(minioProperties.getEndpoint())) {
            throw new FileException("Minio 链接地址为空", RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        MinioClient.Builder builder = MinioClient.builder().endpoint(minioProperties.getEndpoint());
        if (StringUtils.hasText(minioProperties.getAccessKey()) && StringUtils.hasText(minioProperties.getSecretKey())) {
            builder.credentials(minioProperties.getAccessKey(), minioProperties.getSecretKey());
        } else {
            log.warn("Minio 未配置访问凭据，建议采用更安全的访问方式");
        }
        if (StringUtils.hasText(minioProperties.getRegion())) {
            builder.region(minioProperties.getRegion());
        }
        MinioClient minioClient = builder.build();
        try {
            List<Bucket> buckets = minioClient.listBuckets();
            log.info("Minio 连接成功，共有{}个桶", buckets.size());
        } catch (Exception e) {
            throw new FileException("Minio 连接失败，错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
        return minioClient;
    }
}
