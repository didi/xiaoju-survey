package com.xiaojusurvey.engine.core.workspace.impl;

import com.xiaojusurvey.engine.bean.GeneralConvertor;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.entity.workspace.Workspace;
import com.xiaojusurvey.engine.common.entity.workspace.WorkspaceMember;
import com.xiaojusurvey.engine.common.enums.RoleEmum;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.workspace.WorkspaceMemberService;
import com.xiaojusurvey.engine.core.workspace.WorkspaceService;
import com.xiaojusurvey.engine.core.workspace.param.MemberParam;
import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceInfoVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberVO;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @description: 空间
 * @author: wangchenglong
 * @time: 2024/7/24 14:23
 */
@Service
public class WorkspaceServiceImpl implements WorkspaceService {
    @Autowired
    private MongoRepository mongoRepository;

    @Autowired
    private GeneralConvertor convertor;

    @Autowired
    private WorkspaceMemberService memberService;

    /**
     * 创建空间
     * @param request
     * @param param
     * @return
     */
    @Override
    public String createWorkspace(HttpServletRequest request, WorkspaceParam param) {
        Workspace workspace = this.convertor.convertor(param, Workspace.class);
        User user = (User) request.getAttribute("user");
        IdResult idResult = new IdResult();
        idResult.setId(mongoRepository.save(workspace.setOwnerId(user.getId())).getId());
        if (!CollectionUtils.isEmpty(param.getMembers())) {
            // 不能重复添加用户
            List<String> userIds = param.getMembers().stream().map(MemberParam::getUserId).collect(Collectors.toList());
            List<WorkspaceMember> workspaceMembers = memberService.getWorkspaceMembers(idResult.getId(), userIds);
            if (!CollectionUtils.isEmpty(workspaceMembers)) {
                throw new ServiceException("不能重复添加用户", RespErrorCode.PARAMETER_ERROR.getCode());
            }
            // 用户不存在
            param.getMembers().stream().forEach(member -> {
                User memberUser = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(member.getUserId())), User.class);
                if (ObjectUtils.isEmpty(memberUser)) {
                    throw new ServiceException("用户id:" + member.getUserId() + "不存在", RespErrorCode.USER_NOT_EXISTS.getCode());
                }
            });
            List<WorkspaceMember> members = this.convertor.convertor(param.getMembers(), WorkspaceMember.class);
            members = members.stream().map(member -> member.setWorkspaceId(idResult.getId())).collect(Collectors.toList());
            members.add(new WorkspaceMember().setUserId(user.getId()).setWorkspaceId(idResult.getId()).setRole(RoleEmum.ADMIN.getValue()));
            mongoRepository.batchSave(members, WorkspaceMember.class);
        }
        return idResult.getId();
    }

    /**
     * 获取空间列表
     * @param request
     * @param pageSize
     * @param curPage
     * @param name
     * @return
     */
    @Override
    public List<WorkspaceInfoVO> findAll(HttpServletRequest request, Integer pageSize, Integer curPage, String name) {
        User user = (User) request.getAttribute("user");
        // 查询当前用户参与的空间
        List<WorkspaceMember> workspaceMembers = memberService.getWorkspaceMembers(user.getId(), pageSize, curPage);
        List<WorkspaceInfoVO> workspaceInfos = new ArrayList<>();
        workspaceMembers.stream().forEach(workspaceMember -> {
            // 成员数量
            Long count = mongoRepository.count(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceMember.getWorkspaceId())), WorkspaceMember.class);
            Workspace workspace = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspaceMember.getWorkspaceId())), Workspace.class);
            WorkspaceInfoVO convertor = this.convertor.convertor(workspace, WorkspaceInfoVO.class);
            workspaceInfos.add(convertor.setCurrentUserId(user.getId())
                    .setCurrentUserRole(workspaceMembers.stream().filter(member -> member.getWorkspaceId().equals(workspaceMember.getWorkspaceId())).findFirst().get().getRole())
                    .setMemberTotal(count)
                    .setSurveyTotal(0L)
                    .setOwner(workspace.getOwnerId().equals(user.getId()) ? user.getUsername() : mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspace.getOwnerId())), User.class).getUsername())
                    .setOwnerId(workspace.getOwnerId()));
        });
        return workspaceInfos;
    }

    @Override
    public WorkspaceMemberVO getWorkspaceInfo(HttpServletRequest request, String workspaceId) {
        User user = (User) request.getAttribute("user");
        Workspace workspace = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspaceId)), Workspace.class);
        WorkspaceMemberVO workspaceMember = this.convertor.convertor_id(workspace, WorkspaceMemberVO.class);
        List<WorkspaceMember> workspaceMembers = memberService.getWorkspaceMembers(workspaceId);
        List<WorkspaceMemberVO.MembersVO> members = this.convertor.convertor_ids(workspaceMembers, WorkspaceMemberVO.MembersVO.class);
        workspaceMember.setCurrentUserId(user.getId()).setMembers(members);
        workspaceMember.getMembers().forEach(member -> member.setUsername(member.getUserId().equals(user.getId()) ? user.getUsername() :
                mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(member.getUserId())), User.class).getUsername()));
        return workspaceMember;
    }

    @Override
    public String update(HttpServletRequest request, WorkspaceParam workspaceParam, String workspaceId) {
        if (CollectionUtils.isEmpty(workspaceParam.getMembers())){
            throw new ServiceException("成员不能为空", RespErrorCode.PARAMETER_ERROR.getCode());
        }
        return null;
    }


}
