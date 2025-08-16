package com.xiaojusurvey.engine.core.survey.vo;

import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description: 问卷回收数据返回对象
 */
@Data
public class DataTableVO {
    // 总数
    private Long total;

    // 表头信息
    private List<ListHeadItem> listHead;

    // 数据行
    private List<Map<String, Object>> listBody;

    @Data
    public static class ListHeadItem {
        private String field;
        private String title;
        private String type;
        private String diffTime;
        private String othersCode;
    }
}
