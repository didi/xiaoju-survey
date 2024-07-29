package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.entity.Status;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.survey.SurveyPublish;
import com.xiaojusurvey.engine.common.enums.SurveyStatusEnum;
import com.xiaojusurvey.engine.core.survey.SurveyPublishService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;

/**
 * 问卷发布配置服务实现
 *
 * @author likui63@163.com
 * @Date 2024/7/27 14:02
 */
@Service
public class SurveyPublishServiceImpl implements SurveyPublishService {
    @Resource
    private MongoRepository mongoRepository;

    public MongoRepository getMongoRepository() {
        return mongoRepository;
    }

    public void setMongoRepository(MongoRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }


    @Override
    public boolean delete(SurveyMeta param) {
        if (StringUtils.hasLength(param.getSurveyPath())) {
            SurveyPublish surveyPublish = getBysurveyPath(param.getSurveyPath());
            if (surveyPublish != null) {
                Status st = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.PUBLISHED);
                surveyPublish.setCurStatus(st);
                surveyPublish.getStatusList().add(st);
                mongoRepository.save(surveyPublish);
            }
        }
        return true;
    }

    public SurveyPublish getBysurveyPath(String surveyPath) {
        Query query = new Query();
        query.addCriteria(Criteria.where("surveyPath").is(surveyPath));
        SurveyPublish surveyPublish = mongoRepository.findOne(query, SurveyPublish.class);
        return surveyPublish;
    }


}
