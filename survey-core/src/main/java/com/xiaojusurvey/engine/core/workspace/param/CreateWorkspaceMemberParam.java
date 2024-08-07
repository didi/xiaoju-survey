package com.xiaojusurvey.engine.core.workspace.param;

import lombok.Data;

/**
 * @description:
 * @author: wangchenglong
 * @time: 2024/8/1 11:17
 */
@Data
public class CreateWorkspaceMemberParam {

    private String userId;

    private String role;

    private String workspaceId;
}
