package com.xiaojusurvey.engine.oss.local;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "xiaoju.survey.file.local")
@Getter
@Setter
public class LocalProperties {

    /**
     * 本地静态渲染类型
     */
    private String localStaticRenderType = "server";

    /**
     * 是否需要
     */
    private Boolean needPrivateRead = false;

    /**
     * 文件存储前缀
     */
    private String pathPrefix = "userUpload";

    /**
     * nginx静态路径
     */
    private String nginxStaticPath;

}