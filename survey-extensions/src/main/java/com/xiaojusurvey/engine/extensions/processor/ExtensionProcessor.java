package com.xiaojusurvey.engine.extensions.processor;

public interface ExtensionProcessor {

    void before(Invocation invocation);

    Result after(Result result);

    int getOrder();
}
