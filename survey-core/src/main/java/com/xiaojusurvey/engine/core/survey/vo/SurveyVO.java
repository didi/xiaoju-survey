//package com.xiaojusurvey.engine.core.survey.vo;
//
//import com.xiaojusurvey.engine.common.entity.Status;
//
//import javax.validation.constraints.NotBlank;
//import javax.validation.constraints.NotNull;
//
///**
// * 问卷信息
// *
// * @author likui63@163.com
// * @Date 2024/7/28 21:57
// */
//public class SurveyVO {
//
//    private String _id;
//
//    private String name;
//    /**
//     * 问卷类型
//     */
//    @NotBlank(message = "问卷类型不能为空")
//    @NotNull(message = "问卷类型不能为空")
//    private String surveyType;
//
//    /**
//     * 问卷短链
//     */
//    private String surveyPath;
//    /**
//     * 问卷标题
//     */
//    private String title;
//    /**
//     * 当前状态
//     */
//    private Status curStatus;
//
//    /**
//     * 创建时间
//     */
//    private Long createDate;
//
//    /**
//     * 创建人
//     */
//    private String creator;
//    /**
//     * 所有者
//     */
//    private String owner;
//
//}
