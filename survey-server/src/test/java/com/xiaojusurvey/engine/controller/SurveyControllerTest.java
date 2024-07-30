package com.xiaojusurvey.engine.controller;

import com.alibaba.fastjson.JSONObject;
import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.config.BannerDataConfig;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.core.survey.vo.SurveyInfoInVO;
import com.xiaojusurvey.engine.core.survey.vo.SurveyInfoOutVO;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.ui.ModelExtensionsKt;

import javax.servlet.http.HttpServletRequest;


/**
 * @Author: maple
 * @CreateTime: 2024/6/15 20:40
 * @Description:
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyControllerTest {

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

    private HttpServletRequest httpServletRequest;

    @Before
    public void initBean() {
        httpServletRequest = new MockHttpServletRequest();
        User user = new User();
        user.setId("123");
        user.setUsername("maple");
        httpServletRequest.setAttribute("user", user);
    }

    @Test
    public void getBannerData() {
        Mockito.when(bannerDataConfig.getBannerData()).thenReturn(new JSONObject());
        RpcResult<Object> bannerData = surveyController.getBannerData();
        Assert.assertTrue(bannerData.getSuccess());
        Assert.assertEquals(new Integer(200), bannerData.getCode());
    }

    @Test
    public void updateConf() {
        Mockito.doNothing().when(surveyConfService).saveSurveyConfig(Mockito.any());
        Mockito.when(surveyHistoryService.addHistory(Mockito.any())).thenReturn(new SurveyHistory());
        RpcResult<Boolean> updateConf = surveyController.updateConf(httpServletRequest, new SurveyInfoInVO());
        Assert.assertTrue(updateConf.getSuccess());
        Assert.assertEquals(new Integer(200), updateConf.getCode());
    }

    @Test
    public void getSurvey() {
        Mockito.when(surveyService.getSurveyMeta(Mockito.anyString())).thenReturn(null);
        Mockito.when(surveyHistoryService.addHistory(Mockito.any())).thenReturn(new SurveyHistory());
        RpcResult<SurveyInfoOutVO> surveyResult = surveyController.getSurvey("112133");
        Assert.assertFalse(surveyResult.getSuccess());
        Assert.assertEquals(new Integer(3004), surveyResult.getCode());

        Mockito.when(surveyService.getSurveyMeta(Mockito.anyString())).thenReturn(new SurveyMeta());
        Mockito.when(surveyHistoryService.addHistory(Mockito.any())).thenReturn(new SurveyHistory());
        RpcResult<SurveyInfoOutVO> surveyResult2 = surveyController.getSurvey("112133");
        Assert.assertTrue(surveyResult2.getSuccess());
        Assert.assertEquals(new Integer(200), surveyResult2.getCode());
    }


    @Test
    public void publishSurveyTest() {

        Mockito.when(surveyService.publishSurvey(Mockito.any())).thenReturn(true);
        surveyController.publishSurvey("11111");

    }
}
