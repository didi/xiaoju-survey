package com.xiaojusurvey.engine.core.survey.impl;


import com.xiaojusurvey.engine.common.entity.Status;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.enums.SurveyStatusEnum;
import com.xiaojusurvey.engine.core.survey.SurveyPublishService;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

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
    MongoRepository mongoRepository;

    SurveyMetaUpdateParam updateParam;

    SurveyMeta surveyMeta;
    String surveyid  =  "111111111111111111";

    @Before
    public void before(){
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

        when(mongoRepository.findOne(any(),any())).thenReturn(surveyMeta);

        boolean flag  = surveyService.updateMeta(updateParam);
        Assert.assertEquals(true,flag);

    }


    @Test
    public void deleteSurveyTest() {
        when(mongoRepository.findOne(any(),any())).thenReturn(surveyMeta);
        when(surveyPublishService.delete(any())).thenReturn(true);
        boolean flag  = surveyService.deleteSurvey(surveyid);
        Assert.assertEquals(true,flag);

    }

}