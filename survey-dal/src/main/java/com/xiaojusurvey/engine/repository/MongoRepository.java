package com.xiaojusurvey.engine.repository;

import com.xiaojusurvey.engine.common.entity.BaseEntity;

import java.util.List;

public interface MongoRepository {

    <T extends BaseEntity> T save(T saveObject);

    <T extends BaseEntity> T findById(Object id, Class<T> entityClass);

    <T extends  BaseEntity> List<T> findAll(Class<T> entityClass);
}
