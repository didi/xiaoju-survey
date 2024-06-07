package com.xiaojusurvey.engine.core.auth.domain;

import com.xiaojusurvey.engine.common.entity.user.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description: 包含验证码的user对象
 */
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class UserParam extends User {
    /**
     * 验证码ID
     */
    @NotBlank(message = "验证码不能为空")
    @NotNull(message = "验证码不能为空")
    private String captchaId;

    /**
     * 验证码信息
     */
    @NotBlank(message = "验证码不能为空")
    @NotNull(message = "验证码不能为空")
    private String captcha;
}
