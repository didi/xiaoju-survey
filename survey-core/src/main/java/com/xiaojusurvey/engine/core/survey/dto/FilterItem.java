package com.xiaojusurvey.engine.core.survey.dto;

import lombok.Data;
import java.util.List;

/**
 * TODO
 *
 * @author likui63@163.com
 * @Date 2024/8/1 20:59
 */
@Data
public class FilterItem {
    /**
     * 比较符
     */
    private String comparator;

    private List<FilterCondition> condition;


    @Data
    public static  class FilterCondition {
        /**
         * 字段名
         */
        private String field;
        /**
         * 比较符
         */
        private String comparator;
        /**
         * 筛选条件
         */
        private String value;
    }
}
