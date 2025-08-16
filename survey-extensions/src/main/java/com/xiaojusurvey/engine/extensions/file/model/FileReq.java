package com.xiaojusurvey.engine.extensions.file.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件请求类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileReq {

    /**
     * 文件实体
     */
    private MultipartFile file;
    /**
     * 配置文件的key
     */
    private String channel;

}
