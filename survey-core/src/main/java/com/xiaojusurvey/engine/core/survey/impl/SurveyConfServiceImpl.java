package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @Author: maple
 * @CreateTime: 2024/6/9 13:52
 * @Description:
 */
@Service
public class SurveyConfServiceImpl implements SurveyConfService {

    @Resource
    private MongoRepository mongoRepository;

    @Override
    public void saveSurveyConfig(SurveyConf surveyConf) {
        SurveyConf codeInfo = this.getSurveyConfBySurveyId(surveyConf.getPageId());
        if (null == codeInfo) {
            throw new ServiceException(RespErrorCode.SURVEY_NOT_FOUND.getMessage(), RespErrorCode.SURVEY_NOT_FOUND.getCode());
        }
        codeInfo.setCode(surveyConf.getCode());
        codeInfo.setUpdateDate(System.currentTimeMillis());
        mongoRepository.save(codeInfo);
    }

    @Override
    public SurveyConf getSurveyConfBySurveyId(String surveyId) {
        Criteria criteria = Criteria.where("pageId").is(surveyId);
        Query query = new Query(criteria);
        return this.mongoRepository.findOne(query, SurveyConf.class);
    }
}
