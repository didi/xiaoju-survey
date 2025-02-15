package com.xiaojusurvey.engine.common.enums;

import lombok.Getter;

@Getter
public enum EncryptType {

    AES("aes"),
    RSA("rsa");

    private String type;

    EncryptType(String type) {
        this.type = type;
    }
}
