package com.xiaojusurvey.engine.core.workspace.impl;

import com.xiaojusurvey.engine.bean.GeneralConvertor;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.InitBaseEntity;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.entity.workspace.Workspace;
import com.xiaojusurvey.engine.common.entity.workspace.WorkspaceMember;
import com.xiaojusurvey.engine.common.enums.RecordStatusEnum;
import com.xiaojusurvey.engine.common.enums.RoleEmum;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.workspace.WorkspaceMemberService;
import com.xiaojusurvey.engine.core.workspace.WorkspaceService;
import com.xiaojusurvey.engine.core.workspace.param.MemberParam;
import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceInfoVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceListVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberVO;
import com.xiaojusurvey.engine.repository.MongoRepository;
import com.xiaojusurvey.engine.repository.interceptor.MongoEntityInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
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
@Slf4j
@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    @Autowired
    private MongoRepository mongoRepository;

    @Autowired
    private GeneralConvertor convertors;

    @Autowired
    private WorkspaceMemberService memberService;

    @Autowired
    private MongoEntityInterceptor mongoEntityInterceptor;

    /**
     * 创建空间
     * @param request
     * @param param
     * @return
     */
    @Override
    public String createWorkspace(HttpServletRequest request, WorkspaceParam param) {
        Workspace workspace = this.convertors.convertor(param, Workspace.class);
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
            List<WorkspaceMember> members = this.convertors.convertor(param.getMembers(), WorkspaceMember.class);
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
    public WorkspaceListVO findAll(HttpServletRequest request, Integer pageSize, Integer curPage, String name) {
        curPage -= 1;
        User user = (User) request.getAttribute("user");
        // 查询当前用户参与的空间
        List<WorkspaceMember> workspaceMembers = memberService.getWorkspaceMembers(user.getId(), pageSize, curPage);
        List<WorkspaceInfoVO> workspaceInfos = new ArrayList<>();
        workspaceMembers.stream().forEach(workspaceMember -> {
            // 成员数量
            Long count = mongoRepository.count(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceMember.getWorkspaceId())), WorkspaceMember.class);
            Workspace workspace = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspaceMember.getWorkspaceId())).addCriteria(Criteria.where("curStatus.status").ne(RecordStatusEnum.REMOVED.getStatusType())), Workspace.class);
            // 问卷数量
            Long surveyCount = mongoRepository.count(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceMember.getWorkspaceId())), SurveyMeta.class);
            if (!ObjectUtils.isEmpty(workspace)) {
                WorkspaceInfoVO convertor = this.convertors.convertor(workspace, WorkspaceInfoVO.class);
                workspaceInfos.add(convertor.setCurrentUserId(user.getId())
                        .setCurrentUserRole(workspaceMembers.stream().filter(member -> member.getWorkspaceId().equals(workspaceMember.getWorkspaceId())).findFirst().get().getRole())
                        .setMemberTotal(count)
                        .setSurveyTotal(surveyCount)
                        .setOwner(workspace.getOwnerId().equals(user.getId()) ? user.getUsername() : mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspace.getOwnerId())), User.class).getUsername())
                        .setOwnerId(workspace.getOwnerId()));
            }
        });
        return new WorkspaceListVO().setData(workspaceInfos).setCount(workspaceMembers.size());
    }

    @Override
    public WorkspaceMemberVO getWorkspaceInfo(HttpServletRequest request, String workspaceId) {
        User user = (User) request.getAttribute("user");
        Workspace workspace = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspaceId)), Workspace.class);
        WorkspaceMemberVO workspaceMember = this.convertors.convertor(workspace, WorkspaceMemberVO.class);
        List<WorkspaceMember> workspaceMembers = memberService.getWorkspaceMembers(workspaceId);
        List<WorkspaceMemberVO.MembersVO> members = this.convertors.convertor(workspaceMembers, WorkspaceMemberVO.MembersVO.class);
        workspaceMember.setCurrentUserId(user.getId()).setMembers(members);
        workspaceMember.getMembers().forEach(member -> member.setWorkspaceId(workspaceId).setUsername(member.getUserId().equals(user.getId()) ? user.getUsername() : mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(member.getUserId())), User.class).getUsername()));
        return workspaceMember;
    }

    @Override
    public void update(HttpServletRequest request, WorkspaceParam workspaceParam, String workspaceId) {
        if (CollectionUtils.isEmpty(workspaceParam.getMembers())) {
            throw new ServiceException("成员不能为空", RespErrorCode.PARAMETER_ERROR.getCode());
        }
        // 更新空间信息
        Workspace convertor = convertors.convertor(workspaceParam, Workspace.class);
        mongoRepository.updateFirst(new Query().addCriteria(Criteria.where("_id").is(workspaceId)),
                new Update().set("name", convertor.getName()).set("description", convertor.getDescription()), Workspace.class);
        // 空间不能没有管理员
        boolean flag = workspaceParam.getMembers().stream().map(member -> member.getRole()).collect(Collectors.toList()).contains(RoleEmum.ADMIN.getValue());
        if (!flag) {
            throw new ServiceException("空间不能没有管理员", RespErrorCode.PARAMETER_ERROR.getCode());
        }
        // 不能有重复的userId
        List<String> userIds = workspaceParam.getMembers().stream().map(member -> member.getUserId()).distinct().collect(Collectors.toList());
        if (userIds.size() != workspaceParam.getMembers().size()) {
            throw new ServiceException("不能重复添加用户", RespErrorCode.PARAMETER_ERROR.getCode());
        }
        // 删除历史成员
        List<String> oldWorkspaceUserId = mongoRepository.findList(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceId)), WorkspaceMember.class).stream().map(WorkspaceMember::getUserId).collect(Collectors.toList());
        oldWorkspaceUserId.removeAll(userIds);
        mongoRepository.delete(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceId))
                .addCriteria(Criteria.where("userId").in(oldWorkspaceUserId)), WorkspaceMember.class);
        // 检查所有成员是否真实存在
        workspaceParam.getMembers().stream().forEach(member -> {
            User memberUser = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(member.getUserId())), User.class);
            if (ObjectUtils.isEmpty(memberUser)) {
                throw new ServiceException("用户id:" + member.getUserId() + "不存在", RespErrorCode.USER_NOT_EXISTS.getCode());
            }
            // 修改成员信息
            WorkspaceMember workspaceMember = memberService.getWorkspaceMember(workspaceId, memberUser.getId());
            if (ObjectUtils.isEmpty(workspaceMember)) {
                mongoRepository.save(new WorkspaceMember().setUserId(memberUser.getId()).setWorkspaceId(workspaceId).setRole(member.getRole()));
            } else {
                if (workspaceMember.getRole() != member.getRole()) {
                    mongoRepository.updateFirst(new Query().addCriteria(Criteria.where("_id").is(workspaceMember.getId()))
                            .addCriteria(Criteria.where("workspaceId").is(workspaceId)), new Update().set("role", member.getRole()), WorkspaceMember.class);
                }
            }
        });
    }

    @Override
    public void delete(HttpServletRequest request, String workspaceId) {
        Workspace workspace = mongoRepository.findOne(new Query().addCriteria(Criteria.where("_id").is(workspaceId)), Workspace.class);
        // 更新空间状态
        InitBaseEntity initBaseEntity = mongoEntityInterceptor.updateDocument(workspace.getStatusList());
        mongoRepository.updateMulti(new Query().addCriteria(Criteria.where("_id").is(workspaceId)),
                new Update().set("curStatus", initBaseEntity.getCurStatus())
                        .set("statusList", initBaseEntity.getStatusList()), Workspace.class);
        // 更新空间下的问卷状态
        mongoRepository.updateMulti(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceId)),
                new Update().set("curStatus", initBaseEntity.getCurStatus())
                        .set("statusList", initBaseEntity.getStatusList()), SurveyMeta.class);
    }

    @Override
    public List<WorkspaceMemberVO> findAllByUserId(HttpServletRequest request) {
        List<WorkspaceMemberVO> workspaceMembers = new ArrayList<>();
        User user = (User) request.getAttribute("user");
        List<Workspace> workspaces = mongoRepository.findList(new Query().addCriteria(Criteria.where("ownerId").is(user.getId())).with(Sort.by(Sort.Direction.DESC, "createDate")), Workspace.class);
        workspaces.stream().forEach(workspace -> workspaceMembers.add(this.getWorkspaceInfo(request, workspace.getId())));
        return workspaceMembers;
    }

}
