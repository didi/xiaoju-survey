package com.xiaojusurvey.engine.core.workspace.vo;

import lombok.Data;

/**
 * @description: 空间信息VO
 * @author: wangchenglong
 * @time: 2024/7/25 14:23
 */
@Data
public class WorkspaceInfoVO {
    /**
     * 空间 id
     */
    private String _id;

    /**
     * 所有者id
     */
    private String ownerId;

    /**
     * 所有者用户名
     */
    private String owner;

    /**
     * 空间名称
     */
    private String name;

    /**
     * 空间描述
     */
    private String description;

    /**
     * 当前用户的
     */
    private String currentUserId;

    /**
     * 当前用户的角色，枚举：admin、user
     */
    private String currentUserRole;

    /**
     * 包含的问卷总数
     */
    private Long surveyTotal;

    /**
     * 包含的成员总数
     */
    private Long memberTotal;
}
