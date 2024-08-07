package com.xiaojusurvey.engine.core.workspace.vo;

import lombok.Data;

import java.util.List;

/**
 * @description: 空间信息VO
 * @author: wangchenglong
 * @time: 2024/7/25 14:23
 */
@Data
public class WorkspaceListVO {
   private List<WorkspaceInfoVO> data;
   private Integer count;
}
