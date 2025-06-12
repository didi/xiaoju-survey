package com.xiaojusurvey.engine.core.survey.impl;


import com.xiaojusurvey.engine.common.entity.BaseEntity;
import com.xiaojusurvey.engine.common.entity.Status;
import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.enums.SurveyStatusEnum;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.SurveyPublishService;
import com.xiaojusurvey.engine.core.survey.dto.FilterItem;
import com.xiaojusurvey.engine.core.survey.param.SurveyListParam;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyListVO;
import com.xiaojusurvey.engine.core.util.WebUtils;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.platform.engine.TestTag;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.internal.matchers.Any;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;


/**
 * 问卷service单元测试
 *
 * @author likui63@163.com
 * @Date 2024/7/27 14:27
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyServiceImplTest {

    @InjectMocks
    private SurveyServiceImpl surveyService;

    @Mock
    SurveyPublishService surveyPublishService;

    @Mock
    SurveyConfService surveyConfService;

    @Mock
    SurveyHistoryService surveyHistoryService;

    @Mock
    MongoRepository mongoRepository;

    SurveyMetaUpdateParam updateParam;

    SurveyMeta surveyMeta;
    String surveyid = "111111111111111111";

    @Before
    public void before() {
        surveyMeta = new SurveyMeta();
        surveyMeta.setId(surveyid);
        surveyMeta.setTitle("title");
        surveyMeta.setRemark("remark");
        surveyMeta.setSurveyType("type1");
        surveyMeta.setCreator("likui");
        surveyMeta.setOwner("likui");
        surveyMeta.setCurStatus(SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.PUBLISHED));
        List<Status> list = new ArrayList();
        list.add(SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.NEW));
        list.add(SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.PUBLISHED));
        surveyMeta.setStatusList(list);
    }

    @Test
    public void updateMetaTest() {
        updateParam = new SurveyMetaUpdateParam();
        updateParam.setSurveyId(surveyid);
        updateParam.setTitle("新时代");
        updateParam.setRemark("这是一个测试");

        Mockito.when(mongoRepository.findOne(Mockito.any(), Mockito.any())).thenReturn(surveyMeta);

        boolean flag = surveyService.updateMeta(updateParam);
        Assert.assertEquals(true, flag);

    }


    @Test
    public void deleteSurveyTest() {
        Mockito.when(mongoRepository.findOne(Mockito.any(), Mockito.any())).thenReturn(surveyMeta);
        Mockito.when(surveyPublishService.delete(Mockito.any())).thenReturn(true);
        boolean flag = surveyService.deleteSurvey(surveyid);
        Assert.assertEquals(true, flag);
    }


    @Test
    public void publishSurveyTest() {
        SurveyConf conf = new SurveyConf();

        Mockito.when(surveyConfService.getSurveyConfBySurveyId(Mockito.any())).thenReturn(conf);
        Mockito.when(mongoRepository.findOne(Mockito.any(), Mockito.eq(SurveyMeta.class))).thenReturn(surveyMeta);
        Mockito.when(mongoRepository.save(Mockito.any())).thenReturn(null);
        Mockito.when(surveyPublishService.save(Mockito.any())).thenReturn(true);
        Mockito.when(surveyHistoryService.addHistory(Mockito.any())).thenReturn(null);
        Mockito.mockStatic(WebUtils.class);
        HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
        Mockito.when(WebUtils.getHttpServletRequest()).thenReturn(req);
        User user = new User();
        user.setId("123");
        user.setUsername("ttt");
        Mockito.when(req.getAttribute("user")).thenReturn(user);
        boolean falg = surveyService.publishSurvey(surveyid);
        Assert.assertTrue("成功", falg == true);
    }


    @Test
    public void getListTest() {
        SurveyListParam param = new SurveyListParam();
        param.setWorkspaceId("1");
        FilterItem item = new FilterItem();
//        item.setComparator("$regex");
        List<FilterItem.FilterCondition> conditions = new ArrayList<>();
        FilterItem.FilterCondition condition = new FilterItem.FilterCondition();
        conditions.add(condition);
        condition.setComparator("$regex");
        condition.setField("title");
        condition.setValue("newTime3");
        item.setCondition(conditions);
        param.setFilter(new FilterItem[]{item});
        List<BaseEntity> list = new ArrayList<>();

        Mockito.when(mongoRepository.page(Mockito.any(), Mockito.anyInt(), Mockito.anyInt(), Mockito.any())).thenReturn(list);
        Mockito.when(mongoRepository.count(Mockito.any(), Mockito.any())).thenReturn(1L);

        SurveyListVO vo = surveyService.getSurveyList(param);
        Assert.assertTrue("成功", vo.getCount() == 1);
    }


}
