package com.xiaojusurvey.engine.core.survey.impl;

import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: maple
 * @CreateTime: 2024/6/10 21:29
 * @Description: 问卷历史记录服务
 */
@Service
public class SurveyHistoryServiceImpl implements SurveyHistoryService {

    @Resource
    private MongoRepository mongoRepository;

    @Override
    public SurveyHistory addHistory(SurveyHistory surveyHistory) {
        return mongoRepository.save(surveyHistory);
    }

    @Override
    public List<SurveyHistory> getHistoryList(String surveyId, String historyType) {
        // 组合查询条件
        Query query = new Query();
        query.addCriteria(Criteria.where("pageId").is(surveyId))
                .addCriteria(Criteria.where("type").is(historyType));

        // 设置查询选项
        query.limit(100);
        query.with(Sort.by(Sort.Direction.DESC, "createDate"));

        // 选择查询的字段
        query.fields().include("createDate").include("operator").include("type").include("_id");
        return mongoRepository.page(query, 0, 100, SurveyHistory.class);
    }
}
