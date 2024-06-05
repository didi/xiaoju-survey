package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.entity.survey.Survey;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷ServiceImpl
 */
@Service("surveyService")
public class SurveyServiceImpl implements SurveyService {

    @Resource
    private MongoRepository mongoRepository;
    /**
     * 创建问卷
     */
    @Override
    public String createSurvey(Survey survey) {
        return mongoRepository.save(survey).getId();
    }
}
