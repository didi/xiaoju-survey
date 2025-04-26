package com.xiaojusurvey.engine.extensions.security.scenario.aop;

import com.xiaojusurvey.engine.common.enums.SecurityScenarioEnum;
import com.xiaojusurvey.engine.extensions.security.scenario.DataSecurityInvocation;
import com.xiaojusurvey.engine.extensions.security.scenario.DataWrapper;
import com.xiaojusurvey.engine.extensions.security.scenario.SecurityScenario;
import com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.lang.reflect.Method;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Aspect
@Component
@Slf4j
public class SecurityScenarioAspect implements InitializingBean {

    private final Map<SecurityScenarioEnum, SecurityScenario> securityScenarioMap = new LinkedHashMap<>();
    @Resource
    private List<SecurityScenario> securityScenarios;

    @Pointcut("@annotation(com.xiaojusurvey.engine.extensions.security.scenario.annotation.DataSecurity)")
    public void pointcut() {
    }

    @Around("pointcut()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        Method method = signature.getMethod();
        DataSecurity annotation = method.getAnnotation(DataSecurity.class);
        if (Objects.nonNull(annotation)
                && Objects.nonNull(annotation.securityScenario())
                && securityScenarioMap.containsKey(annotation.securityScenario())) {
            // 获取指定场景的处理器
            SecurityScenario securityScenario = securityScenarioMap.get(annotation.securityScenario());
            DataSecurityInvocation invocation = new DataSecurityInvocation(method.getName(), method.getParameterTypes(), pjp.getArgs(), annotation);
            // 方法进入前处理
            DataWrapper dataWrapper = DataWrapper.builder().value(invocation.getArguments()).build();
            securityScenario.before(invocation, dataWrapper);
            invocation.setArguments((Object[]) dataWrapper.getValue());
            // 方法执行
            Object proceed = pjp.proceed(pjp.getArgs());
            DataWrapper proceedWrapper = DataWrapper.builder().value(proceed).build();
            // 方法结束处理
            securityScenario.after(invocation, proceedWrapper);
            return proceedWrapper.getValue();
        }
        return pjp.proceed();
    }

    @Override
    public void afterPropertiesSet() {
        if (!CollectionUtils.isEmpty(securityScenarios)) {
            securityScenarios.forEach(scenario -> securityScenarioMap.put(scenario.getSecurityScenario(), scenario));
        }
    }
}
