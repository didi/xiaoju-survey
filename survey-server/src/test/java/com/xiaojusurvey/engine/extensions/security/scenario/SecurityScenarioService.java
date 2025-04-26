package com.xiaojusurvey.engine.extensions.security.scenario;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class SecurityScenarioService {

    public SecurityEntity buildSensitiveData() {
        Map<String, String> genderMap = new HashMap<>();
        genderMap.put("test", "Map<String, String>数据测试");
        genderMap.put("季青筠", "女");
        genderMap.put("吉鑫经", "男");
        // 创建复杂对象
        SecurityEntity entity = new SecurityEntity();

        // 设置普通字段
        entity.setEmail("example@example.com");

        // 设置 Collection 类型字段
        List<String> phoneNumbers = new ArrayList<>();
        phoneNumbers.add("123456789");
        phoneNumbers.add("987654321");
        entity.setPhoneNumbers(phoneNumbers);

        // 设置数组类型字段
        String[] addresses = {"Address 1", "Address 2"};
        entity.setAddresses(addresses);

        // 设置 Map 类型字段
        Map<String, String> anotherGenderMap = new HashMap<>();
        genderMap.put("Male", "男");
        genderMap.put("Female", "女");
        entity.setGenderMap(anotherGenderMap);

        // 设置复杂对象字段
        SecurityEntity subEntity = new SecurityEntity();
        subEntity.setEmail("sub@example.com");
        entity.setSecurityEntity(subEntity);

        // 设置复杂对象 Collection 字段
        List<SecurityEntity> securityEntityList = new ArrayList<>();
        SecurityEntity subEntity1 = new SecurityEntity();
        BeanUtils.copyProperties(subEntity, subEntity1);
        securityEntityList.add(subEntity1);
        entity.setSecurityEntityList(securityEntityList);

        // 设置复杂对象数组字段
        SecurityEntity subEntity2 = new SecurityEntity();
        BeanUtils.copyProperties(subEntity, subEntity2);
        SecurityEntity[] securityEntityArray = {subEntity2};
        entity.setSecurityEntityArray(securityEntityArray);

        // 设置复杂对象 Map 字段
        SecurityEntity subEntity3 = new SecurityEntity();
        BeanUtils.copyProperties(subEntity, subEntity3);
        Map<String, SecurityEntity> securityEntityMap = new HashMap<>();
        securityEntityMap.put("sub3", subEntity3);
        entity.setSecurityEntityMap(securityEntityMap);
        return SecurityEntity.builder()
                .email("levitang@126.com")
                .phoneNumbers(Arrays.asList("List<String>数组测试", "13216548465", "18385647264"))
                .addresses(new String[]{"Array<String>数组测试",
                        "黑龙江省哈尔滨市延寿县延寿镇卫东路龙凤小区2号楼1单元302室",
                        "吉林省松原市扶余县蔡家沟镇东胜路34号"})
                .genderMap(genderMap)
                .securityEntity(entity)
                .securityEntityList(new ArrayList<>(securityEntityList))
                .securityEntityArray(new SecurityEntity[]{subEntity})
                .securityEntityMap(new HashMap<>(securityEntityMap))
                .build();
    }


    /**
     * 测试数据分析场景（解密、脱敏）
     *
     * @param encryptData 加密数据
     * @return 脱敏数据
     */
    @DataSecurity(securityScenario = SecurityScenarioEnum.DATA_ANALYSIS)
    public Object dataAnalysis(Object encryptData) {
        log.info("数据分析方法中的参数 原始数据 {}", encryptData);
        return encryptData;
    }

    /**
     * 测试数据入库方法（加密、解密）
     *
     * @param sensitiveData 敏感数据
     * @return
     */
    @DataSecurity(securityScenario = SecurityScenarioEnum.DATA_WAREHOUSING)
    public Object dataWarehousing(Object sensitiveData) {
        log.info("数据入库方法中的参数 敏感数据加密 {}", sensitiveData);
        return sensitiveData;
    }


}

