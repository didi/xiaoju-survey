package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.core.survey.param.DataTableParam;
import com.xiaojusurvey.engine.core.survey.vo.DataTableVO;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description: 获取问卷回收数据表格
 */
public interface DataStatisticService {
    DataTableVO getDataTable(DataTableParam param);
}
