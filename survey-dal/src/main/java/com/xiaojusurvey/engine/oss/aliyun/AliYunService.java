package com.xiaojusurvey.engine.oss.aliyun;

import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.model.PutObjectResult;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.util.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.Objects;

@Component
@Slf4j
@ConditionalOnBean(OSS.class)
public class AliYunService {

    @Resource
    private OSS ossClient;

    @Resource
    private AliYunProperties aliYunProperties;

    /**
     * 上传文件
     *
     * @param bucket      桶名
     * @param filename    文件名
     * @param inputStream 输入流
     * @return 文件在AliYun OSS中的元信息
     */
    public PutObjectResult putObject(String bucket,
                                     @NotBlank String filename,
                                     @NotNull InputStream inputStream) {
        if (!StringUtils.hasText(bucket)) {
            bucket = aliYunProperties.getBucket();
        }
        try {
            return ossClient.putObject(bucket, filename, inputStream);
        } catch (Exception e) {
            throw new FileException("AliYun OSS 发生错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode());
        }
    }

    /**
     * 获取文件访问链接
     *
     * @param bucket      桶名
     * @param filename    文件名（路径）
     * @param expiredTime 过期时间
     * @return 文件访问链接
     */
    public String getSignatureUrl(String bucket, String filename, String expiredTime) {
        if (!StringUtils.hasText(bucket)) {
            bucket = aliYunProperties.getBucket();
        }
        if (!StringUtils.hasText(expiredTime)) {
            expiredTime = aliYunProperties.getExpiredTime();
        }
        if (aliYunProperties.getNeedPrivateRead()) {
            Date expiration = new Date(System.currentTimeMillis() + FileUtil.parseExpiryTimeToSeconds(expiredTime) * 1000L);
            URL url = ossClient.generatePresignedUrl(bucket, filename, expiration, HttpMethod.GET);
            if (Objects.isNull(url)) {
                throw new FileException("AliYun OSS 发生错误，无法获取文件访问链接", RespErrorCode.OSS_CLIENT_ERROR.getCode());
            }
            return url.toString();
        } else {
            return (aliYunProperties.getUseSsl() ? "https" : "http") + "://" + aliYunProperties.getEndpoint() + "/" + filename;
        }
    }

    /**
     * 获取文件前缀
     *
     * @return 文件前缀
     */
    public String getFilePath() {
        return aliYunProperties.getPathPrefix();
    }
}
