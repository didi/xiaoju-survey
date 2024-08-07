package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.workspace.WorkspaceMemberService;
import com.xiaojusurvey.engine.core.workspace.param.CreateWorkspaceMemberParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberIdVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @description: 空间空间成员
 * @author: wangchenglong
 * @time: 2024/8/1 14:33
 */
@RequestMapping("/api/workspaceMember")
@RestController
public class WorkspaceMemberController {

    @Autowired
    private WorkspaceMemberService workspaceMemberService;

    /**
     * 添加空间成员
     * @param createWorkspaceMemberParam
     * @return
     */
    @PostMapping
    public RpcResult<WorkspaceMemberIdVO> create(@RequestBody CreateWorkspaceMemberParam createWorkspaceMemberParam) {
        return RpcResultUtil.createSuccessResult(new WorkspaceMemberIdVO().setMemberId(workspaceMemberService.create(createWorkspaceMemberParam)));
    }

    /**
     * 更新空间成员角色
     * @param createWorkspaceMemberParam
     * @return
     */
    @PostMapping("/updateRole")
    public RpcResult<?> updateRole(@RequestBody CreateWorkspaceMemberParam createWorkspaceMemberParam) {
        workspaceMemberService.updateRole(createWorkspaceMemberParam);
        return RpcResultUtil.createSuccessResult(true);
    }


    /**
     * 删除空间成员
     * @param workspaceMemberParam
     * @return
     */
    @PostMapping("/deleteMember")
    public RpcResult<?> delete(@RequestBody CreateWorkspaceMemberParam workspaceMemberParam) {
        workspaceMemberService.delete(workspaceMemberParam);
        return RpcResultUtil.createSuccessResult(true);
    }

}
