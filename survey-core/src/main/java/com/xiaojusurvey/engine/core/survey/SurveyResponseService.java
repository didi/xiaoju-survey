package com.xiaojusurvey.engine.core.survey;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.survey.param.ResponseParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;

import java.util.Map;

/**
 * 问卷提交服务
 *
 * @author zsh
 * @date: 2025/1/21
 */
public interface SurveyResponseService {


    SurveyResponseSchemaOutVO getResponseSchema(String surveyPath);

    RpcResult<?> createResponse(ResponseParam responseParam);

    String getSignByData(Map<String, Object> sourceData, String timeStamp);
}
