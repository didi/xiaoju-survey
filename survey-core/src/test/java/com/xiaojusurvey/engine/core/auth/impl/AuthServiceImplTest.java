package com.xiaojusurvey.engine.core.auth.impl;

import com.xiaojusurvey.engine.common.entity.user.Captcha;
import com.xiaojusurvey.engine.core.auth.captcha.CaptchaGenerator;
import com.xiaojusurvey.engine.core.auth.vo.CaptchaVo;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/10
 * @Description: 验证码service单元测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class AuthServiceImplTest {

    @Mock private MongoRepository mongoRepository;
    @Mock private CaptchaGenerator captchaGenerator;

    @InjectMocks private AuthServiceImpl authService;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this); // 你们其它用例没写这句也能跑，但这里加上更稳
    }

    @Test
    public void captcha_shouldSaveAndReturnIdAndSvg() {
        // 生成4位文本
        Captcha toSave = new Captcha();
        toSave.setText("s7T2");
        when(captchaGenerator.generateRandomText(4)).thenReturn(toSave);

        Captcha saved = new Captcha();
        saved.setId("abc123");
        saved.setText("s7T2");
        when(mongoRepository.save(toSave)).thenReturn(saved);

        when(captchaGenerator.generateRandomSvg(any(Captcha.class))).thenCallRealMethod();
        when(captchaGenerator.generateRandomSvg(anyString())).thenReturn("<svg>ok</svg>");

        CaptchaVo vo = authService.captcha();

        Assert.assertEquals("abc123", vo.getId());
        Assert.assertTrue(vo.getImg().startsWith("<svg"));
        verify(mongoRepository).save(toSave);
        verify(captchaGenerator).generateRandomText(4);
    }

    @Test
    public void checkCaptchaIsCorrect_ignoreCase_pass() {
        Captcha c = new Captcha();
        c.setId("id1");
        c.setText("aBc9");
        when(mongoRepository.findById("id1", Captcha.class)).thenReturn(c);

        authService.checkCaptchaIsCorrect("id1", "AbC9"); // 不抛异常即通过
    }

    @Test(expected = com.xiaojusurvey.engine.common.exception.ServiceException.class)
    public void checkCaptchaIsCorrect_wrong_thenThrow() {
        Captcha c = new Captcha();
        c.setId("id1");
        c.setText("aBc9");
        when(mongoRepository.findById("id1", Captcha.class)).thenReturn(c);

        authService.checkCaptchaIsCorrect("id1", "xxxx");
    }

    @Test(expected = com.xiaojusurvey.engine.common.exception.ServiceException.class)
    public void checkCaptchaIsCorrect_notFound_thenThrow() {
        when(mongoRepository.findById("notfound", Captcha.class)).thenReturn(null);
        authService.checkCaptchaIsCorrect("notfound", "1234");
    }
}
