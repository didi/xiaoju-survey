package com.xiaojusurvey.engine.common.entity.survey;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

/**
 * @Author: maple
 * @CreateTime: 2024/6/7 21:28
 * @Description: 问卷历史记录
 */
@Document("surveyHistory")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class SurveyHistory extends BaseEntity {

    private String pageId;

    private String type;

    private Map<String, Object> schema;

    private Map<String, Object> operator;
}
