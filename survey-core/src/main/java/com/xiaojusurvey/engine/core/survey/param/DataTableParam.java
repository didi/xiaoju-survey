package com.xiaojusurvey.engine.core.survey.param;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description: 问卷回收参数对象
 */
@Data
public class DataTableParam {

    @NotBlank(message = "问卷ID不能为空")
    private String surveyId;

    // 是否脱敏，默认true
    private Boolean isMasked = true;

    @Min(value = 1, message = "页码必须大于0")
    private Integer page = 1;

    @Min(value = 1, message = "页大小必须大于0")
    private Integer pageSize = 10;
}
