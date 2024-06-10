package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.entity.token.Token;
import com.xiaojusurvey.engine.common.entity.user.Captcha;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.auth.impl.AuthServiceImpl;
import com.xiaojusurvey.engine.core.auth.param.UserParam;
import com.xiaojusurvey.engine.core.auth.util.JwtTokenUtil;
import com.xiaojusurvey.engine.core.auth.vo.UserVo;
import com.xiaojusurvey.engine.core.user.UserService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class AuthServiceImplTest {

    @Mock
    private MongoRepository mongoRepository;

    @Mock
    private UserService userService;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testRegister_SuccessfulRegistration() {
        UserParam userParam = new UserParam();
        userParam.setUsername("testUser");
        userParam.setPassword("testPassword");
        userParam.setCaptchaId("testCaptchaId");
        userParam.setCaptcha("testCaptcha");

        Captcha captcha = new Captcha();
        captcha.setText("testCaptcha");

        User user = new User();
        user.setUsername("testUser");

        UserVo expectedUserVo = new UserVo();
        expectedUserVo.setToken("testToken");
        expectedUserVo.setUsername("testUser");

        Mockito.when(mongoRepository.findById(Mockito.eq("testCaptchaId"), Mockito.eq(Captcha.class))).thenReturn(captcha);
        Mockito.when(mongoRepository.findOne(Mockito.any(), Mockito.eq(User.class))).thenReturn(null);
        Token testToken = new Token();
        testToken.setToken("testToken");
        Mockito.when(jwtTokenUtil.generateToken(Mockito.eq(userParam))).thenReturn(testToken);
        Mockito.when(mongoRepository.save(Mockito.any(User.class))).thenReturn(user);

        UserVo result = authService.register(userParam);

        assertEquals(expectedUserVo.getToken(), result.getToken());
        assertEquals(expectedUserVo.getUsername(), result.getUsername());
    }

    @Test
    public void testRegister_UserAlreadyExists() {
        UserParam userParam = new UserParam();
        userParam.setUsername("existingUser");
        userParam.setPassword("testPassword");
        userParam.setCaptchaId("testCaptchaId");
        userParam.setCaptcha("testCaptcha");

        User existingUser = new User();
        existingUser.setUsername("existingUser");
        //验证码
        Captcha captcha = new Captcha();
        captcha.setText("testCaptcha");
        captcha.setId("testCaptchaId");
        Mockito.when(mongoRepository.findById(Mockito.eq("testCaptchaId"), Mockito.eq(Captcha.class))).thenReturn(captcha);
        Mockito.when(mongoRepository.findOne(Mockito.any(), Mockito.eq(User.class))).thenReturn(existingUser);

        ServiceException exception = assertThrows(ServiceException.class, () -> authService.register(userParam));
        assertEquals("用户已存在", exception.getMessage());
    }

    @Test
    public void testLogin_SuccessfulLogin() {
        UserParam userParam = new UserParam();
        userParam.setUsername("testUser");
        userParam.setPassword("testPassword");
        userParam.setCaptchaId("testCaptchaId");
        userParam.setCaptcha("testCaptcha");

        Captcha captcha = new Captcha();
        captcha.setText("testCaptcha");

        User user = new User();
        user.setUsername("testUser");

        UserVo expectedUserVo = new UserVo();
        expectedUserVo.setToken("testToken");
        expectedUserVo.setUsername("testUser");

        Mockito.when(mongoRepository.findById(Mockito.eq("testCaptchaId"), Mockito.eq(Captcha.class))).thenReturn(captcha);
        Mockito.when(userService.loadUserByUsernameAndPassword(Mockito.eq("testUser"), Mockito.eq("testPassword"))).thenReturn(user);
        Token testToken = new Token();
        testToken.setToken("testToken");
        Mockito.when(jwtTokenUtil.generateToken(Mockito.eq(userParam))).thenReturn(testToken);

        UserVo result = authService.login(userParam);

        assertEquals(expectedUserVo.getToken(), result.getToken());
        assertEquals(expectedUserVo.getUsername(), result.getUsername());
    }

    @Test
    public void testLogin_InvalidCredentials() {
        UserParam userParam = new UserParam();
        userParam.setUsername("testUser");
        userParam.setPassword("wrongPassword");
        userParam.setCaptchaId("testCaptchaId");
        userParam.setCaptcha("testCaptcha");

        Captcha captcha = new Captcha();
        captcha.setText("testCaptcha");

        Mockito.when(mongoRepository.findById(Mockito.eq("testCaptchaId"), Mockito.eq(Captcha.class))).thenReturn(captcha);
        Mockito.when(userService.loadUserByUsernameAndPassword(Mockito.eq("testUser"), Mockito.eq("wrongPassword"))).thenThrow(new ServiceException("Invalid credentials", 401));

        ServiceException exception = assertThrows(ServiceException.class, () -> authService.login(userParam));
        assertEquals("Invalid credentials", exception.getMessage());
    }
}
