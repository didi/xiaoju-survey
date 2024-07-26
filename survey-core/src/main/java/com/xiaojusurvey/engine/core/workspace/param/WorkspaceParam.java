package com.xiaojusurvey.engine.core.workspace.param;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;

import java.util.List;

/**
 * @description: 空间VO
 * @author: wangchenglong
 * @time: 2024/7/24 14:37
 */
@Data
public class WorkspaceParam extends BaseEntity {
    /**
     * 空间名称
     */
    private String name;

    /**
     * 空间描述
     */
    private String description;

    /**
     * 空间创建者
     */
    private List<MemberParam> members;
}
