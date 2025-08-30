package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.survey.DataStatisticService;
import com.xiaojusurvey.engine.core.survey.param.DataTableParam;
import com.xiaojusurvey.engine.core.survey.vo.DataTableVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description: 获取回收数据
 */
@RequestMapping("/api/survey/dataStatistic")
@RestController
@Slf4j
public class DataStatisticController {

    @Resource
    private DataStatisticService dataStatisticService;

    /**
     * 获取问卷回收数据表格
     */
    @GetMapping("/dataTable")
    public RpcResult<DataTableVO> getDataTable(@Validated DataTableParam param) {
        log.info("[getDataTable] 获取数据表格, surveyId={}, page={}, pageSize={}",
                param.getSurveyId(), param.getPage(), param.getPageSize());

        DataTableVO result = dataStatisticService.getDataTable(param);
        return RpcResultUtil.createSuccessResult(result);
    }
}
