package com.xiaojusurvey.engine.extensions.security.scenario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SecurityEntity {
    /**
     * 复杂对象
     */
    SecurityEntity securityEntity;
    /**
     * 普通字段
     */
    private String email;
    /**
     * Collection类型
     */
    private List<String> phoneNumbers;
    /**
     * 数组类型
     */
    private String[] addresses;
    /**
     * Map类型
     */
    private Map<String, String> genderMap;
    /**
     * 复杂对象Collection
     */
    private List<SecurityEntity> securityEntityList;

    /**
     * 复杂对象数组
     */
    private SecurityEntity[] securityEntityArray;

    /**
     * 复杂对象Map
     */
    private Map<String, SecurityEntity> securityEntityMap;
}
