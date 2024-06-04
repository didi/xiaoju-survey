package com.xiaojusurvey.engine.extensions.processor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invocation {

    private String methodName;

    private  Class<?>[] getParameterTypes;

    private Object[] getArguments;
}
