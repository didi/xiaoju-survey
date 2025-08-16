package com.xiaojusurvey.engine.extensions.file.handler.impl;

import com.qiniu.http.Response;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.enums.FileProviderEnum;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.util.FileUtil;
import com.xiaojusurvey.engine.extensions.file.handler.BaseFileHandler;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import com.xiaojusurvey.engine.oss.qiniuyun.QiniuYunService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.InputStream;
import java.util.Objects;

@Component
@Slf4j
@ConditionalOnBean(QiniuYunService.class)
public class QiniuYunFileHandler extends BaseFileHandler {

    @Resource
    private QiniuYunService qiniuYunService;

    @Override
    public FileProviderEnum getProvider() {
        return FileProviderEnum.QINIU_OSS;
    }

    @Override
    public FileResp uploadFile(FileReq fileReq) {
        MultipartFile file = fileReq.getFile();
        if (Objects.isNull(file) || file.isEmpty()) {
            throw new FileException("上传文件为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        String filename = FileUtil.generateUniqueFilename(file.getOriginalFilename());
        String filePath = qiniuYunService.getFilePath();
        String key = FileUtil.join(filePath, filename);
        try (InputStream inputStream = file.getInputStream()) {
            Response response = qiniuYunService.putObject(null, key, inputStream);
            if (Objects.isNull(response) || !response.isOK()) {
                throw new FileException("上传文件失败：" + response, RespErrorCode.UPLOAD_FILE_ERROR.getCode());
            } else {
                return new FileResp(key, getFileUrl(key));
            }
        } catch (Exception e) {
            throw new FileException("上传文件失败：" + e.getMessage(), RespErrorCode.UPLOAD_FILE_ERROR.getCode(), e);
        }
    }

    @Override
    public String getFileUrl(String key) {
        return qiniuYunService.getObjectUrl(key, null);
    }
}
