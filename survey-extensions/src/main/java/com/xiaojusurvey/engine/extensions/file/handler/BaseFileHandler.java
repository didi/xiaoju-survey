package com.xiaojusurvey.engine.extensions.file.handler;

import com.xiaojusurvey.engine.common.enums.FileProviderEnum;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public abstract class BaseFileHandler {

    /**
     * 获取文件处理器对应的枚举类
     *
     * @return 文件处理器枚举类
     */
    public abstract FileProviderEnum getProvider();

    /**
     * 上传单个文件
     *
     * @param fileReq 文件请求
     * @return 文件实体
     */
    public abstract FileResp uploadFile(@NotNull FileReq fileReq);

    /**
     * 获取文件访问url
     *
     * @param key 文件标识符
     * @return 文件访问url
     */
    public abstract String getFileUrl(@NotBlank String key);
}
