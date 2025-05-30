package com.xiaojusurvey.engine.extensions.file.handler.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.enums.FileProviderEnum;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.util.FileUtil;
import com.xiaojusurvey.engine.extensions.file.handler.BaseFileHandler;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import com.xiaojusurvey.engine.oss.local.LocalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Component
@Slf4j
public class LocalFileHandler extends BaseFileHandler {

    @Resource
    private LocalService localService;

    @Resource
    private Environment environment;

    @Value("${server.port}")
    private String port;

    @Override
    public FileProviderEnum getProvider() {
        return FileProviderEnum.LOCAL_OSS;
    }

    @Override
    public FileResp uploadFile(FileReq fileReq) {
        MultipartFile file = fileReq.getFile();
        if (Objects.isNull(file) || file.isEmpty()) {
            throw new FileException("上传文件为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        String filename = file.getOriginalFilename();
        if (!StringUtils.hasText(filename)) {
            filename = FileUtil.generateUniqueFilename(file.getOriginalFilename());
        }
        // 构建文件路径，确保使用正斜杠
        String filePath = buildFilePath(localService.getFilePath(), filename);
        // 构建物理存储路径
        Path physicalPath = Paths.get(localService.getPhysicalRootPath(), filePath);
        try {
            // 创建目录（如果不存在）
            Files.createDirectories(physicalPath.getParent());
            // 写入文件
            Files.write(physicalPath, file.getBytes());
        } catch (IOException e) {
            throw new FileException("本地写入文件失败：" + e.getMessage(), RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        return new FileResp(filePath, getFileUrl(filePath));
    }

    @Override
    public String getFileUrl(String key) {
        if (isLocalEnvironment()) {
            String defaultPort = StringUtils.hasText(port) ? port : "3000";
            return "http://localhost:" + defaultPort + "/" + key;
        }
        return "/" + key;
    }

    /**
     * 构建文件路径
     *
     * @param pathPrefix 路径前缀
     * @param filename   文件名
     * @return 文件全路径
     */
    private String buildFilePath(String pathPrefix, String filename) {
        if (pathPrefix == null || pathPrefix.isEmpty()) {
            return filename;
        }
        // 确保路径分隔符统一使用正斜杠
        return pathPrefix.replace('\\', '/') + "/" + filename;
    }

    /**
     * 检查是否为本地环境或开发环境
     *
     * @return true-是；false-否
     */
    private Boolean isLocalEnvironment() {
        String[] activeProfiles = environment.getActiveProfiles();
        for (String profile : activeProfiles) {
            if (profile.contains("local") || profile.contains("dev")
                    || profile.contains("LOCAL") || profile.contains("DEV")) {
                return true;
            }
        }
        return false;
    }
}