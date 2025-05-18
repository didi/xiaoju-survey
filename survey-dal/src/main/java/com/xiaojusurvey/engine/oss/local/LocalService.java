package com.xiaojusurvey.engine.oss.local;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;

@Component
@Slf4j
public class LocalService {

    @Resource
    private LocalProperties localProperties;

    /**
     * 获取文件存储前缀
     *
     * @return 文件前缀
     */
    public String getFilePath() {
        return localProperties.getPathPrefix();
    }

    /**
     * 获取本地存储物理路径
     *
     * @return 物理路径
     */
    public String getPhysicalRootPath() {
        String staticType = localProperties.getLocalStaticRenderType();
        String physicalRootPath = "";
        if ("nginx".equals(staticType)) {
            physicalRootPath = localProperties.getNginxStaticPath();
        }
        if (!StringUtils.hasText(physicalRootPath)) {
            physicalRootPath = "public";
        }
        return physicalRootPath;
    }

}