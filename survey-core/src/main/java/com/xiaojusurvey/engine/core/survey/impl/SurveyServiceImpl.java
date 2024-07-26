package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
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

    public MongoRepository getMongoRepository() {
        return mongoRepository;
    }

    public void setMongoRepository(MongoRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    /**
     * 创建问卷
     */
    @Override
    public IdResult createSurvey(SurveyMeta surveyMeta) {
        IdResult idResult = new IdResult();
        idResult.setId(mongoRepository.save(surveyMeta).getId());
        return idResult;
    }

    @Override
    public SurveyMeta getSurveyMeta(String surveyId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(surveyId));
        return mongoRepository.findOne(query, SurveyMeta.class);
    }

    @Override
    public boolean updateMeta(SurveyMetaUpdateParam param){
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(param.getSurveyId()));
        Update update = new Update();
        update.set("title", param.getTitle()).set("remark",param.getRemark());
        mongoRepository.updateFirst(query,update,SurveyMeta.class);
        return true;
    }

    @Override
    public boolean deleteSurvey(String surveyId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(surveyId));
        mongoRepository.delete(query, SurveyMeta.class);
        return true;
    }


}
