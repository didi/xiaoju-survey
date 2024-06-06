package com.xiaojusurvey.engine.common.util.captcha;

import com.xiaojusurvey.engine.common.entity.user.Captcha;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description: 简单验证码生成工具类
 */
@Service("simpleCaptchaGenerator")
public class SimpleCaptchaGenerator implements CaptchaGenerator  {

    @Override
    public String generateRandomSvg(String text) {
        // 生成包含验证码的 SVG 数据
        String svgData = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"50\" viewBox=\"0,0,150,50\">" +
                "<rect width=\"100%\" height=\"100%\" fill=\"#f0f0f0\"/>" +
                "<text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#000\">" + text + "</text>" +
                "</svg>";

        return svgData;
    }
    @Override
    public Captcha generateRandomText(int length) {
        String chars = "123456789";
        StringBuilder text = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            text.append(chars.charAt(index));
        }
        Captcha captcha = new Captcha();
        captcha.setText(text.toString());
        return captcha;
    }


}
