package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.entity.survey.Counter;
import com.xiaojusurvey.engine.core.survey.CounterService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;


@Service
public class CounterServiceImpl implements CounterService {

    @Resource
    private MongoRepository mongoRepository;

    @Override
    public Counter queryCounter(String key, String surveyPath, String type) {
        Query query = new Query(Criteria.where("surveyPath").is(surveyPath)
                .and("type").is(type).and("key").is(key));
        Counter counter = mongoRepository.findOne(query, Counter.class);
        return counter;
    }

    @Override
    public void saveCounter(Counter counter) {
        Query query = new Query(Criteria.where("surveyPath").is(counter.getSurveyPath())
                .and("type").is(counter.getType())
                .and("key").is(counter.getKey()));
        Update update = new Update().set("data", counter.getData());
        if (mongoRepository.exists(query, Counter.class)) {
            mongoRepository.updateFirst(query, update, Counter.class);
        } else {
            mongoRepository.save(counter);
        }
    }
}
