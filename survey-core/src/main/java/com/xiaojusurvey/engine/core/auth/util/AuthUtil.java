package com.xiaojusurvey.engine.core.auth.util;

import com.xiaojusurvey.engine.common.entity.user.User;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 安全相关工具类
 */
public class AuthUtil {

    /**
     * 生成BCryptPasswordEncoder密码
     * @return 加密字符串
     */
    public static String encryptPassword(String password,String username) {
        String inputWithSalt = password + username;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(inputWithSalt.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("");
        }
    }



}
