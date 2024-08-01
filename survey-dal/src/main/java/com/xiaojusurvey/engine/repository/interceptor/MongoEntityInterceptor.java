package com.xiaojusurvey.engine.repository.interceptor;

import com.xiaojusurvey.engine.common.entity.BaseEntity;
import com.xiaojusurvey.engine.common.entity.InitBaseEntity;
import com.xiaojusurvey.engine.common.entity.Status;
import com.xiaojusurvey.engine.common.enums.RecordStatusEnum;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.Arrays;
import java.util.List;

/**
 * @description: mongodb事件拦截器
 * @author: wangchenglong
 * @time: 2024/7/30 16:37
 * @param <T>
 */
@Component
public class MongoEntityInterceptor<T> extends AbstractMongoEventListener<T> {

    @Override
    public void onBeforeConvert(BeforeConvertEvent<T> event) {
        Object entity = event.getSource();
        long time = System.currentTimeMillis();
        if (entity instanceof BaseEntity) {
            String id = ((BaseEntity) entity).getId();
            if (ObjectUtils.isEmpty(id)) {
                Status status = new Status().setStatus(RecordStatusEnum.NEW.getStatusType()).setDate(time);
                ((BaseEntity) entity).setCurStatus(status)
                        .setCreateDate(time).setUpdateDate(time)
                        .setStatusList(Arrays.asList(status));
            }
        }
    }

    /**
     * 更新操作维护公共字段
     * @param statusList
     * @return
     */
    public static InitBaseEntity updateDocument(List<Status> statusList) {
        long time = System.currentTimeMillis();
        Status status = new Status().setStatus(RecordStatusEnum.REMOVED.getStatusType()).setDate(time);
        statusList.add(status);
        return (InitBaseEntity) new InitBaseEntity().setUpdateDate(time)
                .setCurStatus(status)
                .setStatusList(statusList);
    }

}
