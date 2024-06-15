package com.xiaojusurvey.engine.core.survey.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * @Author: maple
 * @CreateTime: 2024/6/9 13:40
 * @Description:
 */
@Data
public class SurveyInfoInVO {

    @NotBlank(message = "问卷id不能为空", groups = {UpdateConf.class})
    private String surveyId;

    @NotNull(message = "问卷数据不能为空", groups = {UpdateConf.class})
    private Map<String, Object> configData;

    public interface UpdateConf {
    }
}
