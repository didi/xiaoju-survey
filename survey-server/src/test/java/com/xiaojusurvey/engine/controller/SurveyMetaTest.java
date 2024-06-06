package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.SurveyApplication;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 * 问卷单元测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = SurveyApplication.class)
public class SurveyMetaTest {

    @Resource
    private SurveyController surveyController;


    @Test
    public void createSurvey() {
        SurveyMeta surveyMeta = new SurveyMeta();
        surveyMeta.setTitle("测试问卷");
        surveyMeta.setSurveyType("1");
        surveyMeta.setCreateMethod("1");
        surveyMeta.setCreateFrom("1");
        surveyController.createSurvey(surveyMeta);
    }
}
