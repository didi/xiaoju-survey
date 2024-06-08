package com.xiaojusurvey.engine.repository.impl;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import com.xiaojusurvey.engine.common.exception.DaoException;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

import static com.xiaojusurvey.engine.repository.enums.ErrorEnum.PARAM_NULL_ERROR;

@Repository
public class MongoRepositoryImpl implements MongoRepository {

    @Resource
    private MongoTemplate mongoTemplate;


    @Override
    public <T extends BaseEntity> T save(T saveObject) {
        return mongoTemplate.save(saveObject);
    }

    @Override
    public <T extends BaseEntity> T findById(Object id, Class<T> entityClass) {
        if (Objects.isNull(id)) {
            throw new DaoException(String.format(PARAM_NULL_ERROR.getErrorMsg(), "id"), PARAM_NULL_ERROR.getCode());
        }
        return mongoTemplate.findById(id, entityClass);
    }

    @Override
    public <T extends BaseEntity> List<T> findAll(Class<T> entityClass) {
        return mongoTemplate.findAll(entityClass);
    }


    @Override
    public <T extends BaseEntity> T findOne(Query query, Class<T> entityClass) {
        return mongoTemplate.findOne(query, entityClass);
    }

    @Override
    public <T extends BaseEntity> void deleteById(Object id, Class<T> entityClass) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, entityClass);
    }
}
