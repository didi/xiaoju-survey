package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.Status;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.enums.SurveyStatusEnum;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.SurveyPublishService;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.repository.MongoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷ServiceImpl
 */
@Service
@Slf4j
public class SurveyServiceImpl implements SurveyService {

    @Resource
    private MongoRepository mongoRepository;

    @Resource
    private SurveyPublishService surveyPublishService;

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
        Status newStatus = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.NEW);
        surveyMeta.setCurStatus(newStatus);
        List<Status> statusList = Arrays.asList(newStatus);
        surveyMeta.setStatusList(statusList);
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
    public boolean updateMeta(SurveyMetaUpdateParam param) {
        SurveyMeta temp = getSurveyMeta(param.getSurveyId());
        Status st = temp.getCurStatus();
        if (!st.getStatus().equals(SurveyStatusEnum.NEW.getStatus()) && !st.getStatus().equals(SurveyStatusEnum.EDITING.getStatus())) {
            Status newStatus = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.EDITING);
            temp.setCurStatus(newStatus);
            temp.setTitle(param.getTitle());
            temp.setRemark(param.getRemark());
            temp.getStatusList().add(newStatus);
        }
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(param.getSurveyId()));
        Update update = new Update();
        update.set("title", param.getTitle()).set("remark", param.getRemark());
        update.set("curStatus", temp.getCurStatus());
        update.set("statusList", temp.getStatusList());
        mongoRepository.updateFirst(query, update, SurveyMeta.class);
        return true;
    }

    @Override
    public boolean deleteSurvey(String surveyId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(surveyId));
        SurveyMeta meta = mongoRepository.findOne(query, SurveyMeta.class);
        if (meta.getCurStatus().getStatus().equals(SurveyStatusEnum.REMOVED.getStatus())) {
            log.error("[deleteSurvey] 问卷已删除，不能重复删除,surveyId={}", surveyId);
            throw new ServiceException(RespErrorCode.SURVEY_STATUS_TRANSFORM_ERROR.getMessage(), RespErrorCode.SURVEY_STATUS_TRANSFORM_ERROR.getCode()); // 问卷状态转换报错
        }
        Status newStatus = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.REMOVED);
        meta.setCurStatus(newStatus);
        meta.getStatusList().add(newStatus);
        mongoRepository.save(meta);

        //删除问卷回收表
        surveyPublishService.delete(meta);
        return true;
    }


}
