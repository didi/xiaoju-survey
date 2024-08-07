package com.xiaojusurvey.engine.core.workspace;

import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceListVO;
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

   WorkspaceListVO findAll(HttpServletRequest request, Integer pageSize, Integer curPage, String name);

   WorkspaceMemberVO getWorkspaceInfo(HttpServletRequest request, String workspaceId);

   void update(HttpServletRequest request, @RequestBody WorkspaceParam workspaceParam, String workspaceId);

   void delete(HttpServletRequest request, String workspaceId);

   List<WorkspaceMemberVO> findAllByUserId(HttpServletRequest request);
}
