package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Slf4j
public class FileControllerTest {

    @Resource
    private FileController fileController;

    @Test
    void uploadWithValidRequestReturnsSuccess() {
        log.info("开始测试上传功能 - 有效请求");

        // 准备测试数据
        MultipartFile testFile = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "test data".getBytes());

        FileReq fileRequest = FileReq.builder()
                .file(testFile)
                .channel("")
                .build();

        // 直接调用方法
        RpcResult<FileResp> result = fileController.upload(fileRequest);
        log.info("上传方法调用完成，结果: {}", result);

        // 验证结果
        assertNotNull(result, "返回结果不应为null");
        assertEquals(200, result.getCode(), "响应状态码应为200");
        log.info("上传功能测试通过");
    }


    @Test
    void getUrlWithValidKeyReturnsSuccess() {
        log.info("开始测试获取URL功能 - 有效key");

        // 设置mock行为
        log.debug("模拟获取URL方法，返回: testUrl");

        // 直接调用方法
        RpcResult<String> result = fileController.getUrl("", "25476b2c3a474b12bc41e4d76d26ad82.jpg");
        log.info("获取URL方法调用完成，结果: {}", result);

        // 验证结果
        assertNotNull(result, "返回结果不应为null");
        assertEquals(200, result.getCode(), "响应状态码应为200");
        log.info("获取URL功能测试通过");
    }
}

