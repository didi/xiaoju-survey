package com.xiaojusurvey.engine.core.survey.impl;


import com.alibaba.fastjson.JSON;
import com.mongodb.client.MongoClients;
import com.xiaojusurvey.engine.common.entity.survey.ClientEncrypt;
import com.xiaojusurvey.engine.common.entity.survey.Counter;
import com.xiaojusurvey.engine.common.entity.survey.SurveyPublish;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.survey.ClientEncryptService;
import com.xiaojusurvey.engine.core.survey.CounterService;
import com.xiaojusurvey.engine.core.survey.param.ResponseParam;
import com.xiaojusurvey.engine.core.survey.vo.SurveyResponseSchemaOutVO;
import com.xiaojusurvey.engine.repository.impl.MongoRepositoryImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;

/**
 * @Author: zsh
 * @Date: 2025/1/31 21:21
 * @Description: 问卷c端接口测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class SurveyResponseServiceImplTest {

    @InjectMocks
    private SurveyResponseServiceImpl surveyResponseServiceImpl;

    @Mock
    MongoRepositoryImpl mongoRepository;

    @Mock
    private ClientEncryptService clientEncryptService;

    private MongoTemplate mongoTemplate;

    @Mock
    private CounterService counterService;

    SurveyResponseSchemaOutVO responseSchema;

    SurveyPublish surveyPublish;

    ClientEncrypt clientEncrypt;

    Counter counter;
    @Before
    public void before(){
        String json = "{" +
                "        \"_id\": \"679d0fc754f8f0a3227ba92e\"," +
                "        \"createdAt\": \"2025-01-31T18:00:39.103Z\"," +
                "        \"updatedAt\": \"2025-01-31T18:00:39.103Z\"," +
                "        \"title\": \"问卷调研\"," +
                "        \"surveyPath\": \"bxKSESWv\"," +
                "        \"code\": {" +
                "            \"bannerConf\": {" +
                "                \"titleConfig\": {" +
                "                    \"mainTitle\": \"<h3 style=\\\"text-align: center\\\">欢迎填写问卷</h3><p>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，<span style=\\\"color: rgb(204, 0, 0)\\\">期待您的参与！</span></p>\"," +
                "                    \"subTitle\": \"<p>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，<span style=\\\"color: rgb(204, 0, 0)\\\">期待您的参与！</span></p>\"" +
                "                }," +
                "                \"bannerConfig\": {" +
                "                    \"bgImage\": \"/imgs/skin/17e06b7604a007e1d3e1453b9ddadc3c.webp\"," +
                "                    \"bgImageAllowJump\": false," +
                "                    \"bgImageJumpLink\": \"\"," +
                "                    \"videoLink\": \"\"," +
                "                    \"postImg\": \"\"" +
                "                }" +
                "            }," +
                "            \"baseConf\": {" +
                "                \"beginTime\": \"2025-02-01 02:00:12\"," +
                "                \"endTime\": \"2035-02-01 02:00:12\"," +
                "                \"tLimit\": 0," +
                "                \"language\": \"chinese\"," +
                "                \"answerBegTime\": \"00:00:00\"," +
                "                \"answerEndTime\": \"23:59:59\"," +
                "                \"passwordSwitch\": false," +
                "                \"password\": null," +
                "                \"whitelistType\": \"ALL\"," +
                "                \"whitelist\": []," +
                "                \"memberType\": \"MOBILE\"," +
                "                \"fillAnswer\": false," +
                "                \"fillSubmitAnswer\": false" +
                "            }," +
                "            \"bottomConf\": {" +
                "                \"logoImage\": \"/imgs/Logo.webp\"," +
                "                \"logoImageWidth\": \"60%\"" +
                "            }," +
                "            \"skinConf\": {" +
                "                \"skinColor\": \"#4a4c5b\"," +
                "                \"inputBgColor\": \"#ffffff\"," +
                "                \"backgroundConf\": {" +
                "                    \"color\": \"#b8dbff\"," +
                "                    \"type\": \"color\"," +
                "                    \"image\": \"\"" +
                "                }," +
                "                \"themeConf\": {" +
                "                    \"color\": \"#ffa600\"" +
                "                }," +
                "                \"contentConf\": {" +
                "                    \"opacity\": 100" +
                "                }" +
                "            }," +
                "            \"submitConf\": {" +
                "                \"submitTitle\": \"提交\"," +
                "                \"confirmAgain\": {" +
                "                    \"is_again\": true," +
                "                    \"again_text\": \"确认要提交吗？\"" +
                "                }," +
                "                \"msgContent\": {" +
                "                    \"msg_200\": \"提交成功\"," +
                "                    \"msg_9001\": \"您来晚了，感谢支持问卷~ \"," +
                "                    \"msg_9002\": \"请勿多次提交！\"," +
                "                    \"msg_9003\": \"您来晚了，已经满额！\"," +
                "                    \"msg_9004\": \"提交失败！\"" +
                "                }," +
                "                \"link\": \"\"" +
                "            }," +
                "            \"pageConf\": [" +
                "                6" +
                "            ]," +
                "            \"logicConf\": {" +
                "                \"showLogicConf\": []," +
                "                \"jumpLogicConf\": []" +
                "            }," +
                "            \"dataConf\": {" +
                "                \"dataList\": [" +
                "                    {" +
                "                        \"isRequired\": true," +
                "                        \"showIndex\": true," +
                "                        \"showType\": true," +
                "                        \"showSpliter\": true," +
                "                        \"type\": \"text\"," +
                "                        \"valid\": \"\"," +
                "                        \"field\": \"data458\"," +
                "                        \"title\": \"标题1\"," +
                "                        \"placeholder\": \"\"," +
                "                        \"numberRange\": {" +
                "                            \"max\": {" +
                "                                \"placeholder\": \"1000\"," +
                "                                \"value\": 1000" +
                "                            }," +
                "                            \"min\": {" +
                "                                \"placeholder\": \"0\"," +
                "                                \"value\": 0" +
                "                            }" +
                "                        }," +
                "                        \"textRange\": {" +
                "                            \"min\": {" +
                "                                \"placeholder\": \"0\"," +
                "                                \"value\": 0" +
                "                            }," +
                "                            \"max\": {" +
                "                                \"placeholder\": \"500\"," +
                "                                \"value\": 500" +
                "                            }" +
                "                        }" +
                "                    }," +
                "                    {" +
                "                        \"isRequired\": true," +
                "                        \"showIndex\": true," +
                "                        \"showType\": true," +
                "                        \"showSpliter\": true," +
                "                        \"type\": \"radio\"," +
                "                        \"field\": \"data515\"," +
                "                        \"title\": \"标题2\"," +
                "                        \"options\": [" +
                "                            {" +
                "                                \"text\": \"选项1\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"115019\"" +
                "                            }," +
                "                            {" +
                "                                \"text\": \"选项2\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"115020\"" +
                "                            }" +
                "                        ]" +
                "                    }," +
                "                    {" +
                "                        \"field\": \"data516\"," +
                "                        \"title\": \"标题6\"," +
                "                        \"type\": \"binary - choice\"," +
                "                        \"isRequired\": true," +
                "                        \"showIndex\": true," +
                "                        \"showType\": true," +
                "                        \"showSpliter\": true," +
                "                        \"options\": [" +
                "                            {" +
                "                                \"text\": \"对\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"990274\"" +
                "                            }," +
                "                            {" +
                "                                \"text\": \"错\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"343045\"" +
                "                            }" +
                "                        ]," +
                "                        \"layout\": \"vertical\"" +
                "                    }," +
                "                    {" +
                "                        \"field\": \"data448\"," +
                "                        \"title\": \"标题7\"," +
                "                        \"type\": \"checkbox\"," +
                "                        \"isRequired\": true," +
                "                        \"showIndex\": true," +
                "                        \"showType\": true," +
                "                        \"showSpliter\": true," +
                "                        \"options\": [" +
                "                            {" +
                "                                \"text\": \"选项1\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"670203\"" +
                "                            }," +
                "                            {" +
                "                                \"text\": \"选项2\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"899092\"" +
                "                            }" +
                "                        ]," +
                "                        \"minNum\": 0," +
                "                        \"maxNum\": 0," +
                "                        \"layout\": \"vertical\"" +
                "                    }," +
                "                    {" +
                "                        \"field\": \"data30\"," +
                "                        \"title\": \"标题8\"," +
                "                        \"type\": \"vote\"," +
                "                        \"isRequired\": true," +
                "                        \"showIndex\": true," +
                "                        \"showType\": true," +
                "                        \"showSpliter\": true," +
                "                        \"options\": [" +
                "                            {" +
                "                                \"text\": \"选项1\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"007193\"" +
                "                            }," +
                "                            {" +
                "                                \"text\": \"选项2\"," +
                "                                \"others\": false," +
                "                                \"mustOthers\": false," +
                "                                \"othersKey\": \"\"," +
                "                                \"placeholderDesc\": \"\"," +
                "                                \"hash\": \"044244\"" +
                "                            }" +
                "                        ]," +
                "                        \"minNum\": 0," +
                "                        \"maxNum\": 0," +
                "                        \"innerType\": \"radio\"" +
                "                    }," +
                "                    {" +
                "                        \"field\": \"data987\"," +
                "                        \"title\": \"标题9\"," +
                "                        \"type\": \"radio - nps\"," +
                "                        \"isRequired\": true," +
                "                        \"showIndex\": true," +
                "                        \"showType\": true," +
                "                        \"showSpliter\": true," +
                "                        \"min\": 1," +
                "                        \"max\": 10," +
                "                        \"minMsg\": \"极不满意\"," +
                "                        \"maxMsg\": \"十分满意\"," +
                "                        \"rangeConfig\": {}" +
                "                    }" +
                "                ]" +
                "            }" +
                "        }," +
                "        \"pageId\": \"679d0fac54f8f0a3227ba925\"," +
                "        \"curStatus\": {" +
                "            \"status\": \"published\"," +
                "            \"date\": 1738346439102" +
                "        }," +
                "        \"subStatus\": {" +
                "            \"status\": \"\"," +
                "            \"date\": 1738346439102" +
                "        }" +
                "    }";
        responseSchema = JSON.parseObject(json, SurveyResponseSchemaOutVO.class);
        surveyPublish = new SurveyPublish();
        surveyPublish.setSurveyPath(responseSchema.getSurveyPath());
        surveyPublish.setPageId(responseSchema.getPageId());
        surveyPublish.setTitle(responseSchema.getTitle());
        surveyPublish.setCode(responseSchema.getCode());

        clientEncrypt=new ClientEncrypt();
        ClientEncrypt.ClientEncryptData data=new ClientEncrypt.ClientEncryptData();
        data.setPrivateKey(     "-----BEGIN RSA PRIVATE KEY-----\r\n" +
                "MIIEowIBAAKCAQEArBax7JqIk/j4QKGvFXzdOwWb57ajf/NQ4Pt/GWAPDx+RTie7\r\n" +
                "CZOK8siLdKCqEiJKgJcC7rmno6jiRc4KJtypMij50zgG3m68B6M90wBGj7p4jfiQ\r\n" +
                "yAHkPkuUM90FBif2DgIbh6PQsLI6U+o0xx6ri9yv53JSw2RXnPykqjwdfOxSR22o\r\n" +
                "RhDQhzHPKSiUr8vL1LJ1I+hu1Q5VPtdohnQubbBT8ygHx5AFOSWtfKM4WSJV3yhg\r\n" +
                "wD+25rEIONBLTsB9Kcgbk1G/qS4fCyrO/nhpg2gXPot0xDpmGsNcdu39j1EKP3i2\r\n" +
                "3ins1m/E9ByM60fjRmB1LoPEi2LMVwK/c0WI/wIDAQABAoIBAAYGRrT9dU9A2xK1\r\n" +
                "gQH5PMF74R5hOCNwQDeay7NMDUWT7wFTxhTVaSWLZx5udXsXCjwAOBEQHNH6RURO\r\n" +
                "V0VPBPla5+Frcl9ydFC2zUudadr5mzjVJ98TTzXtwsLMt7KkeX+6C9QEJHfbICGf\r\n" +
                "RGO9gMyaWD97ssa2X5QrtWlkRgqr0yNphqrqpp7PafeaDIX+Y7XyyMkVxYUBVUOL\r\n" +
                "3Hbxcy6sXCISCeN+uioVEhgxO+Jrjwl3Q+lFjjaA2uZQ+pYz3eolrEwVv5Qyp88i\r\n" +
                "rKOzk/IceqKJjVI1P/nmIfVUXMQjD+np1bMeL6TKR3SL+Z38xJhx+W2Vc1nTY3UD\r\n" +
                "+hsYOUkCgYEA77wmKUuiyP01r6WLDa4FDr8DhfS+ZPJLD5PC3MHswcctW1rxjoyh\r\n" +
                "3kFoEunI8VGu7WDYfp9FPPqhnyIeaJybfYdXknJq+PPPpoI3kiu6FLoKx27+Jo44\r\n" +
                "sJGQJGkdjfYNbhhN4PEsLxDwLdnV+zCp8vWSVKGA7QRJdhuF4wgLlUUCgYEAt8Og\r\n" +
                "hv/vn+eiGn3GM+Ap2p2RnmDURz36BwxwE7Fr2a/S4igE79qRlFYvUg4S6fkxkAbj\r\n" +
                "delSm2OqYuU92prPoJrJYKb6On8dh+tFm7KyK9WgxWnYYH/iAARfFeV2C8qG4viq\r\n" +
                "tiGFQyYF538O33d6R6iN8i7jkd8W9k2ze+6Xv3MCgYBZNibtTxwwtyl3R59LY+q1\r\n" +
                "5hcljkIbxp5wGYh2JiQ4qCoUyO8DIQpLbwOPpjgEtWTnKRbnZ9WYL5xdX5D5VO33\r\n" +
                "9Jl+Ad4U7oXjbKnJV0RT2jeQp5kkN+CYtFJzejppTZsJ0TmJ77WFfkQii+G5LA7S\r\n" +
                "PthJbiBQEzxTG0LjjWbiEQKBgHAtvOYMgPRli6COXRs34XTyMX20cIHZBLOe1SBA\r\n" +
                "c60c1yh186WUEMCz6Ak4TDWGiMn6WoqVV3dCXTYn6R102gCZ3Qrig+iHxrg9WG3W\r\n" +
                "pUt7CrzYg11NU+JcyMruG6TRCoyt7lBmoBpAsOQDvUmPfxcVfylzlDptLHBJOKMU\r\n" +
                "IJCfAoGBANwAHaW0pr6qGPuafDDiJcK8MMRwiK6Ok4to+CS8lvPUpnZYlMnnjc/w\r\n" +
                "vP42q8hogbqCQME6RKCEMgRt/bqOw6ROpgqA7fHXYo4m4YFS8w4dT4YSKXbIIcBk\r\n" +
                "+40mITWc4AU1tudKJzPP+nz7l+xgjfeuzo49P5Upq0wyKPwRS2Fq\r\n" +
                "-----END RSA PRIVATE KEY-----\r\n"
        );
        clientEncrypt.setData(data);

        counter=new Counter();
        counter.setSurveyPath(responseSchema.getSurveyPath());
        Map<String ,Long> counterData=new HashMap<>();
        counterData.put("115019",1L);
        counterData.put("total",0L);
        counter.setData(counterData);

        mongoTemplate=new MongoTemplate(MongoClients.create("mongodb://124.223.31.160:27017"),"survey");
    }

    @Test
    public void testCreateResponse() {
        ResponseParam responseParam=new ResponseParam();
        responseParam.setSurveyPath("bxKSESWv");
        List data=new ArrayList();
        data.add("fcjZX307J2AwkH1Wob0EomPg9krdOSe+Md1Sxh4Z/Ef5XBlGFRCd9WsaBRQUMJPzJugVAoPERR7FCqecJU/pX/o0RB84lvHAk8X+KLC0+vM+iyup0KV/M82UU9m40KgU3ylL37WhkkIbZN/u0n8rhkesxfO3swHPPR7kn3eUaYCvCNu1TJ7cNTGH7TbgxEAV6vnseQfj61F/Ghfefp9Xl/TGaYbjYBfSXNgotnoXhi+p7U06BcUWKNpzx4c/FOcaBJstMyccRRYTA+a8d1D0vRWjd0PwwQ1ZBrc2tvpz8WW+wNQ5yqtyVU4MF7DgMm+xK2b792C4vR3eJ4MQwnB1xA==");
        responseParam.setData(data);
        responseParam.setSign("9293580841806fa3fd281906e4aea8a33ee18981af7fadb8210bab6a174b6f4f.1738346927983");
        responseParam.setClientTime(1738346927974L);
        responseParam.setDiffTime(9851L);
        responseParam.setEncryptType("rsa");
        responseParam.setSessionId("679d11a654f8f0a3227ba933");
        when(mongoRepository.findOne(new Query(Criteria.where("surveyPath").is("bxKSESWv")), SurveyPublish.class)).thenReturn(surveyPublish);
        when(clientEncryptService.getEncryptInfoById(responseParam.getSessionId())).thenReturn(clientEncrypt);
        when(counterService.queryCounter(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(counter);

        RpcResult<?> response = surveyResponseServiceImpl.createResponse(responseParam);


        Assert.assertEquals(true, response.getData());
    }
}
