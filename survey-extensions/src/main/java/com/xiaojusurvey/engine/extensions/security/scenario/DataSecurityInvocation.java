package com.xiaojusurvey.engine.extensions.security.scenario;

import com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain = true)
public class DataSecurityInvocation {

    /**
     * 方法名
     */
    private String methodName;

    /**
     * 参数类型
     */
    private Class<?>[] parameterTypes;

    /**
     * 参数
     */
    private Object[] arguments;

    /**
     * 数据安全注解
     */
    private DataSecurity dataSecurity;
}
