package com.xiaojusurvey.engine.common.entity.workspace;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @description: 空间成员
 * @author: wangchenglong
 * @time: 2024/7/24 10:51
 */
@Document("workspaceMember")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class WorkspaceMember extends BaseEntity {
    private String userId;

    private String workspaceId;

    private String role;
}
