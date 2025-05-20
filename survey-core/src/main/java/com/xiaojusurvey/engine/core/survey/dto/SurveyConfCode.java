package com.xiaojusurvey.engine.core.survey.dto;


import lombok.Data;

import java.util.List;
import java.util.Map;

public class SurveyConfCode {


    @Data
    public static class TitleConfig {
        private String mainTitle;
        private String subTitle;

    }

    @Data
    public static class BannerConfig {
        private String bgImage;
        private String videoLink;
        private String postImg;

    }

    @Data
    public static class BannerConf {
        private TitleConfig titleConfig;
        private BannerConfig bannerConfig;

    }

    @Data
    public static class Nps {
        private String leftText;
        private String rightText;

    }

    @Data
    public static class TextRange {
        private Min min;
        private Max max;

    }

    @Data
    public static class Min {
        private String placeholder;
        private Integer value;

    }

    @Data
    public static class Max {
        private String placeholder;
        private Integer value;

    }

    @Data
    public static class DataItem {
        private Boolean isRequired;
        private Boolean showIndex;
        private Boolean showType;
        private Boolean showSpliter;
        private String type;
        private String valid;
        private String field;
        private String title;
        private String placeholder;
        private Boolean randomSort;
        private Boolean checked;
        private String minNum;
        private String maxNum;
        private Integer star;
        private Nps nps;
        private String placeholderDesc;
        private TextRange textRange;
        private List<Option> options;
        private String importKey;
        private String importData;
        private String cOption;
        private List<String> cOptions;
        private Boolean exclude;
        private Map<String, Object> rangeConfig;
        private String starStyle;
        private String innerType;

    }

    @Data
    public static class Option {
        private String text;
        private Boolean others;
        private Boolean mustOthers;
        private String othersKey;
        private String placeholderDesc;
        private String hash;

    }

    @Data
    public static class DataConf {
        private List<DataItem> dataList;

    }

    @Data
    public static class ConfirmAgain {
        private Boolean isAgain;
        private String againText;

    }

    @Data
    public static class MsgContent {
        private String msg200;
        private String msg9001;
        private String msg9002;
        private String msg9003;
        private String msg9004;

    }

    @Data
    public static class SubmitConf {
        private String submitTitle;
        private ConfirmAgain confirmAgain;
        private MsgContent msgContent;


    }


    @Data
    public static class BaseConf {
        private String beginTime;
        private String endTime;
        private String answerBegTime;
        private String answerEndTime;
        private Integer tLimit;
        private String language;
        private Boolean passwordSwitch;
        private String password;
        private String whitelistType;
        private String memberType;
        private List<String> whitelist;
        private String whitelistTip;

    }

    @Data
    public static class SkinConf {
        private String skinColor;
        private String inputBgColor;
        private BackgroundConf backgroundConf;
        private ContentConf contentConf;
        private ThemeConf themeConf;

    }

    @Data
    public static class BackgroundConf {
        private String color;
        private String type;
        private String image;

    }

    @Data
    public static class ContentConf {
        private int opacity;

    }

    @Data
    public static class ThemeConf {
        private String color;

    }

    @Data
    public static class BottomConf {
        private String logoImage;
        private String logoImageWidth;

    }
}
