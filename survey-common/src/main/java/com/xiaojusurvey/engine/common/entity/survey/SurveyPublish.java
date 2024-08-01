package com.xiaojusurvey.engine.common.entity.survey;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * 问卷发布后的配置表
 *
 * @author likui63@163.com
 * @date: 2024/7/27 13:59
 */
@Document("surveyPublish")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class SurveyPublish extends BaseEntity {

    /**
     * 问卷配置ID
     */
    @NotBlank(message = "问卷配置ID不能为空")
    @NotNull(message = "问卷配置ID不能为空")
    private String pageId;

    /**
     * 问卷标题
     */
    @NotBlank(message = "问卷标题不能为空")
    @NotNull(message = "问卷标题不能为空")
    private String title;
    /**
     * 问卷短链
     */
    @NotBlank(message = "问卷短链不能为空")
    @NotNull(message = "问卷短链不能为空")
    private String surveyPath;
    /**
     * 问卷schema
     */
    @NotBlank(message = "问卷schema不能为空")
    @NotNull(message = "问卷schema不能为空")
    private Map<String, Object> code;


}
