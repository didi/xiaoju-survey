package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import com.xiaojusurvey.engine.extensions.file.service.FileService;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Objects;

@RestController
@RequestMapping("/file")
public class FileController {

    @Resource
    private FileService fileService;

    /**
     * 上传文件
     *
     * @param fileReq 文件请求
     * @return 文件key和url
     */
    @PostMapping("/upload")
    public RpcResult<FileResp> upload(FileReq fileReq) {
        if (Objects.isNull(fileReq)) {
            throw new FileException("文件上传参数为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        return RpcResultUtil.createSuccessResult(fileService.upload(fileReq));
    }

    /**
     * 获取文件访问链接
     *
     * @param channel 存储oss的key
     * @param key     文件唯一标识符
     * @return 文件的访问链接
     */
    @GetMapping("/getUrl")
    public RpcResult<String> getUrl(@RequestParam("channel") String channel, @RequestParam("key") String key) {
        if (!StringUtils.hasText(key)) {
            throw new FileException("文件唯一标识符为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        return RpcResultUtil.createSuccessResult(fileService.getUrl(channel, key));
    }
}
