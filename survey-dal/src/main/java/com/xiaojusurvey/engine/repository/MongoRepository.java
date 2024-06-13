package com.xiaojusurvey.engine.repository;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.Collection;
import java.util.List;

public interface MongoRepository {

    /**
     * 保存一个对象，如果对象已存在则更新它
     */
    <T extends BaseEntity> T save(T saveObject);

    /**
     * 保存一个对象到指定集合，如果对象已存在则更新它
     */
    <T extends BaseEntity> T save(T saveObject, String collectionName);

    /**
     * 批量保存一组对象
     */
    <T extends BaseEntity> Collection<T> batchSave(Collection<? extends T> batchToSave, Class<T> entityClass);

    /**
     * 根据查询条件查找单个对象
     */
    <T extends BaseEntity> T findOne(Query query, Class<T> entityClass);

    /**
     * 根据 ID 查找对象
     */
    <T extends BaseEntity> T findById(Object id, Class<T> entityClass);

    /**
     * 查找某个类型的所有对象
     */
    <T extends BaseEntity> List<T> findAll(Class<T> entityClass);

    /**
     * 查找并修改符合条件的对象
     */
    <T extends BaseEntity> T findAndModify(Query query, Update update, Class<T> entityClass);

    /**
     * 查找并删除符合条件的对象
     */
    <T extends BaseEntity> T findAndRemove(Query query, Class<T> entityClass);

    /**
     * 更新第一个符合条件的对象
     */
    <T extends BaseEntity> void updateFirst(Query query, Update update, Class<T> entityClass);

    /**
     * 更新所有符合条件的对象
     */
    <T extends BaseEntity> void updateMulti(Query query, Update update, Class<T> entityClass);

    /**
     * 删除符合条件的对象
     */
    <T extends BaseEntity> void delete(Query query, Class<T> entityClass);

    /**
     * 根据 ID 删除对象
     */
    <T extends BaseEntity> void deleteById(Object id, Class<T> entityClass);

    /**
     * 统计符合条件的对象数量
     */
    <T extends BaseEntity> Long count(Query query, Class<T> entityClass);

    /**
     * 判断是否存在符合条件的对象
     */
    <T extends BaseEntity> boolean exists(Query query, Class<T> entityClass);

    /**
     * 执行聚合查询，例如分组、过滤、排序、投影等
     */
    <T> AggregationResults<T> aggregate(Aggregation aggregation, Class<?> inputType, Class<T> outputType);

    /**
     * 多条件分页查询
     */
    <T extends BaseEntity> List<T> page(Query query, int pageIndex, int pageSize, Class<T> entityClass);
}
