package com.xiaojusurvey.engine.controller;


import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.survey.SurveyResponseService;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyResponseControllerTest {

    @Mock
    private SurveyResponseService surveyResponseService;


    @InjectMocks
    private SurveyResponseController surveyResponseController;


    @Test
    public void getSchema() {

        RpcResult<SurveyResponseSchemaOutVO> surveyResult = surveyResponseController.getSchema("testSurveyPath");
        Assert.assertTrue(surveyResult.getSuccess());


    }
}
