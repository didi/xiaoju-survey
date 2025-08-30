package com.xiaojusurvey.engine.core.survey.impl;

import com.alibaba.fastjson.JSON;
import com.xiaojusurvey.engine.common.entity.survey.SurveyConf;
import com.xiaojusurvey.engine.common.entity.survey.SurveySubmit;
import com.xiaojusurvey.engine.core.survey.DataStatisticService;
import com.xiaojusurvey.engine.core.survey.SurveyConfService;
import com.xiaojusurvey.engine.core.survey.dto.SurveyConfCode;
import com.xiaojusurvey.engine.core.survey.param.DataTableParam;
import com.xiaojusurvey.engine.core.survey.vo.DataTableVO;
import com.xiaojusurvey.engine.repository.MongoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
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
    private SurveyConfService surveyConfService;

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
}
