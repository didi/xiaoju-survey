package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.config.BannerDataConfig;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.impl.SurveyServiceImpl;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;

import static org.mockito.Mockito.doNothing;


/**
 * @Author: maple
 * @CreateTime: 2024/6/15 20:40
 * @Description:
 */
//@SpringBootTest(classes = SurveyApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyMetaControllerTest {

    @InjectMocks
    SurveyController surveyController;

    @Spy
    private SurveyServiceImpl surveyService;

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
        surveyService.setMongoRepository(mongoRepository);

        doNothing().when(mongoRepository).updateFirst(Mockito.any(),Mockito.any(), Mockito.any());

        SurveyMetaUpdateParam param = new SurveyMetaUpdateParam();
        param.setSurveyId(null);
        param.setTitle(null);
        param.setRemark(null);
        RpcResult surveyResult = surveyController.updateMeta(param);
        Assert.assertTrue(surveyResult.getSuccess());

    }


}
