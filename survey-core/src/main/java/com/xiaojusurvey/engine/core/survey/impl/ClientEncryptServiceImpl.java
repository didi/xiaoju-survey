package com.xiaojusurvey.engine.core.survey.impl;


import com.xiaojusurvey.engine.common.entity.survey.ClientEncrypt;
import com.xiaojusurvey.engine.core.survey.ClientEncryptService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class ClientEncryptServiceImpl implements ClientEncryptService {

    @Resource
    private MongoRepository mongoRepository;


    @Override
    public ClientEncrypt getEncryptInfoById(String sessionId) {
        return mongoRepository.findOne(new Query(Criteria.where("id").is(sessionId)), ClientEncrypt.class);

    }
}
