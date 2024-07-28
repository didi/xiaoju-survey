package com.xiaojusurvey.engine.interceptor;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.auth.util.JwtTokenUtil;
import com.xiaojusurvey.engine.core.user.UserService;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class LoginInterceptor implements HandlerInterceptor {

    public static final String USER_NAME = "username";
    public static final String USER_ID = "_id";

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Resource
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //1:获取token jwt
        DecodedJWT jwt = jwtTokenUtil.getTokenStrByRequest(request);
        //2:判断token是否有效 && 是否过期
        if (ObjectUtils.isEmpty(jwt)) {
            //token找不到
            throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
        }
        if (jwt.getExpiresAt().getTime() < System.currentTimeMillis()) {
            //token超时
            throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
        }
        //查询用户信息
        Map<String, Claim> claims = jwt.getClaims();
        //获取用户名,密码
        String username = null, userId = null;
        if (!ObjectUtils.isEmpty(claims.get(USER_NAME))) {
            username = claims.get(USER_NAME).asString();
        }
        if (!ObjectUtils.isEmpty(claims.get(USER_ID))) {
            userId = claims.get(USER_ID).asString();
        }
        //判空
        if (ObjectUtils.isEmpty(username) || ObjectUtils.isEmpty(userId)) {
            //token超时
            throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
        }
        User user = userService.getUserById(userId);
        request.setAttribute("user", user);
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }
}
