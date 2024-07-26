package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.workspace.WorkspaceService;
import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceInfoVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @description: 空间、空间成员
 * @author: wangchenglong
 * @time: 2024/7/24 14:33
 */
@RequestMapping("/api/workspace")
@RestController
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    /**
     * 创建空间
     * @param request
     * @param workspaceParam
     * @return
     */
    @PostMapping
    public RpcResult<WorkspaceVO> create(HttpServletRequest request, @RequestBody WorkspaceParam workspaceParam) {
        return RpcResultUtil.createSuccessResult(new WorkspaceVO().setWorkspaceId(workspaceService.createWorkspace(request, workspaceParam)));
    }

    /**
     * 获取空间列表
     * @param request
     * @param pageSize
     * @param curPage
     * @param name
     * @return
     */
    @GetMapping
    public RpcResult<List<WorkspaceInfoVO>> findAll(HttpServletRequest request, @RequestParam(defaultValue = "10") Integer pageSize,
                                                    @RequestParam(defaultValue = "0") Integer curPage, String name) {
        return RpcResultUtil.createSuccessResult(workspaceService.findAll(request, pageSize, curPage, name));
    }

    /**
     * 获取空间详情
     * @param request
     * @param workspaceId
     * @return
     */
    @GetMapping("/{workspaceId}")
    public RpcResult<WorkspaceMemberVO> getWorkspaceInfo(HttpServletRequest request, @PathVariable String workspaceId) {
        return RpcResultUtil.createSuccessResult(workspaceService.getWorkspaceInfo(request, workspaceId));
    }

    @PostMapping("/{workspaceId}")
    public RpcResult<WorkspaceMemberVO> update(HttpServletRequest request, @PathVariable String workspaceId, @RequestBody WorkspaceParam workspaceParam) {
        return RpcResultUtil.createSuccessResult(workspaceService.getWorkspaceInfo(request, workspaceId));
    }
}
