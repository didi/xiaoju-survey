package com.xiaojusurvey.engine.bean;


import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;
import org.dozer.loader.api.BeanMappingBuilder;
import org.dozer.loader.api.FieldsMappingOptions;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * @description: 对象转换
 * @author: wangchenglong
 * @time: 2024/7/24 14:23
 */
@Component
public class GeneralConvertor {

    @Resource
    private Mapper mapper;

    /**
     * List  实体类 转换器
     *
     * @param source 原数据
     * @param clz    转换类型
     * @param <T>
     * @param <S>
     * @return
     */
    public <T,S> List<T> convertor(List<S> source, Class<T> clz){
        if (source == null) return null;
        List<T> map = new ArrayList<>();
        for (S s : source) {
            map.add(mapper.map(s, clz));
        }
        return map;
    }


    /**
     * Set 实体类 深度转换器
     *
     * @param source 原数据
     * @param clz    目标对象
     * @param <T>
     * @param <S>
     * @return
     */
    public <T, S> Set<T> convertor(Set<S> source, Class<T> clz) {
        if (source == null) return null;
        Set<T> set = new TreeSet<>();
        for (S s : source) {
            set.add(mapper.map(s, clz));
        }
        return set;
    }

    /**
     * 实体类 深度转换器
     *
     * @param source
     * @param clz
     * @param <T>
     * @param <S>
     * @return
     */
    public <T, S> T convertor(S source, Class<T> clz) {
        if (source == null) return null;
        return mapper.map(source, clz);
    }

    /**
     * 针对mongodb中的_id及id字段的转换
     * @param source
     * @param destinationClass
     * @param <T>
     * @return
     */
    public <T> T convertor_id(Object source, Class<T> destinationClass) {
        Mapper mapper = new DozerBeanMapper();
        ((DozerBeanMapper) mapper).addMapping(new BeanMappingBuilder() {
            @Override
            protected void configure() {
                mapping(source.getClass(), destinationClass)
                        .fields("id", "_id", FieldsMappingOptions.copyByReference());
            }
        });
        return mapper.map(source, destinationClass);
    }

    public <S, T> List<T> convertor_ids(List<S> sourceList, Class<T> destinationClass) {
        List<T> destinationList = new ArrayList<>();
        for (S source : sourceList) {
            destinationList.add(convertor_id(source, destinationClass));
        }
        return destinationList;
    }


    public void convertor(Object source, Object object) {
        mapper.map(source, object);
    }

    public <T> void copyConvertor(T source, Object object) {
        mapper.map(source, object);
    }

}
