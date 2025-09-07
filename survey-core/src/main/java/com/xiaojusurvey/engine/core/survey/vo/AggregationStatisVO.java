package com.xiaojusurvey.engine.core.survey.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * @Author: WYX
 * @CreateTime: 2025/9/2
 * @Description: 分题统计返回数据
 */
@Data
public class AggregationStatisVO {
    // 字段名
    private String field;

    // 题目标题
    private String title;

    // 问题类型
    private String type;

    // 聚合数据
    private AggregationData data;

    @Data
    public static class AggregationData {
        //聚合统计结果
        private List<AggregationItem> aggregation;

        //提交总数
        private Long submissionCount;

        //统计摘要（用于评分题型）
        private StatisticSummary summary;
    }

    @Data
    public static class AggregationItem {
        //选项ID
        private String id;

        //选项文本
        private String text;

        //选择数量
        private Long count;
    }

    @Data
    public static class StatisticSummary {
        //平均值
        private BigDecimal average;

        //中位数
        private BigDecimal median;

        //方差
        private BigDecimal variance;

        //NPS值（只用于NPS评分）
        private BigDecimal nps;
    }
}
