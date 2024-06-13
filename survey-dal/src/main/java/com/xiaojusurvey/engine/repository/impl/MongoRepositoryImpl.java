package com.xiaojusurvey.engine.repository.impl;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import com.xiaojusurvey.engine.common.exception.DaoException;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.Collection;
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
    public <T extends BaseEntity> T save(T saveObject, String collectionName) {
        return mongoTemplate.save(saveObject, collectionName);
    }

    @Override
    public <T extends BaseEntity> Collection<T> batchSave(Collection<? extends T> batchToSave,
        Class<T> entityClass) {
        return mongoTemplate.insert(batchToSave, entityClass);
    }

    @Override
    public <T extends BaseEntity> T findOne(Query query, Class<T> entityClass) {
        return mongoTemplate.findOne(query, entityClass);
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
    public <T extends BaseEntity> T findAndModify(Query query, Update update, Class<T> entityClass) {
        return mongoTemplate.findAndModify(query, update, entityClass);
    }

    @Override
    public <T extends BaseEntity> T findAndRemove(Query query, Class<T> entityClass) {
        return mongoTemplate.findAndRemove(query, entityClass);
    }

    @Override
    public <T extends BaseEntity> void updateFirst(Query query, Update update, Class<T> entityClass) {
        mongoTemplate.updateFirst(query, update, entityClass);
    }

    @Override
    public <T extends BaseEntity> void updateMulti(Query query, Update update, Class<T> entityClass) {
        mongoTemplate.updateMulti(query, update, entityClass);
    }

    @Override
    public <T extends BaseEntity> void delete(Query query, Class<T> entityClass) {
        mongoTemplate.remove(query, entityClass);
    }

    @Override
    public <T extends BaseEntity> void deleteById(Object id, Class<T> entityClass) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, entityClass);
    }

    @Override
    public <T extends BaseEntity> Long count(Query query, Class<T> entityClass) {
        return mongoTemplate.count(query, entityClass);
    }

    @Override
    public <T extends BaseEntity> boolean exists(Query query, Class<T> entityClass) {
        return mongoTemplate.exists(query, entityClass);
    }

    @Override
    public <T> AggregationResults<T> aggregate(Aggregation aggregation, Class<?> inputType, Class<T> outputType) {
        return mongoTemplate.aggregate(aggregation, inputType, outputType);
    }

    @Override
    public <T extends BaseEntity> List<T> page(Query query, int pageIndex, int pageSize, Class<T> entityClass) {
        PageRequest pageRequest = PageRequest.of(pageIndex, pageSize);
        query.with(pageRequest);

        return mongoTemplate.find(query, entityClass);
    }

}
