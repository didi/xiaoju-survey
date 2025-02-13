package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.entity.survey.SurveyPublish;
import com.xiaojusurvey.engine.core.survey.SurveyResponseService;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;

/**
 * @Author: zsh
 * @CreateTime: 2025/1/21
 * @Description: 问卷提交服务
 */
@Service
public class SurveyResponseServiceImpl implements SurveyResponseService {

    @Resource
    private MongoRepository mongoRepository;

    @Override
    public SurveyResponseSchemaOutVO getResponseSchema(String surveyPath) {
        Query query = new Query(Criteria.where("surveyPath").is(surveyPath));
        SurveyPublish surveyPublish = mongoRepository.findOne(query, SurveyPublish.class);
        SurveyResponseSchemaOutVO responseSchema = new SurveyResponseSchemaOutVO();
        responseSchema.setPageId(surveyPublish.getPageId());
        responseSchema.setCode(surveyPublish.getCode());
        responseSchema.setSurveyPath(surveyPath);
        responseSchema.setTitle(surveyPublish.getTitle());
        responseSchema.setCurStatus(surveyPublish.getCurStatus());
        return responseSchema;
    }
}
