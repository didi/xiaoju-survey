package com.xiaojusurvey.engine.extensions.router;

import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public abstract class BaseRouter implements ApplicationContextAware {

    protected ApplicationContext applicationContext;

    public abstract void before(Invocation invocation);

    public abstract Result after(Result result);

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
