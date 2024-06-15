package com.xiaojusurvey.engine.common.entity.survey;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

/**
 * @Author: maple
 * @CreateTime: 2024/6/7 21:27
 * @Description: 问卷配置
 */
@Document("surveyConf")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class SurveyConf extends BaseEntity {

    private String pageId;

    private Map<String, Object> code;
}
