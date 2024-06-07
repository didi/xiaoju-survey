package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;
import com.xiaojusurvey.engine.core.auth.domain.UserParam;
import com.xiaojusurvey.engine.core.auth.domain.UserVo;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.auth.AuthService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description: 登录/注册
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Resource
    private AuthService authService;

    /**
     * 获取验证码信息
     * @return 结果
     */
    @PostMapping("/captcha")
    public RpcResult<CaptchaVo> captcha() {
        return RpcResultUtil.createSuccessResult(authService.captcha());
    }


    /**
     * 注册方法
     * @return 结果
     */
    @PostMapping("/register")
    public RpcResult<UserVo> register(@Validated @RequestBody UserParam userParam) {
        return RpcResultUtil.createSuccessResult(authService.register(userParam));
    }


    /**
     * 登录方法
     * @return 结果
     */
    @PostMapping("/login")
    public RpcResult<UserVo> login(@Validated @RequestBody UserParam userParam) {
        return RpcResultUtil.createSuccessResult(authService.login(userParam));
    }


}
