package com.xiaojusurvey.engine.extensions.file.service;


import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public interface FileService {

    /**
     * 上传文件
     *
     * @param fileReq 上传的文件参数
     * @return 文件信息
     */
    FileResp upload(@NotNull FileReq fileReq);

    /**
     * 获取文件访问链接
     *
     * @param key 文件唯一标识符
     * @return 文件访问url
     */
    String getUrl(@NotBlank String channel, @NotBlank String key);

}
