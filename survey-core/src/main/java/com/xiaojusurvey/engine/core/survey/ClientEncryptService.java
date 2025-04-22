package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.entity.survey.ClientEncrypt;

public interface ClientEncryptService {
    ClientEncrypt getEncryptInfoById(String sessionId);
}
