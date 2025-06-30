package com.xiaojusurvey.engine.extensions.security.scenario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 数据包装类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DataWrapper {
    /**
     * 数据
     */
    private Object value;
}
