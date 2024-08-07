package com.xiaojusurvey.engine.core.workspace.impl;

import com.xiaojusurvey.engine.bean.GeneralConvertor;
import com.xiaojusurvey.engine.common.entity.workspace.WorkspaceMember;
import com.xiaojusurvey.engine.common.enums.RecordStatusEnum;
import com.xiaojusurvey.engine.core.workspace.WorkspaceMemberService;
import com.xiaojusurvey.engine.core.workspace.param.CreateWorkspaceMemberParam;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * @description: 空间成员
 * @author: wangchenglong
 * @time: 2024/7/24 14:23
 */
@Service
public class WorkspaceMemberServiceImpl implements WorkspaceMemberService {

    @Autowired
    private MongoRepository mongoRepository;

    @Autowired
    private GeneralConvertor convertors;

    @Override
    public List<WorkspaceMember> getWorkspaceMembers(String workspaceId, List<String> userId) {
        return mongoRepository.findList(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceId))
                .addCriteria(Criteria.where("userId").in(userId)), WorkspaceMember.class);
    }

    @Override
    public WorkspaceMember getWorkspaceMember(String workspaceId, String userId) {
        return mongoRepository.findOne(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceId))
                .addCriteria(Criteria.where("userId").is(userId)), WorkspaceMember.class);
    }

    @Override
    public String create(CreateWorkspaceMemberParam createWorkspaceMemberParam) {
        WorkspaceMember workspaceMemberDto = convertors.convertor(createWorkspaceMemberParam, WorkspaceMember.class);
        WorkspaceMember workspaceMember = mongoRepository.save(workspaceMemberDto);
        return workspaceMember.getId();
    }

    /**
     *  查询当前用户参与的空间
     * @param userId
     * @return
     */
    @Override
    public List<WorkspaceMember> getWorkspaceMembers(String userId, Integer pageSize, Integer curPage) {
        List<WorkspaceMember> workspaceMembers = mongoRepository.page(new Query().addCriteria(Criteria.where("userId").is(userId))
                        .addCriteria(Criteria.where("curStatus.status").ne(RecordStatusEnum.REMOVED.getStatusType()))
                        .with(Sort.by(Sort.Direction.ASC, "createDate")),
                curPage, pageSize, WorkspaceMember.class);
        return workspaceMembers;
    }

    @Override
    public List<WorkspaceMember> getWorkspaceMembers(String workspaceId) {
        return mongoRepository.findList(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceId))
                .with(Sort.by(Sort.Direction.ASC, "createDate")), WorkspaceMember.class);
    }

    @Override
    public void delete(CreateWorkspaceMemberParam workspaceMemberParam) {
        mongoRepository.delete(new Query().addCriteria(Criteria.where("workspaceId").is(workspaceMemberParam.getWorkspaceId()))
                .addCriteria(Criteria.where("userId").is(workspaceMemberParam.getUserId())), WorkspaceMember.class);
    }

    @Override
    public void updateRole(@RequestBody CreateWorkspaceMemberParam createWorkspaceMemberParam) {
        mongoRepository.updateFirst(new Query().addCriteria(Criteria.where("workspaceId").is(createWorkspaceMemberParam.getWorkspaceId()))
                        .addCriteria(Criteria.where("_id").is(createWorkspaceMemberParam.getUserId())),
                new Update().set("role", createWorkspaceMemberParam.getRole()), WorkspaceMember.class);
    }
}
