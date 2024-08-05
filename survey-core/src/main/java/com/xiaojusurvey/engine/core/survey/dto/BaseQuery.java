package com.xiaojusurvey.engine.core.survey.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 查询基础条件
 *
 * @author likui63@163.com
 * @Date 2024/8/1 21:14
 */
@Data
public class BaseQuery implements Serializable {

    private static final long serialVersionUID = 3378327499951251208L;
    private int pageSize = 10;
    private int curPage = 1;


}
