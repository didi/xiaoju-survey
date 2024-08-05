package com.xiaojusurvey.engine.core.survey.dto;

import lombok.Data;

/**
 * 排序条件
 *
 * @author likui63@163.com
 * @Date 2024/8/1 20:59
 */
@Data
public class OrderItem {
    /**
     * 字段名
     */
    private String field;
    /**
     * 升序降序 1-升序，-1-降序
     */
    private int value = 1;
}
