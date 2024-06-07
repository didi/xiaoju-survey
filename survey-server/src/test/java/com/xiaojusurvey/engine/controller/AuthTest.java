package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.SurveyApplication;
import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.auth.domain.UserParam;
import com.xiaojusurvey.engine.core.auth.domain.UserVo;
import com.xiaojusurvey.engine.core.auth.util.JwtTokenUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 * 问卷单元测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = SurveyApplication.class)
public class AuthTest {

    @Resource
    private JwtTokenUtil jwtTokenUtil;



    @Resource
    AuthController authController;

    @Test
    public void captcha() {
        RpcResult<CaptchaVo> captcha = authController.captcha();

        System.out.println(captcha);
    }

    @Test
    public void register() {
        UserParam userParam = new UserParam();
        userParam.setUsername("admin");
        userParam.setPassword("admin");
        userParam.setCaptchaId("666169681618c21f3f6b90cd");
        userParam.setCaptcha("3377");
        RpcResult<UserVo> register = authController.register(userParam);
        System.out.println(register);
    }

    @Test
    public void login() {
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzE3Njg4ODcyLCJqdGkiOiI4MDYwMDhhOC0xODVkLTQ1YjgtYmNhMy04YzRiNmRhN2IyNjcifQ.Sq2WMKsdOTqo-Xbw_g_FjQWv1pwRwWwUAJIDON9c2jA
        UserParam userParam = new UserParam();
        userParam.setUsername("admin");
        userParam.setPassword("admin");
        userParam.setCaptchaId("66617239de72dc5238d1c32e");
        userParam.setCaptcha("1167");
        RpcResult<UserVo> register = authController.login(userParam);
        System.out.println(register);

    }


}
