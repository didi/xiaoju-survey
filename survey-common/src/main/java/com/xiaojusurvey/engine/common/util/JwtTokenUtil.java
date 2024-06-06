package com.xiaojusurvey.engine.common.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.token.Token;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtTokenUtil {

    @Value("${XIAOJU_SURVEY_JWT_EXPIRES_IN}")
    private long expirationTime;

    @Value("${XIAOJU_SURVEY_JWT_SECRET}")
    private String secret;

    private static final long HOUR_MILLISECOND = 60 * 60 * 1000;

    private static final long HOUR_SECOND = 60 * 60 * 1000;

    /**
     * 生成token
     * @param username
     * @return
     */
    public Token generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime * HOUR_MILLISECOND);
        String token = JWT.create()
                .withClaim("username", username)
                .withExpiresAt(expiryDate)
                .withJWTId(UUID.randomUUID().toString())
                .sign(Algorithm.HMAC256(secret));

        return new Token(username, token,new Date(now.getTime() + expirationTime * HOUR_SECOND));
    }

    /**
     * 解密访问令牌
     * @param tokenString 令牌
     * @return 密钥内容
     */
    public Token decodeToken(String tokenString) {
        Token token = new Token();
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            DecodedJWT jwt = verifier.verify(tokenString);
            Map<String, Claim> claims = jwt.getClaims();
            token.setUsername(claims.get("username").asString());
            token.setToken(tokenString);
            token.setExpirationTime(jwt.getExpiresAt());
            return token;
        }catch (Exception e){
            throw new ServiceException(RespErrorCode.USER_NOT_EXISTS.getMessage(), RespErrorCode.USER_NOT_EXISTS.getCode());
        }

    }
}
