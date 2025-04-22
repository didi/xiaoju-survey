package com.xiaojusurvey.engine.common.entity.survey;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import com.xiaojusurvey.engine.common.enums.EncryptType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("clientEncrypt")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class ClientEncrypt extends BaseEntity {


    private ClientEncryptData data;


    private EncryptType type;


    @Data
    public static class ClientEncryptData {
        private String secretKey; // aes加密的密钥
        private String publicKey; // rsa加密的公钥
        private String privateKey; // rsa加密的私钥
    }


}
