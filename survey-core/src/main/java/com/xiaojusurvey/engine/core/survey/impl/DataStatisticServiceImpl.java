package com.xiaojusurvey.engine.core.survey.impl;

import com.alibaba.fastjson.JSON;
import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.entity.survey.SurveySubmit;
import com.xiaojusurvey.engine.common.enums.QuestionTypeEnum;
import com.xiaojusurvey.engine.core.survey.DataStatisticService;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.dto.SurveyConfCode;
import com.xiaojusurvey.engine.core.survey.param.AggregationStatisParam;
import com.xiaojusurvey.engine.core.survey.param.DataTableParam;
import com.xiaojusurvey.engine.core.survey.vo.AggregationStatisVO;
import com.xiaojusurvey.engine.core.survey.vo.DataTableVO;
import com.xiaojusurvey.engine.repository.MongoRepository;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description:
 */
@Service
@Slf4j
public class DataStatisticServiceImpl implements DataStatisticService {
    // 特殊单选题型
    private static final List<String> RADIO_TYPES = Arrays.asList("RADIO_STAR", "RADIO_NPS");
    private static final String KEY_DATA_CONF = "dataConf";
    private static final String TYPE_CASCADER = "CASCADER";
    private static final String SUFFIX_CUSTOM = "_custom";
    private static final int PHONE_NUMBER_LENGTH = 11;
    private static final int ID_CARD_LENGTH = 18;
    private static final int MIN_EMAIL_NAME_VISIBLE_CHARS = 2;

    @Resource
    private MongoRepository mongoRepository;

    @Resource
    private MongoTemplate mongoTemplate;

    @Resource
    private SurveyConfService surveyConfService;

    private static final int MEDIAN_DIVISOR = 2;
    private static final int DECIMAL_SCALE = 2;
  
    @Override
    public DataTableVO getDataTable(DataTableParam param) {
        // 1. 获取问卷配置
        SurveyConf surveyConf = surveyConfService.getSurveyConfBySurveyId(param.getSurveyId());
        if (surveyConf == null || surveyConf.getCode() == null) {
            return createEmptyResult();
        }

        // 2. 解析dataList
        List<SurveyConfCode.DataItem> dataList = extractDataList(surveyConf);
        List<DataTableVO.ListHeadItem> listHead = generateListHead(dataList);
        Map<String, SurveyConfCode.DataItem> dataListMap = dataList.stream()
                .collect(Collectors.toMap(
                        SurveyConfCode.DataItem::getField,
                        item -> item
                ));

        // 3. 分页查询回收数据
        Query query = new Query();
        query.addCriteria(Criteria.where("pageId").is(param.getSurveyId()));
        query.addCriteria(Criteria.where("isDeleted").ne(true));
        query.with(Sort.by(Sort.Direction.DESC, "createDate"));

        // 分页处理
        int skip = (param.getPage() - 1) * param.getPageSize();
        List<SurveySubmit> surveySubmitList = mongoRepository.page(query, skip / param.getPageSize(),
                param.getPageSize(), SurveySubmit.class);

        // 总数查询
        Long total = mongoRepository.count(query, SurveySubmit.class);

        // 4. 数据转换处理
        List<Map<String, Object>> listBody = surveySubmitList.stream()
                .map(submit -> processSubmitData(submit, dataListMap))
                .collect(Collectors.toList());

        // 5. 数据脱敏
        if (param.getIsMasked()) {
            applyDataMasking(listBody);
        }

        DataTableVO result = new DataTableVO();
        result.setTotal(total);
        result.setListHead(listHead);
        result.setListBody(listBody);

        return result;
    }

    // 从SurveyConf中提取dataList
    private List<SurveyConfCode.DataItem> extractDataList(SurveyConf surveyConf) {
        try {
            Map<String, Object> code = surveyConf.getCode();
            if (code != null && code.containsKey(KEY_DATA_CONF)) {
                Object dataConfObj = code.get(KEY_DATA_CONF);
                String dataConfJson = JSON.toJSONString(dataConfObj);
                SurveyConfCode.DataConf dataConf = JSON.parseObject(dataConfJson, SurveyConfCode.DataConf.class);
                return dataConf.getDataList() != null ? dataConf.getDataList() : new ArrayList<>();
            }
        } catch (Exception e) {
            log.error("解析dataList失败", e);
        }
        return new ArrayList<>();
    }

    // 生成表头信息
    private List<DataTableVO.ListHeadItem> generateListHead(List<SurveyConfCode.DataItem> dataList) {
        List<DataTableVO.ListHeadItem> listHead = new ArrayList<>();

        for (SurveyConfCode.DataItem item : dataList) {
            DataTableVO.ListHeadItem headItem = new DataTableVO.ListHeadItem();
            headItem.setField(item.getField());
            headItem.setTitle(item.getTitle());
            headItem.setType(item.getType());
            listHead.add(headItem);
        }

        // 添加系统字段
        DataTableVO.ListHeadItem diffTimeItem = new DataTableVO.ListHeadItem();
        diffTimeItem.setField("diffTime");
        diffTimeItem.setTitle("答题时长(秒)");
        listHead.add(diffTimeItem);

        DataTableVO.ListHeadItem createdAtItem = new DataTableVO.ListHeadItem();
        createdAtItem.setField("createdAt");
        createdAtItem.setTitle("提交时间");
        listHead.add(createdAtItem);

        return listHead;
    }

    // 核心数据处理逻辑
    private Map<String, Object> processSubmitData(SurveySubmit submit,
                                                  Map<String, SurveyConfCode.DataItem> dataListMap) {
        Map<String, Object> data = new HashMap<>(submit.getData());
        Set<String> dataKeys = new HashSet<>(data.keySet());

        // 遍历所有数据字段
        for (String itemKey : dataKeys) {
            if (!itemKey.startsWith("data")) {
                continue;
            }

            // 获取题目id (data1_xxx -> data1)
            String itemConfigKey = itemKey.split("_")[0];
            SurveyConfCode.DataItem itemConfig = dataListMap.get(itemConfigKey);

            if (itemConfig == null) {
                continue; // 题目删除会出现这种情况
            }

            // 1. 处理特殊单选题型的自定义输入框
            processRadioCustomInput(data, itemConfigKey, itemConfig);

            // 2. 将选项ID还原成选项文案
            convertOptionIdsToText(data, itemKey, itemConfig);

            // 3. 处理多级联动数据转换
            processCascaderData(data, itemKey, itemConfig);
        }

        // 添加系统字段
        data.put("diffTime", submit.getDiffTime() != null
                ? String.format("%.2f", submit.getDiffTime() / 1000.0) : "0");
        data.put("createdAt", formatDate(new Date(submit.getCreateDate())));

        return data;
    }

    /**
     * 处理多级联动数据转换
     * 多级联动在数据库中存储为逗号分隔的ID路径，如"110000,110100,110101",需要转换为用户可读的文案路径，如"北京-北京市-东城区"
     * 每一级的选项都依赖于上一级的选择
     */
    private void processCascaderData(Map<String, Object> data, String itemKey,
                                     SurveyConfCode.DataItem itemConfig) {
        boolean isCascader = TYPE_CASCADER.equals(itemConfig.getType());
        Map<String, Object> cascaderData = itemConfig.getCascaderData();
        if (!isCascader || cascaderData == null) {
            return;
        }

        Object value = data.get(itemKey);
        if (value != null) {
            String valueStr = value.toString();
            if (!valueStr.isEmpty()) {
                String[] ids = valueStr.split(",");
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> currentLevelOptions =
                        (List<Map<String, Object>>) cascaderData.get("children");
                if (currentLevelOptions != null) {
                    fillCascaderTextPath(data, itemKey, ids, currentLevelOptions);
                }
            }
        }
    }

    private void fillCascaderTextPath(Map<String, Object> data, String itemKey,
                                      String[] ids, List<Map<String, Object>> rootOptions) {
        Map<String, Map<String, Object>> currentLevelMap = rootOptions.stream()
                .collect(Collectors.toMap(
                        option -> (String) option.get("hash"),
                        option -> option,
                        (existing, replacement) -> existing
                ));

        List<String> textPath = new ArrayList<>();
        for (String id : ids) {
            Map<String, Object> currentOption = currentLevelMap.get(id);
            if (currentOption != null) {
                String text = (String) currentOption.get("text");
                textPath.add(text != null ? text : id);

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> nextLevelOptions =
                        (List<Map<String, Object>>) currentOption.get("children");
                if (nextLevelOptions != null && !nextLevelOptions.isEmpty()) {
                    currentLevelMap = nextLevelOptions.stream()
                            .collect(Collectors.toMap(
                                    option -> (String) option.get("hash"),
                                    option -> option,
                                    (existing, replacement) -> existing
                            ));
                } else {
                    break;
                }
            } else {
                textPath.add(id);
            }
        }

        data.put(itemKey, String.join("-", textPath));
    }

    private void processRadioCustomInput(Map<String, Object> data, String itemConfigKey,
                                         SurveyConfCode.DataItem itemConfig) {
        String type = itemConfig.getType();
        if (RADIO_TYPES.contains(type) && !data.containsKey(itemConfigKey + SUFFIX_CUSTOM)) {
            Object selectedValue = data.get(itemConfigKey);
            if (selectedValue != null) {
                String customKey = itemConfigKey + "_" + selectedValue;
                Object customValue = data.get(customKey);
                if (customValue != null) {
                    data.put(itemConfigKey + SUFFIX_CUSTOM, customValue);
                }
            }
        }
    }

    // 将选项Id还原成选项文案
    private void convertOptionIdsToText(Map<String, Object> data, String itemKey,
                                        SurveyConfCode.DataItem itemConfig) {
        List<SurveyConfCode.Option> options = itemConfig.getOptions();
        if (options == null || options.isEmpty()) {
            return;
        }

        // 构建hash->text映射
        Map<String, String> optionTextMap = options.stream()
                .collect(Collectors.toMap(
                        SurveyConfCode.Option::getHash,
                        SurveyConfCode.Option::getText,
                        (existing, replacement) -> existing
                ));

        Object value = data.get(itemKey);
        if (value instanceof List) {
            // 多选：["id1","id2"] -> "选项1,选项2"
            @SuppressWarnings("unchecked")
            List<String> valueList = (List<String>) value;
            String convertedValue = valueList.stream()
                    .map(item -> optionTextMap.getOrDefault(item, item))
                    .collect(Collectors.joining(","));
            data.put(itemKey, convertedValue);
        } else if (value != null) {
            // 单选：将ID转换为文案
            data.put(itemKey, optionTextMap.getOrDefault(value.toString(), value.toString()));
        }
    }

    // 数据脱敏
    private void applyDataMasking(List<Map<String, Object>> listBody) {
        for (Map<String, Object> item : listBody) {
            item.forEach((key, value) -> {
                if (value instanceof String) {
                    String strValue = (String) value;
                    // 手机号、身份证、邮箱脱敏
                    if (isPhoneNumber(strValue)) {
                        item.put(key, maskPhoneNumber(strValue));
                    } else if (isIdCard(strValue)) {
                        item.put(key, maskIdCard(strValue));
                    } else if (isEmail(strValue)) {
                        item.put(key, maskEmail(strValue));
                    }
                }
            });
        }
    }

    private boolean isPhoneNumber(String value) {
        return value.matches("^1[3-9]\\d{9}$");
    }

    private String maskPhoneNumber(String phone) {
        if (phone.length() == PHONE_NUMBER_LENGTH) {
            return phone.substring(0, 3) + "****" + phone.substring(7);
        }
        return phone;
    }

    private boolean isIdCard(String value) {
        return value.matches("^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$");
    }

    private String maskIdCard(String idCard) {
        if (idCard.length() == ID_CARD_LENGTH) {
            return idCard.substring(0, 6) + "********" + idCard.substring(14);
        }
        return idCard;
    }

    private boolean isEmail(String value) {
        return value.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf("@");
        if (atIndex > MIN_EMAIL_NAME_VISIBLE_CHARS) {
            return email.substring(0, 2) + "***" + email.substring(atIndex);
        }
        return email;
    }

    private String formatDate(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(date);
    }

    private DataTableVO createEmptyResult() {
        DataTableVO result = new DataTableVO();
        result.setTotal(0L);
        result.setListHead(new ArrayList<>());
        result.setListBody(new ArrayList<>());
        return result;
    }

    private static final List<String> AGGREGATION_SUPPORTED_TYPES = Arrays.stream(QuestionTypeEnum.getAggregationSupportTypes())
            .map(QuestionTypeEnum::getType)
            .collect(Collectors.toList());

    @Override
    public List<AggregationStatisVO> getAggregationStatis(AggregationStatisParam param) {
        // 1. 获取问卷配置
        SurveyConf surveyConf = surveyConfService.getSurveyConfBySurveyId(param.getSurveyId());
        if (surveyConf == null || surveyConf.getCode() == null) {
            return new ArrayList<>();
        }

        // 2. 解析 dataList
        List<SurveyConfCode.DataItem> dataList = extractDataList(surveyConf);

        // 3. 过滤支持聚合统计的字段
        List<String> fieldList = dataList.stream()
                .filter(item -> AGGREGATION_SUPPORTED_TYPES.contains(item.getType()))
                .map(SurveyConfCode.DataItem::getField)
                .collect(Collectors.toList());
        if (dataList.isEmpty() || fieldList.isEmpty()) {
            return new ArrayList<>();
        }

        // 4. 创建 dataMap, 便于数据处理
        Map<String, SurveyConfCode.DataItem> dataMap = dataList.stream()
                .collect(Collectors.toMap(
                        SurveyConfCode.DataItem::getField,
                        item -> item
                ));

        // 5. 执行聚合查询
        List<AggregationResult> aggregationResults = performAggregationQuery(param.getSurveyId(), fieldList);

        // 6. 处理聚合结果
        return aggregationResults.stream()
                .map(result -> processAggregationData(result, dataMap))
                .collect(Collectors.toList());
    }

    /**
     * 执行MongoDB聚合查询
     */
    private List<AggregationResult> performAggregationQuery(String surveyId, List<String> fieldList) {
        try {
            // 1. 构建聚合操作列表
            List<AggregationOperation> operations = new ArrayList<>();

            // 2. 添加匹配条件
            Criteria matchCriteria = Criteria.where("pageId").is(surveyId)
                    .and("isDeleted").ne(true);
            operations.add(Aggregation.match(matchCriteria));

            // 3. 构建facet操作
            FacetOperation facetOperation = Aggregation.facet();

            for (String field : fieldList) {
                String dataField = "data." + field;

                // 为每个字段创建聚合管道
                AggregationOperation matchOp = Aggregation.match(
                        Criteria.where(dataField).nin(Arrays.asList(null, "", Collections.emptyList()))
                );
                AggregationOperation groupOp = Aggregation.group("$" + dataField).count().as("count");
                AggregationOperation projectOp = Aggregation.project()
                        .andExclude("_id")
                        .and("count").as("count")
                        .and("_id").as(dataField);

                facetOperation = facetOperation.and(matchOp, groupOp, projectOp).as(field);
            }

            operations.add(facetOperation);

            // 5. 执行聚合查询
            Aggregation aggregation = Aggregation.newAggregation(operations);

            // 使用MongoTemplate执行聚合
            AggregationResults<Map> results = mongoTemplate.aggregate(
                    aggregation,
                    "surveySubmit",
                    Map.class
            );

            // 6. 处理查询结果
            return processAggregationResults(results.getMappedResults(), fieldList);

        } catch (Exception e) {
            log.error("MongoDB聚合查询执行失败", e);
            return new ArrayList<>();
        }
    }

    @Data
    private static class AggregationResult {
        private String field;
        private List<AggregationStatisVO.AggregationItem> aggregationItems;
        private Long submissionCount;
    }

    /**
     * 处理MongoDB聚合查询结果
     */
    private List<AggregationResult> processAggregationResults(List<Map> results, List<String> fieldList) {
        List<AggregationResult> resultList = new ArrayList<>();
        if (results.isEmpty()) {
            return resultList;
        }
        Map<String, Object> facetResults = results.get(0);
        for (String field : fieldList) {
            try {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> fieldResults = (List<Map<String, Object>>) facetResults.get(field);
                if (fieldResults == null) {
                    continue;
                }
                // 计算提交总次数
                long submissionCount = fieldResults.stream()
                        .mapToLong(item -> {
                            Object countObj = item.get("count");
                            return countObj instanceof Number ? ((Number) countObj).longValue() : 0L;
                        })
                        .sum();
                // 构建聚合项目列表
                List<AggregationStatisVO.AggregationItem> aggregationItems = fieldResults.stream()
                        .map(item -> {
                            AggregationStatisVO.AggregationItem aggregationItem = new AggregationStatisVO.AggregationItem();
                            Object idObj = item.get("data." + field);
                            aggregationItem.setId(idObj != null ? String.valueOf(idObj) : "");
                            Object countObj = item.get("count");
                            aggregationItem.setCount(countObj instanceof Number ? ((Number) countObj).longValue() : 0L);
                            return aggregationItem;
                        })
                        .filter(item -> !item.getId().isEmpty() && item.getCount() > 0)
                        .collect(Collectors.toList());

                AggregationResult result = new AggregationResult();
                result.setField(field);
                result.setAggregationItems(aggregationItems);
                result.setSubmissionCount(submissionCount);
                resultList.add(result);
            } catch (Exception e) {
                log.warn("处理字段聚合结果失败，field={}", field, e);
            }
        }
        return resultList;
    }

    /**
     * 处理单个聚合数据结果（对于不同问题类型进行不同处理）
     */
    private AggregationStatisVO processAggregationData(AggregationResult result, Map<String, SurveyConfCode.DataItem> dataMap) {
        try {
            SurveyConfCode.DataItem dataItem = dataMap.get(result.getField());
            if (dataItem == null) {
                return null;
            }
            QuestionTypeEnum questionType = QuestionTypeEnum.fromType(dataItem.getType());

            AggregationStatisVO vo = new AggregationStatisVO();
            vo.setField(result.getField());
            vo.setTitle(dataItem.getTitle());
            vo.setType(dataItem.getType());

            AggregationStatisVO.AggregationData data = new AggregationStatisVO.AggregationData();
            data.setSubmissionCount(result.getSubmissionCount());
            if (questionType != null && questionType.isOptionType()) {
                // 选项类题型（RADIO, CHECKBOX, VOTE, BINARY_CHOICE)
                data.setAggregation(processOptionTypeAggregation(result, dataItem));
            } else if (questionType != null && questionType.isRatingType()) {
                // 处理评分类题型(RADIO_STAR, RADIO_NPS)
                data.setAggregation(processRatingTypeAggregation(result, questionType));
                data.setSummary(calculateRatingSummary(result, questionType));
            } else if (questionType == QuestionTypeEnum.CASCADER) {
                // 处理级联
                data.setAggregation(processCascaderTypeAggregation(result, dataItem));
            } else {
                // 其他类型返回原始数据
                data.setAggregation(result.getAggregationItems());
            }
            vo.setData(data);
            return vo;
        } catch (Exception e) {
            log.error("处理聚合数据失败，field={}", result.getField(), e);
            return null;
        }
    }

    /**
     * 处理级联题型的聚合数据
     */
    private List<AggregationStatisVO.AggregationItem> processCascaderTypeAggregation(AggregationResult result, SurveyConfCode.DataItem dataItem) {
        Map<String, Object> cascaderData = dataItem.getCascaderData();
        if (cascaderData == null) {
            return result.getAggregationItems();
        }

        // 创建聚合数据的映射
        Map<String, Long> aggregationMap = result.getAggregationItems().stream()
                .collect(Collectors.toMap(
                        AggregationStatisVO.AggregationItem::getId,
                        AggregationStatisVO.AggregationItem::getCount,
                        (existing, replacement) -> existing
                ));
        // 提取所有可能的路径
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> children = (List<Map<String, Object>>) cascaderData.get("children");
        if (children == null) {
            List<CascaderPath> allPaths = extractAllCascaderPaths(children, "", "");

            return allPaths.stream()
                    .map(path -> {
                        AggregationStatisVO.AggregationItem item = new AggregationStatisVO.AggregationItem();
                        item.setId(path.getId());
                        item.setText(path.getText());
                        item.setCount(aggregationMap.getOrDefault(path.getId(), 0L));
                        return item;
                    })
                    .filter(item -> item.getCount() > 0)
                    .collect(Collectors.toList());
        }
        return result.getAggregationItems();
    }

    private List<CascaderPath> extractAllCascaderPaths(List<Map<String, Object>> children, String textPrefix, String idPrefix) {
        List<CascaderPath> paths = new ArrayList<>();
        if (children != null) {
            for (Map<String, Object> child : children) {
                String text = (String) child.get("text");
                String hash = (String) child.get("hash");
                String currentText = textPrefix.isEmpty() ? text : textPrefix + "-" + text;
                String currentId = idPrefix.isEmpty() ? hash : idPrefix + "," + hash;
                paths.add(new CascaderPath(currentId, currentText));
                // 递归处理子级
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> subChildren = (List<Map<String, Object>>) child.get("children");
                if (subChildren != null && !subChildren.isEmpty()) {
                    paths.addAll(extractAllCascaderPaths(subChildren, currentText, currentId));
                }
            }
        }
        return paths;
    }

    /**
     * 多级联动路径内部类
     */
    @Data
    private static class CascaderPath {
        private String id;
        private String text;

        CascaderPath(String id, String text) {
            this.id = id;
            this.text = text;
        }
    }

    /**
     * 处理选项类题型的聚合数据
     */
    private List<AggregationStatisVO.AggregationItem> processOptionTypeAggregation(AggregationResult result, SurveyConfCode.DataItem dataItem) {
        List<SurveyConfCode.Option> options = dataItem.getOptions();
        if (options == null || options.isEmpty()) {
            return result.getAggregationItems();
        }
        // 创建选项ID到文本的映射
        Map<String, String> optionTextMap = options.stream()
                .collect(Collectors.toMap(
                        SurveyConfCode.Option::getHash,
                        SurveyConfCode.Option::getText,
                        (existing, replacement) -> existing
                ));
        // 创建聚合数据的映射
        Map<String, Long> aggregationMap = result.getAggregationItems().stream()
                .collect(Collectors.toMap(
                        AggregationStatisVO.AggregationItem::getId,
                        AggregationStatisVO.AggregationItem::getCount,
                        (existing, replacement) -> existing
                ));
        // 为每个选项生成聚合项目
        return options.stream()
                .map(option -> {
                    AggregationStatisVO.AggregationItem item = new AggregationStatisVO.AggregationItem();
                    item.setId(option.getHash());
                    item.setText(option.getText());
                    item.setCount(aggregationMap.getOrDefault(option.getHash(), 0L));
                    return item;
                })
                .collect(Collectors.toList());
    }

    /**
     * 处理评分题型的聚合数据
     */
    private List<AggregationStatisVO.AggregationItem> processRatingTypeAggregation(AggregationResult result, QuestionTypeEnum questionType) {
        // 确定评分范围
        int[] range = questionType == QuestionTypeEnum.RADIO_NPS ? new int[]{0, 10} : new int[]{1, 5};
        // 创建聚合数据的映射
        Map<String, Long> aggregationMap = result.getAggregationItems().stream()
                .collect(Collectors.toMap(
                        AggregationStatisVO.AggregationItem::getId,
                        AggregationStatisVO.AggregationItem::getCount,
                        (existing, replacement) -> (existing)
                ));
        // 为每个评分值生成聚合项目
        List<AggregationStatisVO.AggregationItem> items = new ArrayList<>();
        for (int i = range[0]; i <= range[1]; i++) {
            AggregationStatisVO.AggregationItem item = new AggregationStatisVO.AggregationItem();
            String scoreStr = String.valueOf(i);
            item.setId(scoreStr);
            item.setText(scoreStr);
            item.setCount(aggregationMap.getOrDefault(scoreStr, 0L));
            items.add(item);
        }
        return items;
    }


    /**
     * 计算评分题型的统计结果
     */
    private AggregationStatisVO.StatisticSummary calculateRatingSummary(AggregationResult result, QuestionTypeEnum questionType) {
        if (result.getAggregationItems() == null || result.getAggregationItems().isEmpty()) {
            return null;
        }
        //展开数据点
        List<BigDecimal> dataPoints = new ArrayList<>();
        for (AggregationStatisVO.AggregationItem item : result.getAggregationItems()) {
            try {
                BigDecimal value = new BigDecimal(item.getId());
                for (int i = 0; i < item.getCount(); i++) {
                    dataPoints.add(value);
                }
            } catch (NumberFormatException e) {
                log.warn("评分值转换失败：{}", item.getId(), e);
            }
        }
        if (dataPoints.isEmpty()) {
            return null;
        }
        AggregationStatisVO.StatisticSummary summary = new AggregationStatisVO.StatisticSummary();

        //计算平均值
        BigDecimal average = calculateAverage(dataPoints);
        summary.setAverage(average);
        //计算中位数
        summary.setMedian(calculateMedian(dataPoints));
        //计算方差
        summary.setVariance(calculateVariance(dataPoints, average));
        //如果是NPS评分，计算NPS值
        if (questionType == QuestionTypeEnum.RADIO_NPS) {
            summary.setNps(calculateNps(dataPoints));
        }
        return summary;
    }

    /**
     * 计算平均值
     */
    private BigDecimal calculateAverage(List<BigDecimal> dataPoints) {
        BigDecimal sum = dataPoints.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(new BigDecimal(dataPoints.size()), DECIMAL_SCALE, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * 计算中位数
     */
    private BigDecimal calculateMedian(List<BigDecimal> dataPoints) {
        List<BigDecimal> sorted = dataPoints.stream()
                .sorted()
                .collect(Collectors.toList());

        int size = sorted.size();
        if (size % MEDIAN_DIVISOR == 0) {
            int midIndex = size / MEDIAN_DIVISOR;
            BigDecimal mid1 = sorted.get(midIndex - 1);
            BigDecimal mid2 = sorted.get(midIndex);
            return mid1.add(mid2).divide(new BigDecimal(MEDIAN_DIVISOR), DECIMAL_SCALE, BigDecimal.ROUND_HALF_UP);
        } else {
            return sorted.get(size / MEDIAN_DIVISOR);
        }
    }

    /**
     * 计算方差
     */
    private static BigDecimal calculateVariance(List<BigDecimal> dataPoints, BigDecimal average) {
        BigDecimal sumOfSquaredDifferences = dataPoints.stream()
                .map(point -> point.subtract(average).pow(2))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return sumOfSquaredDifferences.divide(new BigDecimal(dataPoints.size()), 2, RoundingMode.HALF_UP);
    }

    /**
     * 计算NPS值
     * NPS = (推荐者百分比 - 贬损者百分比)
     * 推荐者：9-10分，中立者：7-8分，贬损者：0-6分
     */
    private static BigDecimal calculateNps(List<BigDecimal> dataPoints) {
        long total = dataPoints.size();
        if (total == 0) {
            return BigDecimal.ZERO;
        }

        long promoters = dataPoints.stream()
                .filter(point -> point.compareTo(new BigDecimal(9)) >= 0)
                .count();

        long detractors = dataPoints.stream()
                .filter(point -> point.compareTo(new BigDecimal(6)) <= 0)
                .count();
        BigDecimal promoterPercentage = new BigDecimal(promoters * 100).divide(new BigDecimal(total), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal detractorPercentage = new BigDecimal(detractors * 100).divide(new BigDecimal(total), 2, BigDecimal.ROUND_HALF_UP);
        return promoterPercentage.subtract(detractorPercentage);
    }
}
