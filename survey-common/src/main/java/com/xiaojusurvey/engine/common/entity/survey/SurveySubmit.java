package com.xiaojusurvey.engine.common.entity.survey;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

/**
 * 问卷回收数据表
 */
@Document("surveySubmit")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SurveySubmit extends BaseEntity {

    private String pageId;

    private String surveyPath;

    private Long diffTime;

    private Long clientTime;

    private Map<String, Object> data;

    private Map<String, List<String[]>> optionTextAndId;

    private List<String> secretKeys;


}
