package com.xiaojusurvey.engine.oss.qiniuyun;

import com.qiniu.http.Response;
import com.qiniu.storage.DownloadUrl;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.util.FileUtil;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.InputStream;

@Component
@ConditionalOnBean({Auth.class, UploadManager.class})
public class QiniuYunService {

    @Resource
    private QiniuYunProperties qiniuYunProperties;

    @Resource
    private Auth auth;

    @Resource
    private UploadManager uploadManager;

    /**
     * 上传文件
     *
     * @param bucket      桶名
     * @param filename    文件名
     * @param inputStream 文件流
     * @return 文件上传后的响应
     */
    public Response putObject(String bucket, @NotBlank String filename, @NotNull InputStream inputStream) {
        if (!StringUtils.hasText(bucket)) {
            bucket = qiniuYunProperties.getBucket();
        }
        try {
            String token = auth.uploadToken(bucket);
            return uploadManager.put(inputStream, filename, token, null, null);
        } catch (Exception e) {
            throw new FileException("QiniuYun OSS 发生错误：" + e.getMessage(), RespErrorCode.OSS_CLIENT_ERROR.getCode(), e);
        }
    }

    /**
     * 获取文件访问链接
     *
     * @param filename    文件名
     * @param expiredTime 过期时间（秒）
     * @return 文件访问链接
     */
    public String getObjectUrl(String filename, String expiredTime) {
        if (!StringUtils.hasText(expiredTime)) {
            expiredTime = qiniuYunProperties.getExpiredTime();
        }
        try {
            DownloadUrl url = new DownloadUrl(qiniuYunProperties.getEndpoint(), qiniuYunProperties.getUseSsl(), filename);
            if (qiniuYunProperties.getNeedPrivateRead()) {
                long deadline = System.currentTimeMillis() / 1000 + FileUtil.parseExpiryTimeToSeconds(expiredTime);
                return url.buildURL(auth, deadline);
            } else {
                return url.buildURL();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获取文件前缀路径
     *
     * @return 文件前缀路径
     */
    public String getFilePath() {
        return qiniuYunProperties.getPathPrefix();
    }

}
