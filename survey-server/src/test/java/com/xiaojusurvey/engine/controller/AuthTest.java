package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.SurveyApplication;
import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.entity.user.UserDTO;
import com.xiaojusurvey.engine.common.entity.user.UserVo;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.JwtTokenUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private AuthenticationManager authenticationManager;

    @Resource
    AuthController authController;

    @Test
    public void captcha() {
        RpcResult<CaptchaVo> captcha = authController.captcha();

        System.out.println(captcha);
    }

    @Test
    public void register() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("admin");
        userDTO.setPassword("admin");
        userDTO.setCaptchaId("666169681618c21f3f6b90cd");
        userDTO.setCaptcha("3377");
        RpcResult<UserVo> register = authController.register(userDTO);
        System.out.println(register);
    }

    @Test
    public void login() {
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzE3Njg4ODcyLCJqdGkiOiI4MDYwMDhhOC0xODVkLTQ1YjgtYmNhMy04YzRiNmRhN2IyNjcifQ.Sq2WMKsdOTqo-Xbw_g_FjQWv1pwRwWwUAJIDON9c2jA
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("admin");
        userDTO.setPassword("admin");
        userDTO.setCaptchaId("66617239de72dc5238d1c32e");
        userDTO.setCaptcha("1167");
        RpcResult<UserVo> register = authController.login(userDTO);
        System.out.println(register);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User principal = (User) authentication.getPrincipal();
        System.out.println(principal);
    }


}
