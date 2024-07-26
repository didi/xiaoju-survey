package com.xiaojusurvey.engine.core.workspace;

import com.xiaojusurvey.engine.common.entity.workspace.WorkspaceMember;

import java.util.List;

/**
 * @description:
 * @author: wangchenglong
 * @time: 2024/7/24 14:23
 */
public interface WorkspaceMemberService {

    List<WorkspaceMember> getWorkspaceMembers(String workspaceId, List<String> userId);

    List<WorkspaceMember> getWorkspaceMembers(String userId, Integer pageSize, Integer curPage);

    List<WorkspaceMember> getWorkspaceMembers(String workspaceId);
}
