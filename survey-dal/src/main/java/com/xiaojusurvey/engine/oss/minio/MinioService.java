package com.xiaojusurvey.engine.oss.minio;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.util.FileUtil;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.InputStream;

@Component
@ConditionalOnBean(MinioClient.class)
@Slf4j
public class MinioService {

    @Resource
    private MinioClient minioClient;

    @Resource
    private MinioProperties minioProperties;

    /**
     * 上传文件
     *
     * @param bucket      桶名
     * @param filename    文件名
     * @param contentType 文件媒体类型
     * @param inputStream 输入流
     * @param streamSize  流长度
     * @return 文件在minio中的元信息
     */
    public ObjectWriteResponse putObject(String bucket,
                                         @NotBlank String filename,
                                         @NotBlank String contentType,
                                         @NotNull InputStream inputStream,
                                         @NotNull Long streamSize) {
        if (!StringUtils.hasText(bucket)) {
            bucket = minioProperties.getBucket();
        }
        try {
            return minioClient.putObject(PutObjectArgs.builder()
                    .object(filename)
                    .contentType(contentType)
                    .bucket(bucket)
                    .stream(inputStream, streamSize, -1)
                    .build());
        } catch (Exception e) {
            throw new FileException("Minio 发生错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
    }

    /**
     * 获取文件访问url
     *
     * @param bucket      桶
     * @param filename    文件名
     * @param expiredTime 过期时间
     * @return 文件访问url
     */
    public String getObjectUrl(String bucket,
                               @NotBlank String filename,
                               String expiredTime) {
        if (!StringUtils.hasText(bucket)) {
            bucket = minioProperties.getBucket();
        }
        if (!StringUtils.hasText(expiredTime)) {
            expiredTime = minioProperties.getExpiredTime();
        }
        try {
            if (minioProperties.getNeedPrivateRead()) {
                return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                        .bucket(bucket)
                        .object(filename)
                        .expiry(FileUtil.parseExpiryTimeToSeconds(expiredTime))
                        .method(Method.GET)
                        .build());
            } else {
                if (minioProperties.getUseSSL()) {
                    return "https://" + minioProperties.getEndpoint() + "/" + minioProperties.getBucket() + "/" + filename;
                } else {
                    return "http://" + minioProperties.getEndpoint() + "/" + minioProperties.getBucket() + "/" + filename;
                }
            }
        } catch (Exception e) {
            throw new FileException("Minio 发生错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
    }

    /**
     * 获取minio配置下的文件前缀
     *
     * @return 文件前缀
     */
    public String getFilePath() {
        return minioProperties.getPathPrefix();
    }

}
