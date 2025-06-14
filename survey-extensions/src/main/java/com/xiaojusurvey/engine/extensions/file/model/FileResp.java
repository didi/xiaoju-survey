package com.xiaojusurvey.engine.extensions.file.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文件响应类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileResp {

    /**
     * 文件标识符
     */
    private String key;

    /**
     * 文件访问路径
     */
    private String url;
}
