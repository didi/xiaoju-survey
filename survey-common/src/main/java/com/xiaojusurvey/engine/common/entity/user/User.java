package com.xiaojusurvey.engine.common.entity.user;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description: 用户信息
 */
@Document("user")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class User extends BaseEntity{

    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @NotNull(message = "用户名不能为空")
    private String username;


    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    @NotNull(message = "密码不能为空")
    private String password;


}
