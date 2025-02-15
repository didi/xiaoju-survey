package com.xiaojusurvey.engine.common.entity.survey;


import com.xiaojusurvey.engine.common.entity.BaseEntity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document("counter")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Counter extends BaseEntity {

    private String key;

    private String surveyPath;

    private String type;

    private Map<String, Long> data;


}
