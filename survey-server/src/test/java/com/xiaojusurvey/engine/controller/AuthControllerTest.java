package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.core.auth.AuthService;
import com.xiaojusurvey.engine.core.auth.vo.CaptchaVo;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.mockito.BDDMockito.given;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/10
 * @Description: 验证码API单元测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class AuthControllerTest {

    @Mock private AuthService authService;
    @InjectMocks private AuthController authController;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void captcha_endpoint_shouldReturn200WithIdAndImg() {
        given(authService.captcha()).willReturn(new CaptchaVo("abc123", "<svg>ok</svg>"));

        RpcResult<CaptchaVo> res = authController.captcha();

        Assert.assertTrue(res.getSuccess());
        Assert.assertEquals(Integer.valueOf(200), res.getCode());
        Assert.assertEquals("abc123", res.getData().getId());
        Assert.assertTrue(res.getData().getImg().startsWith("<svg"));
    }
}
