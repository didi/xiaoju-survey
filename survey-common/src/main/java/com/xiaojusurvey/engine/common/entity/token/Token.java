package com.xiaojusurvey.engine.common.entity.token;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-06
 * @Description: token
 */
@Document("token")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Token extends BaseEntity {
    private String username;

    private String token;

    /**
     * 过期时间
     */
    private Date expirationTime;
}
