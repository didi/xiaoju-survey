package com.xiaojusurvey.engine.common.entity.user;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description:
 */
@Document("captcha")
@Data
public class Captcha extends BaseEntity {

    /**
     * 验证码
     */
    private String text;

    //1 小时过期（3600s）
    @Indexed(expireAfterSeconds = 3600)
    private Date expireAt = new Date();

}
