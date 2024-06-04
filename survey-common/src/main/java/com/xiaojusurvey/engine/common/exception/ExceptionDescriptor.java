package com.xiaojusurvey.engine.common.exception;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ExceptionDescriptor {


    private static final String PRE_FIX = "com.xiaojusurvey";

    private String serviceName;
    private String ipAddress;
    private String url;

    private List<ExceptionSummary> cause;

    private List<StackSummary> stack;

    private String info;

    private String traceId;

    public ExceptionDescriptor() {
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<ExceptionSummary> getCause() {
        return cause;
    }

    public void setCause(List<ExceptionSummary> cause) {
        this.cause = cause;
    }

    public List<StackSummary> getStack() {
        return stack;
    }

    public void setStack(List<StackSummary> stack) {
        this.stack = stack;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public static ExceptionDescriptor newFromException(Exception ex, String serviceName, String ipAddress, String url, String info, String traceId) {

        ExceptionDescriptor descriptor = new ExceptionDescriptor();
        descriptor.setServiceName(serviceName);
        descriptor.setIpAddress(ipAddress);
        descriptor.setUrl(url);
        descriptor.setInfo(info);
        descriptor.setTraceId(traceId);

        List<ExceptionSummary> exceptionSummaryList = new ArrayList<>();
        List<StackSummary> stackSummaryList = new ArrayList<>();

        //提取cause摘要信息
        Throwable t = ex;
        while (Objects.nonNull(t)) {
            exceptionSummaryList.add(new ExceptionSummary(t));
            t = t.getCause();
        }

        //提取栈信息
        descriptor.setCause(exceptionSummaryList);
        stackSummaryList.addAll(Arrays.asList(ex.getStackTrace())
                .stream()
                .filter((o) -> (o.getClassName().startsWith(PRE_FIX)))
                .map(StackSummary::new)
                .collect(Collectors.toList()));
        descriptor.setStack(stackSummaryList);
        return descriptor;
    }


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n");
        sb.append("异常提示信息:");
        if (Objects.nonNull(this.url)) {
            sb.append("\n");
            sb.append("请求地址:");
            sb.append(this.url.trim());
        }
        LambadaCounter counter = new LambadaCounter();

        if (Objects.nonNull(this.cause) && this.cause.size() > 0) {
            sb.append("\n");
            sb.append("异常原因：");
            sb.append("\n");
            this.cause.forEach((o) -> {
                counter.add();
                sb.append("【");
                sb.append(counter.current());
                sb.append("】 ");
                sb.append(o.getExceptionType());
                sb.append(" ");
                sb.append(o.getMessage());
                sb.append("\n");
            });
        }
        counter.reset();
        if (Objects.nonNull(this.stack) && this.stack.size() > 0) {
            sb.append("\n");
            sb.append("异常发生位置：");
            sb.append("\n");
            this.stack.forEach((o) -> {
                counter.add();
                sb.append("【");
                sb.append(counter.current());
                sb.append("】 ");
                sb.append(o.getTargetClass());
                sb.append("#");
                sb.append(o.getTargetMethod());
                sb.append(" [");
                sb.append(o.getLineNo());
                sb.append("]");
                sb.append("\n");
            });
        } else {
            sb.append("\n");
            sb.append("无定位提示信息");
        }

        if (Objects.nonNull(this.info)) {
            sb.append("\n");
            sb.append("补充提示信息：");
            sb.append("\n");
            sb.append(this.info);
        }
        return sb.toString();
    }

    public static class LambadaCounter {
        private Integer count;

        public LambadaCounter() {
            this(0);
        }

        public LambadaCounter(Integer start) {
            this.count = Objects.isNull(start) ? 0 : start;
        }

        public LambadaCounter add() {
            this.count++;
            return this;
        }

        public Integer current() {
            return this.count;
        }

        public LambadaCounter reset(Integer start) {
            this.count = Objects.isNull(start) ? 0 : start;
            return this;
        }

        public LambadaCounter reset() {
            return this.reset(0);
        }

    }
}
