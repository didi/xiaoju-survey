package com.xiaojusurvey.engine.core.auth.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.token.Token;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.UUID;
import java.util.regex.Pattern;

@Component
public class JwtTokenUtil {

    @Value("${XIAOJU_SURVEY_JWT_EXPIRES_IN}")
    private long expirationTime;

    @Value("${XIAOJU_SURVEY_JWT_SECRET}")
    private String secret;

    private static final long HOUR_MILLISECOND = 60 * 60 * 1000;

    private static final long HOUR_SECOND = 60 * 60 * 1000;

    /**
     * 认证头
     */
    private static final String AUTHORIZATION_HEADER = "Authorization";

    /**
     * 空格
     */
    private static final String SPACE = " ";

    /**
     * 令牌前缀正则表达式
     */
    private static final String BEARER_PATTERN = "^Bearer$";

    private static final int LENGTH = 2;

    /**
     * 生成token
     *
     * @param user
     * @return
     */
    public Token generateToken(User user) {
        //注意这里的是明文密码
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime * HOUR_MILLISECOND);
        String token = JWT.create()
                .withClaim("username", user.getUsername())
                .withClaim("_id", user.getId())
                .withExpiresAt(expiryDate)
                .withJWTId(UUID.randomUUID().toString())
                .sign(Algorithm.HMAC256(secret));
        return new Token(user.getUsername(), token, new Date(now.getTime() + expirationTime * HOUR_SECOND));
    }

    /**
     * 解密访问令牌
     *
     * @param tokenString 令牌
     * @return 密钥内容
     */
    public DecodedJWT decodeToken(String tokenString) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            DecodedJWT jwt = verifier.verify(tokenString);
            return jwt;
        } catch (Exception e) {
            throw new ServiceException(RespErrorCode.USER_NOT_EXISTS.getMessage(), RespErrorCode.USER_NOT_EXISTS.getCode());
        }
    }


    public DecodedJWT getTokenStrByRequest(HttpServletRequest request) {
        String header = request.getHeader(AUTHORIZATION_HEADER);
        if (!StringUtils.hasText(header)) {
            throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
        }
        String[] splits = header.split(SPACE);
        if (splits.length != LENGTH) {
            throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
        }
        if (!Pattern.matches(BEARER_PATTERN, splits[0])) {
            throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
        }
        String tokenString = splits[1];
        //解析
        return decodeToken(tokenString);
    }
}
