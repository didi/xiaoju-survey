package com.xiaojusurvey.engine.controller;


import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.survey.SurveyResponseService;
import com.xiaojusurvey.engine.core.survey.param.ResponseParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RequestMapping("/api")
@RestController
public class SurveyResponseController {

    @Resource
    private SurveyResponseService surveyResponseService;

    /**
     * 获取已发布问卷的schema
     *
     * @param surveyPath
     * @return
     */
    @GetMapping("/responseSchema/getSchema")
    public RpcResult<SurveyResponseSchemaOutVO> getSchema(@RequestParam("surveyPath") String surveyPath) {
        return RpcResultUtil.createSuccessResult(surveyResponseService.getResponseSchema(surveyPath));
    }


    @PostMapping("/surveyResponse/createResponse")
    public RpcResult<?> createResponse(@RequestBody ResponseParam responseParam) {

        return surveyResponseService.createResponse(responseParam);
    }
}
