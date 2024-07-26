package com.xiaojusurvey.engine.common.entity.workspace;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @description: 空间
 * @author: wangchenglong
 * @time: 2024/7/24 10:50
 */
@Document("workspace")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class Workspace extends BaseEntity {
    private String ownerId;
    private String name;
    private String description;
}
