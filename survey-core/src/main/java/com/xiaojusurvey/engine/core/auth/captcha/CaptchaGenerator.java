package com.xiaojusurvey.engine.core.auth.captcha;

import com.xiaojusurvey.engine.common.entity.user.Captcha;
import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description: 验证码生成顶级接口
 */
public interface CaptchaGenerator {
    /**
     * 根据文本生成SVG
     * @param text
     * @return
     */
    String generateRandomSvg(String text);


    /**
     * 生成验证码持久对象
     * @param length
     * @return
     */
    Captcha generateRandomText(int length);

    default CaptchaVo generateRandomSvg(Captcha captcha) {
        if (captcha == null || captcha.getId() == null){
            throw new IllegalArgumentException("captcha or id is null");
        }else {
            return new CaptchaVo(captcha.getId(), generateRandomSvg(captcha.getText()));
        }
    }
}