package com.xiaojusurvey.engine.extensions.message.impl;

import com.xiaojusurvey.engine.extensions.message.MessageProcessor;
import com.xiaojusurvey.engine.extensions.processor.Invocation;
import com.xiaojusurvey.engine.extensions.processor.Result;
import org.springframework.stereotype.Component;


@Component
public class TestMessageProcessor implements MessageProcessor {


    @Override
    public void before(Invocation invocation) {

    }

    @Override
    public Result after(Result result) {
        return new Result();
    }
}
