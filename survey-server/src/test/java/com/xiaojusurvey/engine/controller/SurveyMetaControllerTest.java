package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.config.BannerDataConfig;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;



/**
 * @Author: maple
 * @CreateTime: 2024/6/15 20:40
 * @Description:
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyMetaControllerTest {

    @InjectMocks
    SurveyController surveyController;

    @Mock
    private SurveyService surveyService;

    @Mock
    private SurveyConfService surveyConfService;

    @Mock
    private SurveyHistoryService surveyHistoryService;

    @Mock
    private BannerDataConfig bannerDataConfig;

    @Mock
    MongoRepository mongoRepository;

    private HttpServletRequest httpServletRequest;



    @Test
    public void updateMetaTest() {
        when(surveyService.updateMeta(any())).thenReturn(true);

        SurveyMetaUpdateParam param = new SurveyMetaUpdateParam();
        param.setSurveyId(null);
        param.setTitle(null);
        param.setRemark(null);

        RpcResult surveyResult = surveyController.updateMeta(param);
        Assert.assertTrue(surveyResult.getSuccess());
    }


    @Test
    public void deleteSurveyTest() {

        when(surveyService.deleteSurvey(any())).thenReturn(true);

        SurveyMetaUpdateParam param = new SurveyMetaUpdateParam();
        param.setSurveyId(null);
        param.setTitle(null);
        param.setRemark(null);
        RpcResult surveyResult = surveyController.deleteSurvey(param);
        Assert.assertTrue(surveyResult.getSuccess());

    }


}
