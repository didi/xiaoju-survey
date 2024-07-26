package com.xiaojusurvey.engine.core.auth.util;


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
     *
     * @return 加密字符串
     */
    public static String encryptPassword(String password, String username) {
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

    /**
     * SHA-256
     * @param password
     * @return
     */
    public static String hash256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            // 将 byte 数组转换为十六进制字符串
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }


}
