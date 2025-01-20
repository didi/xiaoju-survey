package com.xiaojusurvey.engine.controller;


import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.survey.SurveyResponseService;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RequestMapping("/api")
@RestController
public class SurveyResponseController {

    @Resource
    private SurveyResponseService surveyResponseService;

    /**
     * 获取已发布问卷的schema
     * @param surveyPath
     * @return
     */
    @GetMapping("/responseSchema/getSchema")
    public RpcResult<SurveyResponseSchemaOutVO> getSchema(@RequestParam("surveyPath") String surveyPath) {
        return RpcResultUtil.createSuccessResult(surveyResponseService.getResponseSchema(surveyPath));
    }

}
