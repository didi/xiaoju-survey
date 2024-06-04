package com.xiaojusurvey.engine.extensions.processor.aop;


import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import com.xiaojusurvey.engine.extensions.processor.annotation.Message;
import com.xiaojusurvey.engine.extensions.processor.annotation.Security;
import com.xiaojusurvey.engine.extensions.router.MessageProcessorRouter;
import com.xiaojusurvey.engine.extensions.router.SecurityProcessorRouter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Objects;


@Aspect
@Component
public class ExtensionAspect {

    @Autowired
    private MessageProcessorRouter messageProcessorRouter;

    @Autowired
    private SecurityProcessorRouter securityProcessorRouter;

    @Pointcut("@annotation(com.xiaojusurvey.engine.extensions.processor.annotation.Message) || @annotation(com.xiaojusurvey.engine.extensions.processor.annotation.Security)")
    public void pointcut() {
    }

    @Around("pointcut()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        Method method = signature.getMethod();
        Message message = method.getAnnotation(Message.class);
        Security security = method.getAnnotation(Security.class);
        if (!Objects.isNull(message)) {
            Invocation invocation = new Invocation(method.getName(), method.getParameterTypes(), pjp.getArgs());
            messageProcessorRouter.before(invocation);
        }
        if (!Objects.isNull(security)) {
            Invocation invocation = new Invocation(method.getName(), method.getParameterTypes(), pjp.getArgs());
            securityProcessorRouter.before(invocation);
        }
        Result result = new Result(pjp.proceed(pjp.getArgs()));
        if (!Objects.isNull(message)) {
            result = messageProcessorRouter.after(result);
        }
        if (!Objects.isNull(security)) {
            result = securityProcessorRouter.after(result);
        }
        return result.getValue();
    }

}
