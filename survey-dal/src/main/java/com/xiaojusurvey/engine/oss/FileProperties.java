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
    private FileProviderEnum provider = FileProviderEnum.LOCAL_OSS;
}
