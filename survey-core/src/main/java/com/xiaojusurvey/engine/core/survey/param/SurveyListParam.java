package com.xiaojusurvey.engine.core.survey.param;

import com.xiaojusurvey.engine.core.survey.dto.BaseQuery;
import com.xiaojusurvey.engine.core.survey.dto.FilterItem;
import com.xiaojusurvey.engine.core.survey.dto.OrderItem;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

/**
 * 问卷查询
 *
 * @author likui63@163.com
 * @Date 2024/8/1 21:05
 */
@Data
public class SurveyListParam extends BaseQuery implements Serializable {

    private static final long serialVersionUID = -6294820920444326423L;
    private FilterItem[] filter;

    private OrderItem[] order;

    @NotBlank(message = "空间id不能为空")
    private String workspaceId;
    /**
     * 所有者
     */
    private String username;

    /**
     * 所有者Id
     */
    private String userId;

}
