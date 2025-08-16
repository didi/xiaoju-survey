package com.xiaojusurvey.engine.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum FileProviderEnum {
    MINIO("minio-oss"),
    ALI_OSS("ali-oss"),
    QINIU_OSS("qiniu-oss"),
    LOCAL_OSS("local-oss");

    final String description;
}
