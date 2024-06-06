package com.xiaojusurvey.engine.core.auth;

import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;
import com.xiaojusurvey.engine.common.entity.user.UserDTO;
import com.xiaojusurvey.engine.common.entity.user.UserVo;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: AuthService
 */
public interface AuthService {
    CaptchaVo captcha();

    UserVo register(UserDTO userDTO);

    UserVo login(UserDTO userDTO);
}
