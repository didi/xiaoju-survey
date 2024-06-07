package com.xiaojusurvey.engine.core.auth;

import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;
import com.xiaojusurvey.engine.core.auth.domain.UserParam;
import com.xiaojusurvey.engine.core.auth.domain.UserVo;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: AuthService
 */
public interface AuthService {
    CaptchaVo captcha();

    UserVo register(UserParam userParam);

    UserVo login(UserParam userParam);
}
