package com.xiaojusurvey.engine.core.workspace.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("_id")
    private String id;
    private List<MembersVO> members;


    @Data
    public static class MembersVO {
        @JsonProperty("_id")
        private String id;
        private String userId;
        private String username;
        private String role;
        private String workspaceId;
    }
}
