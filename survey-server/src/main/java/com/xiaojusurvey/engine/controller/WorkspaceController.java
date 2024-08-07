package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.workspace.WorkspaceService;
import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceListVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @description: 空间
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
    public RpcResult<WorkspaceListVO> findAll(HttpServletRequest request, @RequestParam(defaultValue = "10") Integer pageSize,
                                        @RequestParam(defaultValue = "1") Integer curPage, String name) {
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

    /**
     * 更新空间详情
     * @param request
     * @param workspaceId
     * @param workspaceParam
     * @return
     */
    @PostMapping("/{workspaceId}")
    public RpcResult<?> update(HttpServletRequest request, @PathVariable String workspaceId, @RequestBody WorkspaceParam workspaceParam) {
        workspaceService.update(request, workspaceParam, workspaceId);
        return RpcResultUtil.createSuccessResult(true);
    }

    /**
     * 删除空间
     * @param request
     * @param workspaceId
     * @return
     */
    @DeleteMapping("/{workspaceId}")
    public RpcResult<?> delete(HttpServletRequest request, @PathVariable String workspaceId) {
        workspaceService.delete(request, workspaceId);
        return RpcResultUtil.createSuccessResult(true);
    }

    /**
     * 获取空间成员列表
     * @param request
     * @return
     */
    @GetMapping("/member/list")
    public RpcResult<List<WorkspaceMemberVO>> getWorkspaceAndMember(HttpServletRequest request) {
        return RpcResultUtil.createSuccessResult(workspaceService.findAllByUserId(request));
    }

}
