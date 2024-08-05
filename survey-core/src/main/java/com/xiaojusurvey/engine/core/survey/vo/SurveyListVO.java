package com.xiaojusurvey.engine.core.survey.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 问卷列表
 *
 * @author likui63@163.com
 * @Date 2024/8/1 21:36
 */
@Data
public class SurveyListVO implements Serializable {

    private static final long serialVersionUID = 2263256769125151536L;
    /**
     * 问卷列表
     */
    private List<SurveyVO> data;

    /**
     * 总数量
     */
    private Long count;
}
