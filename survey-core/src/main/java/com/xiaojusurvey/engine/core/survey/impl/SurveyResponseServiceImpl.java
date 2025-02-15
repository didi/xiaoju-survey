package com.xiaojusurvey.engine.core.survey.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.survey.ClientEncrypt;
import com.xiaojusurvey.engine.common.entity.survey.Counter;
import com.xiaojusurvey.engine.common.entity.survey.SurveyPublish;
import com.xiaojusurvey.engine.common.entity.survey.SurveySubmit;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.entity.workspace.WorkspaceMember;
import com.xiaojusurvey.engine.common.enums.EncryptType;
import com.xiaojusurvey.engine.common.enums.OptionQuestionTypeEnum;
import com.xiaojusurvey.engine.common.enums.WhitelistTypeEnum;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.survey.ClientEncryptService;
import com.xiaojusurvey.engine.core.survey.CounterService;
import com.xiaojusurvey.engine.core.survey.SurveyResponseService;
import com.xiaojusurvey.engine.core.survey.dto.SurveyConfCode;
import com.xiaojusurvey.engine.core.survey.param.ResponseParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;
import com.xiaojusurvey.engine.core.user.UserService;
import com.xiaojusurvey.engine.core.workspace.WorkspaceMemberService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author: zsh
 * @CreateTime: 2025/1/21
 * @Description: 问卷提交服务
 */
@Service
public class SurveyResponseServiceImpl implements SurveyResponseService {

    @Resource
    private MongoRepository mongoRepository;

    @Resource
    private UserService userService;

    @Resource
    private WorkspaceMemberService workspaceMemberService;

    @Resource
    private ClientEncryptService clientEncryptService;

    @Resource
    private CounterService counterService;

    @Override
    public SurveyResponseSchemaOutVO getResponseSchema(String surveyPath) {
        Query query = new Query(Criteria.where("surveyPath").is(surveyPath));
        SurveyPublish surveyPublish = mongoRepository.findOne(query, SurveyPublish.class);
        SurveyResponseSchemaOutVO responseSchema = new SurveyResponseSchemaOutVO();
        responseSchema.setPageId(surveyPublish.getPageId());
        responseSchema.setCode(surveyPublish.getCode());
        responseSchema.setSurveyPath(surveyPath);
        responseSchema.setTitle(surveyPublish.getTitle());
        responseSchema.setCurStatus(surveyPublish.getCurStatus());
        return responseSchema;
    }

    @Override
    public RpcResult<?> createResponse(ResponseParam responseParam) {
        checkSign(responseParam);
        SurveyResponseSchemaOutVO responseSchema = getResponseSchema(responseParam.getSurveyPath());
        if (responseSchema == null) {
            throw new ServiceException(RespErrorCode.SURVEY_NOT_FOUND.getMessage(), RespErrorCode.SURVEY_NOT_FOUND.getCode());
        }

        Object o = responseSchema.getCode().get("baseConf");
        if (o == null) {
            throw new ServiceException(RespErrorCode.WHITELIST_ERROR.getMessage(), RespErrorCode.WHITELIST_ERROR.getCode());
        }
        String jsonString = JSON.toJSONString(o);
        SurveyConfCode.BaseConf baseConf = JSON.parseObject(jsonString, SurveyConfCode.BaseConf.class);

        checkWhiteList(responseParam.getWhitelist(), baseConf, responseParam.getPassword());

        checkTimeAndLimit(responseParam.getSurveyPath(), baseConf);

        Map<String, Object> decryptedData;
        if (responseParam.getEncryptType().equals(EncryptType.RSA.getType())) {
            decryptedData = decrypte(responseParam.getSessionId(), responseParam.getData());
        } else {
            throw new ServiceException(RespErrorCode.RESPONSE_DATA_DECRYPT_ERROR.getMessage(), RespErrorCode.RESPONSE_DATA_DECRYPT_ERROR.getCode());
        }
        o = responseSchema.getCode().get("dataConf");

        jsonString = JSON.toJSONString(o);

        SurveyConfCode.DataConf dataConf = JSON.parseObject(jsonString, SurveyConfCode.DataConf.class);
        List<SurveyConfCode.DataItem> dataList = dataConf.getDataList();
        Map<String, List<String[]>> optionTextAndId = dataList.stream().filter(item -> OptionQuestionTypeEnum.BINARY_CHOICE.getType().equals(item.getType()) || OptionQuestionTypeEnum.RADIO.getType().equals(item.getType()) || OptionQuestionTypeEnum.CHECKBOX.getType().equals(item.getType()) || OptionQuestionTypeEnum.VOTE.getType().equals(item.getType()) && !item.getOptions().isEmpty() && decryptedData.get(item.getField()) != null
        ).collect(Collectors.toMap(SurveyConfCode.DataItem::getField,
                item -> item.getOptions().stream()
                        .map(optionItem -> new String[]{optionItem.getHash(), optionItem.getText()})
                        .collect(Collectors.toList())));

        updateCounter(decryptedData, responseParam.getSurveyPath(), optionTextAndId);

        SurveySubmit surveySubmit = new SurveySubmit(responseSchema.getPageId(),
                responseParam.getSurveyPath(), responseParam.getDiffTime(), responseParam.getClientTime(), decryptedData, optionTextAndId, new ArrayList<>());
        mongoRepository.save(surveySubmit);
        return RpcResultUtil.createSuccessResult(true, "提交成功");
    }

    private void checkWhiteList(String whiteList, SurveyConfCode.BaseConf baseConf, String password) {
        if (baseConf.getPassword() != null) {
            if (password != null && !baseConf.getPassword().equals(password)) {
                throw new ServiceException(RespErrorCode.WHITELIST_ERROR.getMessage(), RespErrorCode.WHITELIST_ERROR.getCode());
            }
        }
        if (baseConf.getWhitelistType().equals(WhitelistTypeEnum.CUSTOM.getType())) {
            if (whiteList != null && !baseConf.getWhitelist().contains(whiteList)) {
                throw new ServiceException(RespErrorCode.WHITELIST_ERROR.getMessage(), RespErrorCode.WHITELIST_ERROR.getCode());
            }
        }

        if (baseConf.getWhitelistType().equals(WhitelistTypeEnum.MEMBER.getType())) {
            User user = userService.getUserByUsername(whiteList);
            if (user == null) {
                throw new ServiceException(RespErrorCode.WHITELIST_ERROR.getMessage(), RespErrorCode.WHITELIST_ERROR.getCode());
            }
            List<WorkspaceMember> workspaceMembers = workspaceMemberService.getWorkspaceMembers(user.getId(), 0, 1);
            if (workspaceMembers.isEmpty()) {
                throw new ServiceException(RespErrorCode.WHITELIST_ERROR.getMessage(), RespErrorCode.WHITELIST_ERROR.getCode());
            }

        }
    }

    private void checkTimeAndLimit(String surveyPath, SurveyConfCode.BaseConf baseConf) {
        String beginTime = baseConf.getBeginTime();
        String endTime = baseConf.getEndTime();
        LocalDateTime now = LocalDateTime.now();
        if (beginTime != null && endTime != null) {
//            Date begin = DateUtils.parseDate(beginTime, "yyyy-MM-dd HH:mm:ss");
//            Date end = DateUtils.parseDate(endTime, "yyyy-MM-dd HH:mm:ss");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime begin = LocalDateTime.parse(beginTime, formatter);
            LocalDateTime end = LocalDateTime.parse(endTime, formatter);
            if (now.isBefore(begin) || now.isAfter(end)) {
                throw new ServiceException(RespErrorCode.RESPONSE_CURRENT_TIME_NOT_ALLOW.getMessage(), RespErrorCode.RESPONSE_CURRENT_TIME_NOT_ALLOW.getCode());
            }
        }
        String answerBegTime = baseConf.getAnswerBegTime();
        String answerEndTime = baseConf.getAnswerEndTime();
        if (answerBegTime != null && answerEndTime != null) {
//            Date begin = DateUtils.parseDate(answerBegTime, "HH:mm:ss");
//            Date end = DateUtils.parseDate(answerEndTime, "HH:mm:ss");
            LocalDate currentDate = LocalDate.now();
            LocalTime begTimes = LocalTime.parse(answerBegTime, DateTimeFormatter.ofPattern("HH:mm:ss"));
            LocalTime endTimes = LocalTime.parse(answerEndTime, DateTimeFormatter.ofPattern("HH:mm:ss"));
            LocalDateTime begin = LocalDateTime.of(currentDate, begTimes);
            LocalDateTime end = LocalDateTime.of(currentDate, endTimes);

            if (now.isBefore(begin) || now.isAfter(end)) {
                throw new ServiceException(RespErrorCode.RESPONSE_CURRENT_TIME_NOT_ALLOW.getMessage(), RespErrorCode.RESPONSE_CURRENT_TIME_NOT_ALLOW.getCode());
            }
        }
        Integer tLimit = baseConf.getTLimit();
        if (tLimit != null && tLimit > 0) {
            Integer nowSubmitCount = getSurveyResponseTotalByPath(surveyPath);
            if (nowSubmitCount >= tLimit) {
                throw new ServiceException(RespErrorCode.RESPONSE_OVER_LIMIT.getMessage(), RespErrorCode.RESPONSE_OVER_LIMIT.getCode());
            }
        }
    }

    private void updateCounter(Map<String, Object> decryptedData, String surveyPath, Map<String, List<String[]>> optionTextAndId) {
        Set<String> fields = decryptedData.keySet();
        List<Counter> successParams = new ArrayList<>();
        try {
            for (String field : fields) {
                Object value = decryptedData.get(field);
                if ((value instanceof JSONArray)) {
                    List<String> temp = new ArrayList<>();
                    for (int i = 0; i < ((JSONArray) value).size(); i++) {
                        temp.add(((JSONArray) value).getString(i));
                    }
                    value = temp;
                } else {
                    List<String> temp = new ArrayList<>();
                    if (!(value instanceof String)) {
                        value = String.valueOf(value);
                    }
                    temp.add((String) value);
                    value = temp;
                }
                List<String> values = (List) value;
                if (optionTextAndId.containsKey(field)) {
                    Counter counter = counterService.queryCounter(field, surveyPath, "option");
                    Map<String, Long> data = counter.getData();
                    if (data == null) {
                        data = new HashMap<>(16);
                    }
                    for (String item : values) {
                        if (!data.containsKey(item)) {
                            data.put(item, 0L);
                        } else {
                            data.put(item, data.get(item) + 1L);
                        }
                    }
                    data.put("total", data.get("total") + 1L);
                    successParams.add(new Counter(field, surveyPath, "option", data));
                }
            }
            for (Counter counter : successParams) {
                counterService.saveCounter(counter);
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private Integer getSurveyResponseTotalByPath(String surveyPath) {
        List<SurveySubmit> surveySubmits = mongoRepository.findList(new Query(Criteria.where("surveyPath").is(surveyPath)), SurveySubmit.class);
        return surveySubmits == null ? 0 : surveySubmits.size();
    }

    private Map decrypte(String sessionId, List<String> responseData) {
        ClientEncrypt clientEncrypt = clientEncryptService.getEncryptInfoById(sessionId);
        if (clientEncrypt == null) {
            throw new ServiceException(RespErrorCode.RESPONSE_DATA_DECRYPT_ERROR.getMessage(), RespErrorCode.RESPONSE_DATA_DECRYPT_ERROR.getCode());
        }
        // 解析私钥
        String privateKeyPem = clientEncrypt.getData().getPrivateKey();
        try {
            PemReader pemReader = new PemReader(new StringReader(privateKeyPem));
            PemObject pemObject = pemReader.readPemObject();
            pemReader.close();

            // 将 PKCS#1 格式的私钥转换为 PKCS#8 格式
            org.bouncycastle.asn1.pkcs.RSAPrivateKey rsaPrivateKey = RSAPrivateKey.getInstance(pemObject.getContent());
            AlgorithmIdentifier algorithmIdentifier = new AlgorithmIdentifier(org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers.rsaEncryption, null);
            PrivateKeyInfo privateKeyInfo = new PrivateKeyInfo(algorithmIdentifier, rsaPrivateKey);

            // 获取 PKCS#8 格式的私钥字节数组
            byte[] privateKeyBytes = privateKeyInfo.getEncoded();

            // 生成 PrivateKey 对象
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(keySpec);

            // 解密并拼接数据
            StringBuilder concatStr = new StringBuilder();
            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWITHSHA-1ANDMGF1PADDING");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            for (String data : responseData) {
                byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(data));
                concatStr.append(new String(decryptedBytes, StandardCharsets.UTF_8));
            }
            String decodedStr = URLDecoder.decode(concatStr.toString(), StandardCharsets.UTF_8.name());
            return JSON.parseObject(decodedStr, Map.class);

        } catch (RuntimeException | InvalidKeyException | NoSuchPaddingException | NoSuchAlgorithmException | InvalidKeySpecException | IllegalBlockSizeException | BadPaddingException | UnsupportedEncodingException e) {
            throw new ServiceException(RespErrorCode.RESPONSE_DATA_DECRYPT_ERROR.getMessage(), RespErrorCode.RESPONSE_DATA_DECRYPT_ERROR.getCode());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    private void checkSign(ResponseParam responseParam) {

        String sign = responseParam.getSign();
        if (sign == null) {
            throw new ServiceException(RespErrorCode.RESPONSE_SIGN_ERROR.getMessage(), RespErrorCode.RESPONSE_SIGN_ERROR.getCode());
        }
        String[] parts = sign.split("\\.");
//        if (parts.length != 2) {
//            throw new ServiceException(RespErrorCode.RESPONSE_SIGN_ERROR.getMessage(), RespErrorCode.RESPONSE_SIGN_ERROR.getCode());
//        }
        sign = parts[0];
        String timeStamp = parts[1];
        TreeMap<String, Object> sourceData = new TreeMap<>();
        Class<?> clazz = responseParam.getClass();
        for (Field field : clazz.getDeclaredFields()) {
            try {
                field.setAccessible(true);
                String key = field.getName();
                Object value = field.get(responseParam);
                if (!key.equals("sign") && value != null && !Modifier.isStatic(field.getModifiers())) {
                    sourceData.put(key, value);
                }
            } catch (IllegalAccessException e) {
                throw new ServiceException(RespErrorCode.RESPONSE_SIGN_ERROR.getMessage(), RespErrorCode.RESPONSE_SIGN_ERROR.getCode());
            }
        }

        String realSign = getSignByData(sourceData, timeStamp);
        if (!realSign.equals(sign)) {
            throw new ServiceException(RespErrorCode.RESPONSE_SIGN_ERROR.getMessage(), RespErrorCode.RESPONSE_SIGN_ERROR.getCode());
        }


    }

    public String getSignByData(Map<String, Object> sourceData, String timeStamp) {
        StringBuilder signArr = new StringBuilder();
        for (Map.Entry<String, Object> entry : sourceData.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof String) {
                try {
                    signArr.append(key).append("=").append(URLEncoder.encode((String) value, String.valueOf(StandardCharsets.UTF_8)));
                } catch (UnsupportedEncodingException e) {
                    throw new ServiceException(RespErrorCode.RESPONSE_SIGN_ERROR.getMessage(), RespErrorCode.RESPONSE_SIGN_ERROR.getCode());
                }
            } else {
                signArr.append(key).append("=").append(JSON.toJSONString(value));
            }
        }
        signArr.append(timeStamp);
        return hash256(signArr.toString());
    }

    private String hash256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new ServiceException(RespErrorCode.RESPONSE_SIGN_ERROR.getMessage(), RespErrorCode.RESPONSE_SIGN_ERROR.getCode());
        }
    }
}
