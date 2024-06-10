package com.xiaojusurvey.engine.core.auth;

import com.xiaojusurvey.engine.core.auth.vo.CaptchaVo;
import com.xiaojusurvey.engine.core.auth.param.UserParam;
import com.xiaojusurvey.engine.core.auth.vo.UserVo;

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
