package com.xiaojusurvey.engine.core.workspace;

import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceInfoVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberVO;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @description:
 * @author: wangchenglong
 * @time: 2024/7/24 14:23
 */
public interface WorkspaceService {

   String createWorkspace(HttpServletRequest request, @RequestBody WorkspaceParam workspaceParam);

   List<WorkspaceInfoVO> findAll(HttpServletRequest request, Integer pageSize, Integer curPage, String name);

   WorkspaceMemberVO getWorkspaceInfo(HttpServletRequest request, String workspaceId);

   String update(HttpServletRequest request, @RequestBody WorkspaceParam workspaceParam, String workspaceId);

}
