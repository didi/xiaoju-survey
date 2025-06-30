package com.xiaojusurvey.engine.core.survey.param;


import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

/**
 * 问卷提交参数
 *
 * @author zsh
 * @Date 2025/01/21
 */
@Data
public class ResponseParam implements Serializable {

    private static final long serialVersionUID = -3964820687444326423L;

    //	问卷短ID
    @NotBlank(message = "问卷短id不能为空")
    @NotNull(message = "问卷短id不能为空")
    private String surveyPath;

    //活动数据
    private List<String> data;

    //加密方式
    private String encryptType;

    private String whitelist;

    private String password;

    private Long clientTime;

    private String sign;
    //会话ID
    private String sessionId;

    private Long diffTime;
}
