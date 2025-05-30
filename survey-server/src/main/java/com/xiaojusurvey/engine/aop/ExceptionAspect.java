package com.xiaojusurvey.engine.aop;

import com.xiaojusurvey.engine.common.exception.DaoException;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Order(-10000)
@Log4j2
public class ExceptionAspect {

    private static final String DEFAULT_ERROR = "未知异常,请与管理员联系";

    @Pointcut("execution(public * com.xiaojusurvey.*.controller..*Controller.*(..))")
    public void controllerPointcut() {
    }

    @Around("controllerPointcut()")
    public Object doAround(ProceedingJoinPoint proceedingJoinPoint) {
        try {
            return proceedingJoinPoint.proceed();
        } catch (DaoException | ServiceException | FileException e) {
            log.error("dao or service or file error：", e);
            return RpcResultUtil.createFailedResult(e.getCode(), e.getErrorMsg());
        } catch (Throwable t) {
            log.error("unkown error:", t);
            return RpcResultUtil.createFailedResult(DEFAULT_ERROR);
        }
    }
}
