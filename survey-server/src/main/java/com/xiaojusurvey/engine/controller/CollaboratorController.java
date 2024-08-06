package com.xiaojusurvey.engine.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.xiaojusurvey.engine.common.enums.SurveyPermission;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zhongbo
 */
@RequestMapping("/api/collaborator")
@RestController
@Slf4j
public class CollaboratorController {

    /**
     * 获取权限列表
     */
    @GetMapping("/getPermissionList")
    public RpcResult<JSONArray> getPermissionList() {
        JSONArray jsonArray = new JSONArray();
        JSONObject surveyConfManage = new JSONObject();
        surveyConfManage.put("name", "问卷配置管理");
        surveyConfManage.put("value", SurveyPermission.SURVEY_CONF_MANAGE);

        JSONObject surveyResManage = new JSONObject();
        surveyResManage.put("name", "问卷分析管理");
        surveyResManage.put("value", SurveyPermission.SURVEY_RESPONSE_MANAGE);

        JSONObject surveyCoManage = new JSONObject();
        surveyCoManage.put("name", "协作者管理");
        surveyCoManage.put("value", SurveyPermission.SURVEY_COOPERATION_MANAGE);

        jsonArray.add(surveyConfManage);
        jsonArray.add(surveyResManage);
        jsonArray.add(surveyCoManage);

        return RpcResultUtil.createSuccessResult(jsonArray);
    }
}
