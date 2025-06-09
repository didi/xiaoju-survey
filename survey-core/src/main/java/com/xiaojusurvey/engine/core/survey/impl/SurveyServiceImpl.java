package com.xiaojusurvey.engine.core.survey.impl;

import java.util.ArrayList;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.constants.SurveyConstant;
import com.xiaojusurvey.engine.common.entity.Status;
import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.entity.survey.SurveyHistory;
import com.xiaojusurvey.engine.common.entity.survey.SurveyMeta;
import com.xiaojusurvey.engine.common.entity.survey.SurveyPublish;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.enums.HistoryTypeEnum;
import com.xiaojusurvey.engine.common.enums.SurveyStatusEnum;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.reslut.IdResult;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.SurveyHistoryService;
import com.xiaojusurvey.engine.core.survey.SurveyPublishService;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import com.xiaojusurvey.engine.core.survey.dto.FilterItem;
import com.xiaojusurvey.engine.core.survey.param.SurveyListParam;
import com.xiaojusurvey.engine.core.survey.param.SurveyMetaUpdateParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyListVO;
import com.xiaojusurvey.engine.core.survey.vo.SurveyVO;
import com.xiaojusurvey.engine.core.util.WebUtils;
import com.xiaojusurvey.engine.repository.MongoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Resource
    private SurveyConfService surveyConfService;

    @Resource
    private SurveyHistoryService surveyHistoryService;

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
        //保存survyConf
        SurveyConf conf = new SurveyConf();
        conf.setPageId(idResult.getId());
        Map map = new HashMap<>(4);
        conf.setCode(map);
//        conf.setId("");
//        conf.setCreateDate(0L);
//        conf.setUpdateDate(0L);
        conf.setCurStatus(new Status());
        conf.setStatusList(new ArrayList<Status>());
        surveyConfService.createSurveyConf(conf);
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

    @Override
    public boolean publishSurvey(String surveyId) {
        //1,查询问卷配置
        SurveyConf conf = surveyConfService.getSurveyConfBySurveyId(surveyId);
        SurveyMeta meta = getSurveyMeta(surveyId);
        //2，surveyMeta保存
        Status pub = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.PUBLISHED);
        meta.setCurStatus(pub);
        meta.getStatusList().add(pub);
        mongoRepository.save(meta);

        //3，保存问卷配置到publish表
        SurveyPublish publish = new SurveyPublish();
        publish.setPageId(surveyId);
        publish.setTitle(meta.getTitle());
        publish.setSurveyPath(meta.getSurveyPath());
        publish.setCode(conf.getCode());
//        publish.setId("");
//        publish.setCreateDate(0L);
//        publish.setUpdateDate(0L);
//        Status pub = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.PUBLISHED);
        publish.setCurStatus(pub);
        publish.setStatusList(Arrays.asList(pub));
        surveyPublishService.save(publish);

        //4，保存history
        SurveyHistory his = new SurveyHistory();
        his.setPageId(conf.getId());
        his.setSchema(conf.getCode());
        his.setType(HistoryTypeEnum.PUBLISH_HIS.getHistoryType());
        User user = (User) WebUtils.getHttpServletRequest().getAttribute("user");
        Map<String, Object> opt = new HashMap<>(4);
        opt.put("_id", user.getId());
        opt.put("username", user.getUsername());
        his.setOperator(opt);
        Status st = SurveyStatusEnum.getSpecStatus(SurveyStatusEnum.NEW);
        his.setCurStatus(st);
        his.setStatusList(Arrays.asList(st));
        surveyHistoryService.addHistory(his);
        return true;
    }

    @Override
    public SurveyListVO getSurveyList(SurveyListParam param) {
        log.info("[getSurveyList]获取问卷列表 param={}", param);
        Query query = buildQuery(param);
        List<SurveyMeta> list = mongoRepository.page(query, param.getCurPage() - 1, param.getPageSize(), SurveyMeta.class);
        Long count = mongoRepository.count(query, SurveyMeta.class);
        SurveyListVO vo = new SurveyListVO();
        vo.setCount(count);
        List<SurveyVO> data = new ArrayList<>();
        if (!CollectionUtils.isEmpty(list)) {
            data = list.stream().map(r -> {
                SurveyVO surveyVO = new SurveyVO();
                BeanUtils.copyProperties(r, surveyVO);
                return surveyVO;
            }).collect(Collectors.toList());
        }
        vo.setData(data);
        return vo;
    }


    private Query buildQuery(SurveyListParam param) {
        Query query = new Query();
        if (param.getOrder() != null) {
            List<Sort.Order> orders = new ArrayList<>();
            Arrays.stream(param.getOrder()).forEach(r -> {
                if (r.getValue() == 1) {
                    orders.add(new Sort.Order(Sort.Direction.ASC, r.getField()));
                } else {
                    orders.add(new Sort.Order(Sort.Direction.DESC, r.getField()));
                }
            });
            query.with(Sort.by(orders));
        }
        Criteria criteria = new Criteria();
        List<Criteria> listAnd = new ArrayList();
        List<Criteria> listOr = new ArrayList();
        if (StringUtils.hasLength(param.getWorkspaceId())) {
            listAnd.add(Criteria.where("workspaceId").is(param.getWorkspaceId()));
        }
        if (StringUtils.hasLength(param.getUsername())) {
            listAnd.add(Criteria.where("owner").is(param.getUsername()));
        }
        if (StringUtils.hasLength(param.getUserId())) {
            listAnd.add(Criteria.where("ownerId").is(param.getUserId()));
        }
        if (param.getFilter() != null) {
            Arrays.stream(param.getFilter()).forEach(r -> {
                if (r.getCondition() != null) {
                    for (FilterItem.FilterCondition ff : r.getCondition()) {
                        Criteria crt = null;
                        if (SurveyConstant.OPT_NE.equals(ff.getComparator())) {
                            crt = Criteria.where(ff.getField()).ne(ff.getValue());
                        } else if (SurveyConstant.OPT_REGEX.equals(ff.getComparator())) {
                            crt = Criteria.where(ff.getField()).regex(ff.getValue());
                        } else {
                            crt = Criteria.where(ff.getField()).is(ff.getValue()); // 默认处理
                        }
                        if (crt != null) {
                            if (StringUtils.hasLength(r.getComparator()) && SurveyConstant.OPT_OR.equals(r.getComparator())) {
                                listOr.add(crt);
                            } else {
                                listOr.add(crt);
                            }
                        }
                    }
                }
            });
        }
        if (!listAnd.isEmpty()) {
            criteria.andOperator(listAnd);
        }
        if (!listOr.isEmpty()) {
            criteria = criteria.orOperator(listOr);
        }
        query.addCriteria(criteria);
        return query;
    }
}
