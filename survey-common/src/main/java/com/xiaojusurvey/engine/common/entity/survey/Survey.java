package com.xiaojusurvey.engine.common.entity.survey;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷Survey
 */
@Document("survey")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class Survey extends BaseEntity {

    /**
     * 问卷类型
     */
    @NotBlank(message = "问卷类型不能为空")
    @NotNull(message = "问卷类型不能为空")
    private String surveyType;
    /**
     * 问卷标题
     */
    private String title;
    /**
     * 问卷描述
     */
    private String remark;
    /**
     * 创建方式
     */
    private String createMethod;
    /**
     * 创建来源
     */
    private String createFrom;


}
