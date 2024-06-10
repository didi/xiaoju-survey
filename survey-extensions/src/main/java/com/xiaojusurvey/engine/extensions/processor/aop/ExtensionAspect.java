package com.xiaojusurvey.engine.extensions.processor.aop;

import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import com.xiaojusurvey.engine.extensions.router.BaseRouter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.lang.reflect.Method;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Aspect
@Component
public class ExtensionAspect implements InitializingBean {

    @Autowired
    private List<BaseRouter> routerList;

    private Map<Class, BaseRouter> routerMap = new LinkedHashMap<>();


    @Pointcut("@annotation(com.xiaojusurvey.engine.extensions.processor.annotation.Message) || @annotation(com.xiaojusurvey.engine.extensions.processor.annotation.Security)")
    public void pointcut() {
    }

    @Around("pointcut()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        Method method = signature.getMethod();
        for (Map.Entry<Class, BaseRouter> routerEntry : routerMap.entrySet()) {
            if (null != method.getAnnotation(routerEntry.getKey())) {
                Invocation invocation = new Invocation(method.getName(), method.getParameterTypes(), pjp.getArgs());
                routerEntry.getValue().before(invocation);
            }
        }
        Result result = new Result(pjp.proceed(pjp.getArgs()));
        for (Map.Entry<Class, BaseRouter> routerEntry : routerMap.entrySet()) {
            if (null != method.getAnnotation(routerEntry.getKey())) {
                result = routerEntry.getValue().after(result);
            }
        }
        return result.getValue();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (!CollectionUtils.isEmpty(routerList)) {
            routerList.forEach(e -> routerMap.put(e.annotationClass(), e));
        }
    }
}
