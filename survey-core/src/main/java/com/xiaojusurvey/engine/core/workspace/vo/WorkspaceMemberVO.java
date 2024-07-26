package com.xiaojusurvey.engine.core.workspace.vo;

import lombok.Data;

import java.util.List;

/**
 * @description:
 * @author: wangchenglong
 * @time: 2024/7/25 19:38
 */
@Data
public class WorkspaceMemberVO {
    private String name;
    private String description;
    private String currentUserId;
    private String _id;
    private List<MembersVO> members;


    @Data
    public static class MembersVO {
        private String _id;
        private String userId;
        private String username;
        private String role;
//        private String currentUserId;
//        private String currentUserRole;
    }
}
