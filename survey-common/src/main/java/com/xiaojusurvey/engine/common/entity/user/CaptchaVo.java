package com.xiaojusurvey.engine.common.entity.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description:
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CaptchaVo {

    private String id;

    /**
     * 验证码
     */
    private String img;

}
