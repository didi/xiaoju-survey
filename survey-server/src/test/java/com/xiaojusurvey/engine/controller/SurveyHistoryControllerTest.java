package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.vo.SurveyHistoryOutVO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @Author: maple
 * @CreateTime: 2024/6/15 20:30
 * @Description:
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyHistoryControllerTest {

    @InjectMocks
    SurveyHistoryController surveyHistoryController;

    @Mock
    SurveyHistoryService surveyHistoryService;

    @Test
    public void getList() {
        Mockito.when(surveyHistoryService.getHistoryList(Mockito.any(), Mockito.any())).thenReturn(new ArrayList<>());
        RpcResult<List<SurveyHistoryOutVO>> result = surveyHistoryController.getList("1", "dailyHis");
        Assert.assertTrue(result.getSuccess());
        Assert.assertEquals(new Integer(200), result.getCode());

        List<SurveyHistory> historyList = new ArrayList<>();
        SurveyHistory history = new SurveyHistory();
        history.setId("111");
        history.setCreateDate(System.currentTimeMillis());
        history.setOperator(new HashMap<>());
        historyList.add(history);
        Mockito.when(surveyHistoryService.getHistoryList(Mockito.any(), Mockito.any())).thenReturn(historyList);
        RpcResult<List<SurveyHistoryOutVO>> resultList = surveyHistoryController.getList("1", "dailyHis");
        Assert.assertTrue(resultList.getSuccess());
        Assert.assertEquals(new Integer(200), resultList.getCode());
        Assert.assertFalse(resultList.getData().isEmpty());
    }
}
