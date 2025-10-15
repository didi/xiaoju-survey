package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.core.survey.param.AggregationStatisParam;
import com.xiaojusurvey.engine.core.survey.param.DataTableParam;
import com.xiaojusurvey.engine.core.survey.vo.AggregationStatisVO;
import com.xiaojusurvey.engine.core.survey.vo.DataTableVO;

import java.util.List;
/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description: 获取问卷回收数据表格
 */
public interface DataStatisticService {
    DataTableVO getDataTable(DataTableParam param);
  
    List<AggregationStatisVO> getAggregationStatis(AggregationStatisParam param);
}
