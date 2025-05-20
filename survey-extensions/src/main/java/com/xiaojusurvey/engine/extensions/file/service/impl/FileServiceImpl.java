package com.xiaojusurvey.engine.extensions.file.service.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.enums.FileProviderEnum;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.extensions.file.handler.FileHandler;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import com.xiaojusurvey.engine.extensions.file.service.FileService;
import com.xiaojusurvey.engine.oss.FileProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class FileServiceImpl implements FileService {

    @Resource
    private List<FileHandler> fileHandlers;

    @Resource
    private FileProperties fileProperties;

    /**
     * 获取文件处理器
     * <p>如果channel为空则使用配置中指定的处理器，如果没有配置则使用默认的本地文件处理器</p>
     * <p>如果文件处理器因配置错误而没有注册为Bean的话，会抛出错误</p>
     *
     * @param channel 文件处理器的标识符
     * @return 文件处理器实例
     */
    private FileHandler getHandler(String channel) {
        if (!StringUtils.hasText(channel)) {
            if (Objects.nonNull(fileProperties.getProvider())) {
                channel = fileProperties.getProvider().getDescription();
            } else {
                channel = FileProviderEnum.LOCAL_OSS.getDescription();
            }
        }
        for (FileHandler fileHandler : fileHandlers) {
            if (Objects.nonNull(fileHandler)
                    && Objects.equals(channel, fileHandler.getProvider().getDescription())) {
                return fileHandler;
            }
        }
        throw new FileException("参数有误，channel不正确：" + channel + "，请检查channel或对应oss是否正确配置", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
    }


    @Override
    public FileResp upload(FileReq fileReq) {
        return getHandler(fileReq.getChannel()).uploadFile(fileReq);
    }

    @Override
    public String getUrl(@NotBlank String channel, String key) {
        return getHandler(channel).getFileUrl(key);
    }
}
