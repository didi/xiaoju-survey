package com.xiaojusurvey.engine.core.survey.param;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

/**
 * 修改问卷实体
 *
 * @author likui63@163.com
 * @Date 2024/7/24 21:46
 */
@Data
public class SurveyMetaUpdateParam implements Serializable {
    @NotBlank(message = "问卷id不能为空", groups = {Update.class, Delete.class})
    private String surveyId;
    @NotBlank(message = "问卷标题不能为空", groups = {Update.class})
    private String title;
    @NotBlank(message = "问卷描述不能为空", groups = {Update.class})
    private String remark;

    public interface Update {
    }

    public interface Delete {
    }
}
