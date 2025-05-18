package com.xiaojusurvey.engine.oss;

import com.xiaojusurvey.engine.common.enums.FileProviderEnum;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "xiaoju.survey.file")
@Getter
@Setter
public class FileProperties {
    /**
     * 文件处理器，默认本地文件处理器
     */
    private FileProviderEnum provider = FileProviderEnum.LOCAL_OSS;

    /**
     * 是否需要验证身份
     */
    private Boolean needAuth = true;
}