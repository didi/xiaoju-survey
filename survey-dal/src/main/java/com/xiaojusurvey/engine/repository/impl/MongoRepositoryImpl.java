package com.xiaojusurvey.engine.repository.impl;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import com.xiaojusurvey.engine.common.exception.DaoException;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
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
        return null;
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
}
