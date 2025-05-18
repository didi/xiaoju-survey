package com.xiaojusurvey.engine.extensions.file.handler.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.enums.FileProviderEnum;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.util.FileUtil;
import com.xiaojusurvey.engine.extensions.file.handler.FileHandler;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import com.xiaojusurvey.engine.oss.minio.MinioService;
import io.minio.ObjectWriteResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

@Component
@ConditionalOnBean(MinioService.class)
@Slf4j
public class MinioFileHandler extends FileHandler {

    @Resource
    private MinioService minioService;

    @Override
    public FileProviderEnum getProvider() {
        return FileProviderEnum.MINIO;
    }

    @Override
    public FileResp uploadFile(FileReq fileReq) {
        MultipartFile file = fileReq.getFile();
        if (Objects.isNull(file) || file.isEmpty()) {
            throw new FileException("上传文件为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        String filename = FileUtil.generateUniqueFilename(file.getOriginalFilename());
        String filePath = minioService.getFilePath();
        String key = FileUtil.join(filePath, filename);
        try (InputStream inputStream = file.getInputStream()) {
            ObjectWriteResponse objectWriteResponse = minioService.putObject(null, key, file.getContentType(), inputStream, file.getSize());
            if (Objects.isNull(objectWriteResponse)) {
                throw new FileException("上传文件失败", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
            } else {
                return new FileResp(key, getFileUrl(key));
            }
        } catch (IOException e) {
            throw new FileException("上传文件失败：" + e.getMessage(), RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
    }

    @Override
    public String getFileUrl(String key) {
        return minioService.getObjectUrl(null, key, null);
    }
}
