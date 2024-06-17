package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.vo.SurveyHistoryOutVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @Author: maple
 * @CreateTime: 2024/6/10 21:10
 * @Description:
 */
@RequestMapping("/api/surveyHistory")
@RestController
public class SurveyHistoryController {

    @Resource
    private SurveyHistoryService surveyHistoryService;

    /**
     * 获取问卷历史列表
     */
    @GetMapping("/getList")
    public RpcResult<List<SurveyHistoryOutVO>> getList(@RequestParam("surveyId") String surveyId, @RequestParam("historyType") String historyType) {
        List<SurveyHistory> historyList = surveyHistoryService.getHistoryList(surveyId, historyType);
        if (null == historyList || historyList.isEmpty()) {
            return RpcResultUtil.createSuccessResult(new ArrayList<>());
        }

        List<SurveyHistoryOutVO> resultList = historyList.stream().map(e -> {
            SurveyHistoryOutVO outVO = new SurveyHistoryOutVO();
            outVO.setId(e.getId());
            outVO.setOperator(e.getOperator());
            outVO.setCreateDate(e.getCreateDate());
            return outVO;
        }).collect(Collectors.toList());
        return RpcResultUtil.createSuccessResult(resultList);
    }
}
