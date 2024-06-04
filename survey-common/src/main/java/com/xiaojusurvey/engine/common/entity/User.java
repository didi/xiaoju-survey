package com.xiaojusurvey.engine.common.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;


@Document("user")
@Data
public class User extends BaseEntity{

    private String password;

    private String username;

}
